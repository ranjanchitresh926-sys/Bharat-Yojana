# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Citizens — primarily farmers, BPL cardholders, elderly pension applicants, and persons with disabilities — in the situation of not knowing which government schemes they already qualify for, doing the job of getting a fast, trustworthy answer without navigating dozens of separate scheme websites, likely on a low-end phone with unreliable or metered data. 
Officers and admins are the secondary users, on ordinary desktop browsers, doing the job of verifying and monitoring what citizens submit.

## Product Purpose
Makes it possible to check eligibility once, honestly, in the citizen's own language, and then actually track that interest through to a verified decision — not just a scheme lookup. 

## Positioning
Every claim the product makes about itself is enforced or disclosed, not asserted — real consent records before data leaves the browser, real server-side role gates on every sensitive read and write, real aggregate-only analytics, real disclosure when something is simulated rather than a genuine government transaction.

## Operating Context
No formal user research exists — this is a hackathon-originated student project. Durable constraints that must survive any future redesign: device and data constraints are real, not stylistic.

## Capabilities and Constraints
No 3D, heavy motion, or large media. Never build a page that could pass as an official government e-service. Never expose per-citizen data even to admins.

## Brand Commitments
Strictly a Student Project for Smart India Hackathon. It is not affiliated with the Government of India. Any page handling sensitive data or mimicking a workflow must clearly state that it is an internal tool or student project.

## Evidence on Hand
The 22-scheme registry in lib/seedData.ts is real curated data with sourcing citations, not placeholder content — treat it with the same care as production data.

## Product Principles
1. Never claim automation or real-time sync that doesn't verifiably exist.
2. Never build a page that could be mistaken for a real government e-service.
3. Default to aggregate, not individual, data exposure — even to admins.
4. A claim that something works is not evidence that it works — every non-trivial change needs a real, reproducible check before it's treated as done.
5. Design for the least-resourced user first — low-end device, limited data, not-English-first.
