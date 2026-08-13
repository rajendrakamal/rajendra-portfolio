---
title: Slowly Changing Dimensions, and Why Type 2 Gets Most of the Attention
date: 2026-08-13
excerpt: A customer moves cities, a product gets recategorized, an employee changes titles. How your dimension table handles that change decides whether last year's reporting still means anything today. Includes dbt snapshot code and a couple of before and after tables.
tags: [dbt, Data Modeling, SCD]
---

Dimension tables describe things: customers, products, employees, stores. Most of the time those descriptions don't stay put. A customer moves from Toronto to Calgary, a product gets reassigned to a new category, an employee gets promoted. The question a slowly changing dimension strategy answers is simple to state and easy to get wrong in practice: when that attribute changes, what happens to the reporting that already happened under the old value?

There are a handful of named approaches to this, usually numbered zero through six, but in practice almost everyone ends up reaching for the same two or three. I want to walk through the ones that actually come up, with enough detail that the difference is concrete rather than academic.

## Type 0: some things just don't change

A quick one first. Type 0 means the attribute is fixed once written and never updated again, no matter what happens upstream. A customer's original signup date is a good example. Even if a source system somehow "corrects" that value later, you often want to keep the first one you ever recorded, because it's the one your historical cohorts were built on. Not every attribute needs a strategy. Some just need to be left alone.

## Type 1: overwrite, and accept that history is gone

This is the default most people reach for without thinking about it, because it's just an update.

```sql
update dim_customers
set city = 'Calgary'
where customer_id = 100;
```

Before the update, every report ever run against this row said Toronto. After it, every report, including ones re-run against last year's data, says Calgary. That's fine for attributes where the current value is the only one that matters, like a customer's current marketing opt-in status. It's a quiet problem for attributes that feed historical analysis, because it rewrites the past without telling anyone.

| customer_id | city    | valid as of        |
|-------------|---------|---------------------|
| 100         | Toronto | before the update    |
| 100         | Calgary | after, and also retroactively |

## Type 2: add a new row, and keep the old one intact

This is the one that gets most of the attention, because it's the one that actually preserves history. Instead of overwriting the row, you close out the old version and insert a new one, each with its own validity window.

```
Row 101  [Toronto]  ────────────●  closed 2026-03-14, is_current = false
Row 102  [Calgary]              ●───────────────────▶  is_current = true
                     2024-01-01     2026-03-15
```

| customer_key | customer_id | city    | valid_from | valid_to   | is_current |
|--------------|-------------|---------|------------|------------|------------|
| 101          | 100         | Toronto | 2024-01-01 | 2026-03-14 | false      |
| 102          | 100         | Calgary | 2026-03-15 | null       | true       |

Notice the surrogate key. `customer_id` still identifies the person, but `customer_key` identifies this specific version of them, and that distinction is what makes everything else work. Fact tables join to the surrogate key, not the natural key, which is what lets an old order stay attached to the customer's old city.

dbt has a built in feature for exactly this, called a snapshot, and it saves you from writing the row closing logic by hand.

```sql
-- snapshots/customers_snapshot.sql

{% snapshot customers_snapshot %}

{{
    config(
      target_schema='snapshots',
      unique_key='customer_id',
      strategy='timestamp',
      updated_at='updated_at',
    )
}}

select
    customer_id,
    city,
    email,
    updated_at
from {{ source('core', 'customers') }}

{% endsnapshot %}
```

Running this on a schedule gives you `dbt_valid_from` and `dbt_valid_to` columns automatically, plus a `dbt_scd_id` that acts as the surrogate key. The strategy can also be `check`, which compares a list of columns instead of relying on an updated_at timestamp, useful when the source system doesn't reliably stamp its own updates.

The payoff shows up downstream, in how you join a fact table to a Type 2 dimension.

```sql
select
    f.order_id,
    f.order_date,
    d.city as customer_city_at_order_time
from {{ ref('fct_orders') }} as f
join {{ ref('dim_customers_scd2') }} as d
    on f.customer_id = d.customer_id
    and f.order_date >= d.valid_from
    and (f.order_date < d.valid_to or d.valid_to is null)
```

That's the whole point of the pattern. An order placed in 2025 joins to the Toronto row, not the Calgary one, because the join condition matches on the date range the order actually happened in, not on whichever row happens to be current today.

## Type 3: keep just the previous value

Sometimes you don't need full history, you just need to be able to compare the current value against the one immediately before it. Type 3 does that with an extra column instead of an extra row.

```sql
alter table dim_customers add column previous_city varchar;

update dim_customers
set previous_city = city,
    city = 'Calgary'
where customer_id = 100;
```

| customer_id | previous_city | city    |
|-------------|----------------|---------|
| 100         | Toronto        | Calgary |

This is cheap and easy to query, since there's no row explosion and no date range joins. The tradeoff is that it only remembers one step back. If the same customer moves a second time, the Toronto value is gone for good. It's a reasonable fit for attributes where "what changed most recently" is the actual business question, like tracking a sales rep's previous territory during a handoff period.

## A couple of variants worth knowing exist

Type 4 moves the history into a separate table entirely, keeping the main dimension small and fast while a companion history table holds every past version. Type 6 is a hybrid that combines 1, 2, and 3 in a single row, current value overwritten in place, full history preserved in other rows, and a previous value column for convenience. Both are real patterns you'll see in mature warehouses, but they're refinements on the same tradeoff Type 2 and Type 3 already represent, not fundamentally new ideas, so I won't go deep on them here.

## Picking one

In practice the decision is less complicated than the numbering suggests. Default to Type 1 for attributes where only the current value is ever queried. Reach for Type 2 the moment a historical report needs to reflect the world as it was, not as it is now, which is most of the time for anything that feeds trend analysis or cohort reporting. Save Type 3 for the narrow case where one step of history is genuinely all anyone will ever ask for. The types aren't a hierarchy where higher is better, they're different answers to the same question, and the right one depends entirely on whether the past is allowed to change when the present does.
