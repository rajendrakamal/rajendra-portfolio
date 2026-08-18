---
title: A/B Testing in Practice: What Actually Trips People Up
date: 2026-08-18
excerpt: The math behind a t-test is the easy part. Almost every A/B test that goes wrong goes wrong somewhere else, usually before the test even starts or in the week someone gets impatient and checks the dashboard too early.
tags: [A/B Testing, Statistics, Experimentation]
---

Ask most analysts to explain a t-test and they can do it fine. Ask them to explain why last quarter's "significant" result didn't hold up when the feature actually shipped, and the conversation gets more interesting. The statistics behind A/B testing are genuinely the easy part. What actually causes tests to mislead people almost always happens somewhere else: before the test starts, or in the middle of it, when someone gets impatient.

## The sample size conversation nobody wants to have

Every A/B test has a minimum detectable effect, whether or not anyone calculates it up front. If your baseline conversion rate is 4 percent and you only have enough traffic to run the test for a week, there's some effect size below which you simply cannot reliably detect a difference, no matter how the numbers come out. Running the test anyway and reading the result at the end is how a lot of "no significant difference" conclusions get reported when the honest answer was "we couldn't have detected this even if it existed."

```python
from scipy.stats import norm

def required_sample_size(baseline_rate, minimum_detectable_effect, alpha=0.05, power=0.8):
    p1 = baseline_rate
    p2 = baseline_rate * (1 + minimum_detectable_effect)
    pooled = (p1 + p2) / 2

    z_alpha = norm.ppf(1 - alpha / 2)
    z_beta = norm.ppf(power)

    numerator = (z_alpha * (2 * pooled * (1 - pooled)) ** 0.5
                 + z_beta * (p1 * (1 - p1) + p2 * (1 - p2)) ** 0.5) ** 2
    denominator = (p2 - p1) ** 2

    return numerator / denominator
```

Run that with a 4 percent baseline and a 10 percent relative lift, and you'll need somewhere around 20,000 visitors per arm to have a reasonable shot at detecting it. That number tends to be the moment a stakeholder either agrees to run the test for a month or decides they'd rather chase a bigger swing that's actually detectable in the traffic they have.

## Peeking is the one that gets everybody eventually

Checking a test's p-value every day and stopping as soon as it crosses 0.05 feels harmless. It is not. A single significance test assumes you looked once. If you look ten times over the course of an experiment, the chance that you catch a randomly significant result somewhere along the way is much higher than 5 percent, even if there's no real effect at all.

| Day | Cumulative visitors | p-value |
|-----|----------------------|---------|
| 3   | 900                  | 0.04    |
| 5   | 1,500                | 0.09    |
| 7   | 2,100                | 0.03    |
| 10  | 3,000                | 0.11    |
| 14  | 4,200                | 0.02    |

That table is a simulation of a test where there is no true difference between arms at all, just noise settling as more data comes in. Someone checking on day 3 or day 7 or day 14 would have shipped the feature. Someone checking on day 5 or day 10 would have called it a wash. Both are looking at the exact same underlying experiment. The fix isn't to stop checking, it's to either commit to a fixed sample size decided before the test starts, or use a sequential testing method that's actually designed to be checked repeatedly without inflating the false positive rate.

## The metric you optimize for is rarely the metric that matters

A test that improves click-through rate on a checkout button by 8 percent sounds like a clear win until someone checks whether it also increased returns, or whether it moved revenue at all, or whether it just made people click twice as often without actually buying more. Picking a single primary metric before the test starts, and a short list of guardrail metrics that have to stay flat, is what keeps a test from becoming a story you tell yourself after the fact about whichever number happened to move.

## Novelty wears off, and so does suspicion

A redesigned interface often gets a short term lift simply because it's new and people are paying more attention to it, not because it's actually better. The same is sometimes true in reverse, where a change performs worse in week one simply because returning users are confused by something unfamiliar, then recovers once they adjust. A test that only runs for a few days can mistake either of these for a permanent effect. Running long enough to cover at least one full behavioral cycle, usually a week or two at minimum, catches most of this before it becomes a wrong decision baked into the roadmap.

## The part that's actually hard

None of the statistics here are advanced. A two-proportion z-test is something most people learn in a first stats course. What's hard is the discipline around it: deciding on a sample size before you start and sticking to it, agreeing on one primary metric before you see any data, and resisting the very human urge to check the dashboard every morning and read meaning into whatever it says that day. The test itself is rarely the problem. The process around it usually is.
