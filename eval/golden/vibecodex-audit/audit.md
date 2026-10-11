# VibeCodex audit

The visitor chooses a practice project, searches available templates, then follows its instructions. The existing interface works with local data. It spends most of the first screen on screenshots and repeats marketing hero spacing on useful catalogs. Reviewed four screens and seven states at 375/1280 in light/dark. Captures and code support the findings below; taste scores are self-review.

| Rank | Screen/state and evidence | Consequence and fix | Effort | Risk | Confidence | Level |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | /start radios have no associated label in original markup | Keyboard users hear an unnamed choice. Bind existing visible titles with aria-labelledby; keep IDs and values. | 15m | Low | High | POLISH |
| 2 | /projects input has only placeholder | Name disappears while typing. Add persistent visible label. | 10m | Low | High | POLISH |
| 3 | Original essential input boundary is hsl240/5.9/90 on white | Control blends into page. Give input its own contrasting token, leaving incidental hairlines quiet. | 15m | Low | High | POLISH |
| 4 | /projects1280 capture shows tall phone previews stretching rows; image h-full has no constrained height | Comparing effort requires scrolling past marketing screenshots. Constrain previews and use horizontal comparison rows. | 45m | Medium | High | RESTRUCTURE |
| 5 | /projects four pill categories occupy a crowded narrow row | Long category names compete on mobile. Wrap controls with explicit pressed states. | 20m | Low | High | RESTRUCTURE |
| 6 | /guides hero py32 and a second centered category heading precede links | Readers scroll before choosing a guide. Left-align compact page title and guide list. | 30m | Medium | High | RESTRUCTURE |
| 7 | /learning-path repeats marketing hero spacing and cards within cards | Experience selection is secondary to chrome. Compact hero and simplify milestone surfaces. | 30m | Medium | Medium | RESTRUCTURE |
| 8 | AnimatedBackground has continuously floating blobs and no reduced-motion handling | Irrelevant motion persists during reading. Remove decoration in scoped catalogs and apply reduced-motion override. | 15m | Low | High | POLISH |
| 9 | GradientButton declares asChild but omits it when rendering Button | Nested button/anchor markup creates competing focus stops. Forward existing asChild prop; preserve href and click behavior. | 10m | Medium | High | POLISH |
| 10 | Multiple saturated guide icon boxes, colored pills, gradients and Share/Get Started compete with content | The visual hierarchy describes generic AI tooling. Keep one violet identity accent and text-based metadata. | 30m | Medium | Medium | POLISH |

The project filter uses project.id.includes(tab) rather than the documented category. Some categories are empty. That is a pre-existing product behavior, not silently fixed in a visual sprint. Empty state and reset remain available. Several rows lack a time estimate in the original data; no estimate has been invented.

## Rubric

| Category | Before | Proposed after | Reason |
| --- | --- | --- | --- |
| Hierarchy | 2 | 3 | Catalog actions precede promotional artwork. |
| Grouping and density | 1 | 3 | Project comparison uses consistent rows. |
| Product fit | 2 | 3 | A working learning library, with preview media retained. |
| Responsive composition | 2 | Pending | Verify reflow and actual 200% text. |
| States and copy | 3 | 3 | Local empty/search states are already truthful. |
| Interaction | 3 | Pending | Preserve contract and compare links. |
| Accessibility | 1 | Pending | Named controls, input boundary and focus need measured checks. |

Functional and accessibility gates remain separate. A passing Next build does not certify TypeScript because upstream disables build errors. Existing unrelated TypeScript failures are recorded in types-before.log.

## Representative decision and sprint

Use Editorial calm as a project variant. Preserve VibeCodex and its violet identity, factual copy, media, routes, defaults and local data. The catalog is the first prototype. Its row anatomy makes title, level, time and completion count comparable. Extend only after viewing the actual light/dark and mobile render.

Recommend one 3-5 screen sprint covering projects, guides, goal selection and learning path. Ship semantic token polish, catalog layout, other-screen anatomy and functional copy as separate commits. Exclude backend features, filter semantics, auth, new navigation and external publication.

## Walkthrough outline

1. Search a project and trigger the genuine empty state.
2. Show the original tall images and comparison cost.
3. Compare the redesigned catalog at desktop and mobile.
4. Demonstrate named controls, selection and reset.
5. Explain the preserved category behavior and unrelated type failures.
6. Propose the four-screen sprint and show regression evidence.

## Prototype handoff

The project catalog prototype is complete. It has the same seven destinations and local records. Case-insensitive search, empty state and reset passed browser checks;375px geometry stays within the viewport. The light desktop and dark mobile renders were reviewed. Catalog self-review scores are hierarchy 3, grouping 3, product fit 3, responsive 3, states/copy 3, interaction 3 and accessibility 3 for the checked catalog cases. The earlier proposed scores describe the recommended whole sprint, not completed work on the other screens.

The audit stops here. The unnamed radios, guide hierarchy and other-screen reflow are findings for the sprint, rather than claims of fixes in this one-screen prototype. Existing TypeScript failures and missing learning-path logo files remain named limitations. The elapsed time includes one screen and this handoff; its start/end record is in timing.json. Independent full redesign evidence is kept in the sibling run.
