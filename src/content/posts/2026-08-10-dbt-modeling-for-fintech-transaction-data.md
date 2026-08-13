---
title: dbt Modeling for Transaction Heavy Fintech Data
date: 2026-08-10
excerpt: Card transactions and account balances do not forgive sloppy modeling the way a marketing dashboard does. A few dbt patterns, with actual SQL, make the difference between numbers people trust and numbers people quietly stop believing.
tags: [dbt, Data Modeling, Fintech]
---

Most data teams eventually land on some version of the staging, intermediate, and marts layering that dbt encourages. In a lot of domains that layering is just a nice organizational habit, something that keeps the project tidy. In consumer fintech, where the raw data is card transactions, account balances, and recurring payments, it stops being a nice habit and starts being load bearing. Get it wrong and the cost is not a confused stakeholder in a standup. It is a customer looking at their own balance and not trusting what they see.

I want to walk through a few patterns that show up again and again once you're modeling transaction data seriously, with actual SQL rather than just the theory of it.

## Staging: resist the urge to do anything clever

The staging layer for transaction data should be almost boring. Rename columns, cast types, standardize timestamps to one timezone, and deduplicate. That last one matters more here than in most domains, because card networks and payment processors retry webhooks and replay events after timeouts. It is completely normal to receive the same authorization twice with slightly different metadata attached. A staging model that does not defend against this will quietly double count spend somewhere downstream, and honestly, it usually is not caught until a customer notices their balance is wrong before an analyst does.

```sql
-- models/staging/stg_transactions.sql

with source as (
    select * from {{ source('core', 'transactions') }}
),

deduplicated as (
    select
        *,
        row_number() over (
            partition by transaction_id
            order by updated_at desc
        ) as row_num
    from source
)

select
    transaction_id,
    account_id,
    card_id,
    amount_cents,
    merchant_category_code,
    authorized_at,
    settled_at,
    status
from deduplicated
where row_num = 1
```

Nothing here is clever on purpose. No categorization, no joins to account data, no running totals. The only job of this layer is to hand downstream models a clean, deduplicated, one row per transaction version of the source data that they can trust without re-checking it themselves.

## Intermediate: where the money math has to be exact

This is where transactions get joined to accounts and cards, spend gets categorized by merchant type, and running balances start to take shape. It is also where the idempotency problem shows up in its sharpest form. A model that computes a running balance by summing transactions has to be built so that reprocessing the same day of data twice produces the same balance, not double the balance.

Late arriving transactions make this harder than it sounds. A card authorization can settle two or three days after it happens, and an incremental model that only looks at rows newer than the last run can quietly miss a transaction that shows up late with an older timestamp. The fix I keep coming back to is a lookback window, where each run reprocesses the last several days instead of just whatever is newest.

```sql
-- models/intermediate/int_transactions_enriched.sql

{{
  config(
    materialized='incremental',
    unique_key='transaction_id',
    incremental_strategy='merge'
  )
}}

select
    t.transaction_id,
    t.account_id,
    t.amount_cents,
    t.settled_at,
    c.category_group
from {{ ref('stg_transactions') }} as t
left join {{ ref('merchant_category_map') }} as c
    on t.merchant_category_code = c.merchant_category_code

{% if is_incremental() %}
where t.settled_at >= (
    select dateadd('day', -5, max(settled_at)) from {{ this }}
)
{% endif %}
```

That five day window is not a magic number, it just needs to be wider than however long your slowest settling transactions realistically take to show up. Keying the merge on `transaction_id` is what keeps a reprocessed row from becoming a duplicate row instead of an update.

## Marts: build around a question, not a table

The marts layer is where a lot of modeling effort quietly gets wasted on tables that mirror the source system instead of answering something a person actually asks. Balance over time. Spend by category. Detected recurring payments. Each of those maps to a real question someone downstream is going to ask, in a dashboard or in a support conversation. A marts layer that just re-exposes "transactions" and "accounts" as slightly cleaner tables hasn't really done the translation work that makes a semantic layer worth having.

## Tests have to include reconciliation, not just hygiene

`not_null` and `unique` tests are table stakes. They catch real problems, but they're hygiene checks, not trust checks. Financial data needs a second category of test that asks whether the numbers actually add up.

```sql
-- tests/assert_balances_reconcile.sql

with computed_balance as (
    select
        account_id,
        sum(amount_cents) as computed_balance_cents
    from {{ ref('int_transactions_enriched') }}
    group by account_id
),

reported_balance as (
    select
        account_id,
        balance_cents
    from {{ ref('stg_account_balances') }}
)

select
    r.account_id,
    r.balance_cents as reported_balance_cents,
    c.computed_balance_cents,
    abs(r.balance_cents - c.computed_balance_cents) as discrepancy_cents
from reported_balance as r
join computed_balance as c
    on r.account_id = c.account_id
where abs(r.balance_cents - c.computed_balance_cents) > 100
```

A dbt singular test just returns rows for whatever it considers a failure, so here any account off by more than a dollar fails the build. That kind of test does not exist in most non-financial data models, mostly because most non-financial data does not have an independently verifiable ground truth the way a ledger does. In fintech it usually does, and skipping this check just means the first person to catch a discrepancy is a customer instead of a test suite, which is exactly backwards from how you want to find out.

## The modeling layer is the trust layer

None of this is exotic, honestly. Layered models, incremental strategies with a lookback window, reconciliation tests, these are all fairly standard dbt patterns once you've built them a few times. What changes in a fintech context is how little slack there is for getting them wrong. A dashboard that's off by a few percent because of a bad join is annoying in most businesses. In a product where people check their balance before deciding whether they can afford something, that same small error is not just annoying, it's the thing standing between a raw event stream and a number someone is about to make a real decision on.
