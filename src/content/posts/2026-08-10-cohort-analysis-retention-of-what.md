---
title: Cohort Analysis Is Easy. Retention of What Is the Hard Part.
date: 2026-08-10
excerpt: Cohort tables are everywhere in analytics decks. Most of them still don't answer the one question that actually matters — retention of what, exactly?
tags: [Cohort Analysis, Retention, SQL]
---

Almost every analytics team eventually builds a cohort retention table: group users by signup month, plot what percentage are still active in month 1, month 2, month 3. It's a good chart. It's also, on its own, a shallow one — and I've seen it drive the wrong conversation more than once.

## The default cohort is usually the wrong cohort

The reflexive choice is to cohort by **signup date**. It's the easiest column to group by, so it's what ends up in the first dashboard. But signup date answers "when did this group start," not "what do these people have in common that would explain why they stay or leave." Two users who signed up the same week might behave nothing alike if one came through a paid acquisition channel and the other through a referral.

The more useful cuts are usually behavioral or structural:

- **Acquisition channel** — paid vs. organic vs. referral cohorts often have wildly different retention curves, and blending them into one signup-date cohort just averages the story away.
- **First-week engagement depth** — did the user complete the core action (uploaded data, built a dashboard, whatever "aha moment" your product has) in week one, or not?
- **Plan or pricing tier** — retention economics differ by segment, and a single blended curve can hide that your highest-value tier is actually churning faster.

## A simple SQL starting point

Nothing exotic — this is the shape almost every cohort query starts from, just swap `signup_month` for whichever cohort definition actually matters for the question you're answering:

```sql
with cohort as (
  select
    user_id,
    date_trunc('month', signup_date) as cohort_month
  from users
),
activity as (
  select
    user_id,
    date_trunc('month', event_date) as activity_month
  from events
)
select
  c.cohort_month,
  date_diff('month', c.cohort_month, a.activity_month) as months_since_signup,
  count(distinct a.user_id) as active_users
from cohort c
join activity a using (user_id)
group by 1, 2
order by 1, 2;
```

Once that runs, the real work starts: joining in whatever segment column (channel, plan, first-week behavior) actually explains the *why* behind the curve — not just the *when*.

## The takeaway

A cohort table tells you retention is going up or down. It doesn't tell you why, and "why" is what a pricing or product decision actually needs. If a retention chart can't answer "retention of which group, defined by what, compared to what" — it's a chart, not yet an insight.
