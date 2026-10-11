# Rank an audit

Inspect the baseline before reading lint findings. Describe the visitor's task, where attention goes and what the next action is. Separate a broken behavior, a readability defect and a taste preference.

Score each category from 0 to 4 using evidence. Zero means the category prevents the task; one needs major correction; two works with visible friction; three is clear with small corrections; four works across checked states and fits its subject. Mark N/A only with a reason.

| Category | Evidence |
| --- | --- |
| Hierarchy | Main task and action are apparent; title, body and metadata have useful roles. |
| Grouping and density | Relationships and comparison are clear without unnecessary chrome. |
| Product fit | Type, imagery, expression and voice explain the actual subject. |
| Responsive composition | Mobile, long labels and 200% text retain the task. |
| States and copy | Empty/loading/error/success states describe truthful results and recovery. |
| Interaction | Routes, focus, forms and mutations satisfy the behavior contract. |
| Accessibility | Rendered contrast, names, boundaries, focus and keyboard access pass checked cases. |

Function and accessibility failures are pass/fail gates alongside scores. Do not hide them in an average. Overall taste is provisional until Flavius or the client reviews it.

Each finding needs screen/state, evidence, user consequence, proposed fix, effort, regression risk, confidence and intervention level. Evidence can be a capture, a measured value or a reproducible interaction. Confidence describes the finding, not the agent's enthusiasm.

Rank task-blocking and essential readability fixes first, then structural friction, consistency and taste. Explain ties. A 15-minute token correction and a navigation redesign have different risks. Recommend a sprint with one flow or 3-5 screens, dependencies and explicit limits.

Audit delivery includes the ranked top 10 where ten supported findings exist, one redesigned representative screen, rubric scores, a walkthrough outline and sprint recommendation. Time discovery through final handoff, including the screen. Do not claim a client-ready audit from a ranked list alone.
