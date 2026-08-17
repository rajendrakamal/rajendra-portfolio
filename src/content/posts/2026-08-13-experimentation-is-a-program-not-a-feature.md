---
title: Experimentation Is a Program, Not a Single Test
date: 2026-08-13
excerpt: Running one A/B test is a Tuesday afternoon. Running experimentation as a discipline, where dozens of tests overlap and half of your ideas can't actually be randomized, is a different problem entirely.
tags: [Experimentation, A/B Testing, Analytics]
---

There's a difference between running an A/B test and having an experimentation program, and it's not just scale. A single test is a question with a clean answer: does this button color convert better than that one. A program is what happens once a company is running fifteen tests at once, half of them touching the same page, some of them lasting weeks, and someone has to decide which results to trust and which ideas can't be tested this way at all.

## The first problem is contamination, not statistics

The moment you have more than one experiment running at a time, you have to think about whether they're stepping on each other. A pricing test and a checkout redesign test running simultaneously on the same users means neither result is clean on its own, because you can't tell whether a change in conversion came from the price, the redesign, or the interaction between them. Mature experimentation programs solve this with some combination of mutually exclusive traffic allocation, where a given user can only be in one experiment from a conflicting group at a time, and an experiment registry that at least makes the overlap visible even when it can't be fully avoided.

| Experiment | Traffic layer | Overlaps with |
|------------|----------------|----------------|
| Checkout redesign | Layer A | none |
| Pricing display test | Layer A | Checkout redesign |
| Email subject line test | Layer B | independent of A |
| Recommendation algorithm | Layer C | independent of A and B |

A layer structure like this is a fairly standard way to keep experiments that would genuinely interfere with each other from ever running against the same users at the same time, while letting unrelated tests run freely in parallel.

## Fixed horizon tests aren't the only tool

Most people picture a classic A/B test when they hear the word experimentation: two arms, split evenly, run for a fixed period, compare at the end. That's the right tool for a lot of questions, but not all of them. A multi-armed bandit approach, which shifts traffic toward whichever variant is currently performing better as the test runs, trades statistical cleanliness for lower opportunity cost, which matters a lot more when the cost of showing users a worse variant is high, like pricing or a critical funnel step.

| | Fixed horizon A/B test | Multi-armed bandit |
|---|---|---|
| Best for | Clean, defensible comparisons | Minimizing cost of a bad variant |
| Traffic split | Fixed throughout | Shifts toward the winner |
| Statistical clarity | High | Lower, harder to explain after the fact |
| Good fit | Feature decisions, UI changes | High stakes, high traffic funnels |

Neither one is universally better. The choice depends on whether you need a defensible answer for a decision document, or whether you mostly just want to stop losing money to the worse variant as fast as possible.

## Sometimes you can't randomize at all

Some of the most important questions in a business are the ones you can't A/B test cleanly. Rolling out a new sales process to one region and not another isn't random, it's usually driven by market readiness or team capacity, and that means the region that got the change and the region that didn't were probably already different in ways that affect the outcome. Network effects cause a similar problem in marketplaces and social products, where treating one user differently can spill over and affect the people connected to them, quietly breaking the assumption that each unit is independent.

In situations like this, a difference-in-differences approach is often the closest thing to a real answer. Instead of comparing treatment to control directly, you compare the change over time in the treated group against the change over time in a similar untreated group, which at least accounts for trends that would have happened anyway.

```sql
with region_metrics as (
    select
        region,
        case when region = 'treated_region' then 1 else 0 end as is_treated,
        case when metric_date >= '2026-06-01' then 1 else 0 end as is_post_period,
        avg(conversion_rate) as avg_conversion_rate
    from regional_daily_metrics
    where region in ('treated_region', 'control_region')
    group by 1, 2, 3
)

select
    (max(case when is_treated = 1 and is_post_period = 1 then avg_conversion_rate end)
     - max(case when is_treated = 1 and is_post_period = 0 then avg_conversion_rate end))
    -
    (max(case when is_treated = 0 and is_post_period = 1 then avg_conversion_rate end)
     - max(case when is_treated = 0 and is_post_period = 0 then avg_conversion_rate end))
    as difference_in_differences
from region_metrics
```

That query is computing exactly what the name suggests: the change in the treated region minus the change in the control region, over the same time window. It's not as clean as a randomized test, and it leans on the assumption that both regions would have trended similarly without the change, which is worth checking against historical data before trusting the result too much. But it's a real answer to a question that couldn't be answered any other way.

## What actually makes a program mature

None of this is about running more tests. A team running thirty shallow tests a quarter with no registry, no guardrail metrics, and no plan for what to do when two experiments overlap isn't more rigorous than a team running five tests a quarter properly. The maturity shows up in the boring infrastructure: a shared registry so nobody launches a conflicting test by accident, a default set of guardrail metrics every test has to respect regardless of what it's optimizing for, and an honest acknowledgment that some of the most important changes a business makes were never going to be clean randomized experiments in the first place, and need a different kind of rigor instead.
