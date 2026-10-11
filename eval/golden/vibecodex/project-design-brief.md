# VibeCodex redesign brief

A public AI-coding learning catalog, built with v0.dev and Cursor according to its README. Improve four screens: project catalog, learning guide catalog, goal selection and learning path. Use Editorial calm with a restrained violet identity accent. Preserve all data and destinations. No upstream publication.

## Discovery

Next 14.2.16 App Router, React 18, Tailwind 3, shadcn/Radix, next-themes. Existing HSL variables in app/globals.css are the source. No auth, roles, analytics or server mutations in the selected flow. Project and guide data are local. Goal selection writes selectedGoal to localStorage and pushes /projects. Build disables type and lint checks upstream; run TypeScript separately and report failures.

## Behavior contract

| ID | Trigger | Expected result | Check |
| --- | --- | --- | --- |
| C1 | Search catalog | Case-insensitive title/description filter | Search Kanban, then no-match term |
| C2 | Select catalog category | Original project.id.includes category filter remains | Data category empty and reset |
| C3 | Reset filters | All tab and empty query restored | Empty-state reset |
| C4 | Select project | Original /projects/id destination | Compare rendered hrefs |
| C5 | Choose goal, continue | Same selectedGoal string saved, /projects push | Pick prototype and inspect storage |
| C6 | Learning experience buttons | Correct beginner/intermediate/advanced content | Click each, inspect headings |
| C7 | Theme toggle | Light/dark root class and persistent theme | Toggle then reload |
| C8 | Mobile navigation | Sheet opens, Escape closes, focus returns, links navigate | Keyboard and mobile smoke |
| C9 | Guide links | Original local/external destinations unchanged | Compare href inventory |
| C10 | Dropdown navigation/share | Existing menu items and URLs stay | Open More and Share, Escape |

No credentials or external service calls. Empty project filter exists. Loading is hydration/mount animation, not a network request. No application error state exists for local data. Long content can be tested with the longest real titles; no fabricated backend error.

## Composition

Project catalog is the representative screen. Keep preview media because it describes actual projects, use hairline-separated rows for comparing title, effort and difficulty. Extend a shared page title/section anatomy to the other three screens. Retain the goal form's radio selection and learning-path controls. Tokens first, then layout, then functional copy.
