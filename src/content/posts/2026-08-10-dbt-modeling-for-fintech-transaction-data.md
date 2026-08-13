---
title: dbt Modeling for Transaction Heavy Fintech Data
date: 2026-08-10
excerpt: Card transactions and account balances do not forgive sloppy modeling the way a marketing dashboard does. A few dbt patterns make the difference between numbers people trust and numbers people quietly stop believing.
tags: [dbt, Data Modeling, Fintech]
---

Most data teams eventually adopt some version of the staging, intermediate, and marts layering that dbt encourages. In a lot of domains, that layering is a nice organizational habit. In consumer fintech, where the raw data is card transactions, account balances, and recurring payments, it stops being a nice habit and becomes a requirement, because the cost of a wrong number is not a confused stakeholder. It is a customer looking at their own balance and not trusting what they see.

## Staging: resist the urge to do anything clever

The staging layer for transaction data should be almost boring. Rename columns, cast types, standardize timestamps to a single timezone, and deduplicate. That last part matters more here than in most domains. Card networks and payment processors retry webhooks, replay events after timeouts, and occasionally send the same authorization twice with slightly different metadata. A staging model that does not defend against duplicates will quietly double count spend somewhere downstream, and it usually is not caught until a customer notices their balance is wrong before an analyst does.

No business logic belongs at this layer. No categorization, no joins to account data, no running totals. The only job of staging is to produce a clean, deduplicated, one row per event version of the source data that every downstream model can trust without re-checking it.

## Intermediate: where money math has to be exact

This is where transactions get joined to accounts and cards, spend gets categorized by merchant type, and running balances get computed. It is also where the idempotency problem shows up in its sharpest form. A model that computes a running balance by summing transactions has to be built so that reprocessing the same day of data twice produces the same balance, not double the balance. That usually means keying incremental logic off a stable transaction identifier and being deliberate about the window of data a given run touches, rather than assuming yesterday's run and today's run will never overlap.

Late arriving transactions make this harder. A card authorization can settle two or three days after it happens, and a naive incremental model that only looks at "new rows since last run" can miss a transaction that arrives late with an old timestamp. A lookback window, where each run reprocesses the last several days rather than just the newest rows, is a simple fix that costs a bit of compute and saves a lot of quiet data drift.

## Marts: build around a question, not a table

The marts layer is where a lot of modeling effort gets wasted on tables that mirror the source system instead of answering something a person actually asks. Balance over time, spend by category, detected recurring payments. Each of those maps to a real question someone downstream is going to ask in a dashboard or a support conversation. A marts layer that just re-exposes "transactions" and "accounts" as slightly cleaner tables has not actually done the translation work that makes a semantic layer useful.

## Tests have to include reconciliation, not just hygiene

`not_null` and `unique` tests are table stakes, and they catch real problems, but they are hygiene checks. Financial data needs a second category of test that checks whether the numbers actually add up. A model that reports account balances should have a test comparing the sum of transaction amounts per account against the balance figure itself, flagging any account where those two numbers disagree by more than a rounding tolerance. That kind of test does not exist in most non-financial data models because most non-financial data does not have an independently verifiable ground truth the way a ledger does. In fintech, it usually does, and skipping that check means the first person to catch a discrepancy is a customer, not a test suite.

## The modeling layer is the trust layer

None of this is exotic. Layered models, incremental strategies with lookback windows, and reconciliation tests are all fairly standard dbt patterns. What changes in a fintech context is how little slack there is for getting them wrong. A dashboard that is off by a few percent because of a bad join is an inconvenience in most businesses. In a product where people check their balance before deciding whether they can afford something, the modeling layer is not just infrastructure sitting behind the app. It is the thing standing between a raw event stream and a number someone is going to make a real decision on, and it has to be treated with the seriousness that implies.
