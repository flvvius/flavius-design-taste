---
name: flavius-design
description: Audit or redesign an existing app in its codebase, or build a new website with Flavius's editorial or personal design taste. Use for code-delivered visual work, preserving product behavior and choosing a subject-specific direction.
---

# Flavius design

Ship useful interfaces with an authored character. Choose a mode from the actual request. Keep the client's behavior, factual copy and useful identity. Personality comes from this subject, not an inventory of decorative UI furniture.

Read the [shared DNA](../../core/dna.md) and [principles](../../core/principles.md) when making project-wide choices. Use [voice](../../core/voice.md) for functional copy and [anti-patterns](../../core/anti-patterns.md) to question unexamined defaults. Cream, hairlines, serif display type, Inter and deliberate material objects remain valid.

## Choose a mode

| Request | Mode | Deliverable |
| --- | --- | --- |
| Find and rank the problems | audit | Top 10 evidence-based findings, one representative redesigned screen, sprint recommendation and handoff. |
| Improve an existing app or flow | redesign | Reviewable code changes, before/after and a rechecked behavior contract. |
| Start a website | new-site | Brief, two composition options, one complete page, remaining pages and verified states. |

A narrow correction keeps its scope. Do not turn it into a whole-app redesign. An audit can include a reviewable prototype or isolated branch for its one screen; it stops before extending implementation across the app.

## Existing apps

Read [codebase discovery](references/codebase-discovery.md), then [the audit rubric](references/audit-rubric.md). Discover the theme and behavior before altering either. Write a [project design brief](assets/project-design-brief.template.md) into the client project with the do-not-break contract and known data boundaries. Capture representative routes and states before proposing fixes.

In audit mode, fill the [audit template](assets/audit.template.md), then produce its single representative screen within the authorized scope. Record how it would ship and recommend a sprint. Do not invent ten findings when fewer defects exist; explain the remaining opportunities and confidence.

In redesign mode, read [redesign](references/redesign.md) and [intervention levels](references/intervention-levels.md). Choose a preset or an explicitly documented project variant. Get one screen right before extending to the remaining authorized flow or screens. Apply tokens, then layout, then copy. Keep intervention levels in separate commits and include rationale and regression evidence.

## New sites

Read [new-site](references/new-site.md). Start with the [brief](assets/brief.template.md), content inventory and page structure. Show two small compositions that differ in hierarchy or spatial arrangement, not just palette. Choose one subject-grounded visual idea. Build a complete representative page, then extend it. The [starter](assets/starter/README.md) is an optional Next.js/Tailwind v4 example, not a required stack.

## Directions and authorization

[Editorial calm](../../directions/editorial-calm/SKILL.md) suits recurring task work and restrained rows. [Personal room](../../directions/personal-room/SKILL.md) suits expressive personal subjects and meaningful objects. These are starting points; the brief decides. Pricele broadsheet choices are recipes, not a third direction. One chosen direction owns page typography, palette and composition when combining influences.

Respect authorization already given. Ask for missing approval immediately before work that requires it, after making the result concrete and reviewable. Do not ask again for approvals the client has already supplied.

- Establish scope and behavior boundaries before implementation.
- RETHINK FLOW needs explicit client approval. POLISH and RESTRUCTURE can proceed within approved scope.
- Present the representative screen before extending, unless the client has authorized autonomous implementation. Record the chosen composition and why.
- Sending messages, publishing, changing external data or merging needs applicable authorization; installing a taste does not grant it.

## Verify and deliver

Read [verification](references/verification.md) before delivery. Recapture the same routes/states, rerun the behavior contract, measure actual contrast and focus, and check 200% text. Re-score the rubric. Functional and accessibility failures are gates; visual preference scores cannot average them away.

Use the [implementation plan](assets/implementation-plan.template.md) for reviewable batches and the [handoff](assets/handoff.template.md) to distinguish verified, failed and unverified results. Report limitations honestly. Tests and screenshots establish only the cases they actually cover.

Optional Node helpers are documented in [scripts/README.md](scripts/README.md). Capture requires locally available Playwright; discovery and linting need only Node. Installed packages contain their supporting taste files and do not require this repository, a component library or a paid API.
