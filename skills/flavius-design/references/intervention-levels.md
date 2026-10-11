# Intervention levels

| Level | What changes | Approval and evidence |
| --- | --- | --- |
| POLISH | Type, spacing, color, contrast and visual consistency. | Existing visual scope can authorize it. Recheck global token consumers. |
| RESTRUCTURE | Grouping, layout and component anatomy while keeping destinations and actions. | Needs scope covering the affected screen/flow. Recheck binding, focus and responsive structure. |
| RETHINK FLOW | Navigation, interaction order, actions, defaults or the behavior contract. | Explicit client approval before implementation. Present the proposed behavior and consequence first. |

A button moving within the same form can be RESTRUCTURE. Replacing that form with a wizard changes interaction order and is RETHINK FLOW. Renaming an action to a clearer verb can be POLISH; changing what it submits is a flow change.

Never mix levels silently in one commit. A batch can declare one level; dependent work can use separate commits. Authorization supplied earlier remains valid. Stop only the dependent work when a required decision is missing, and continue useful independent work.
