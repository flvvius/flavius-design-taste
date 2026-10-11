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

## Final measured review

The four-screen implementation is complete. Final self-review scores are hierarchy 3, grouping 3, product fit 3, responsive 3, states/copy 3, interaction 3 and accessibility 3. These replace the proposed scores above. Taste remains provisional for Flavius's review. [rubric.json](rubric.json) records the gates separately.

All 14 exercised behavior triggers pass. Main-content href lists match before/after exactly on all four screens. Local project data is byte-identical. The baseline counter animation starts at 0 and runs for 1 second when each number enters the viewport; the initial full-page captures include unsettled/offscreen counts. The redesign renders the same underlying count immediately. A separately saved scrolled-and-settled baseline avoids confusing that animation with changed data.

The same solid-text scan across four routes and two themes reports zero contrast failures. Input boundaries measure 4.07:1 light and 5.47:1 dark. Keyboard focus is a visible 2px ring. Reflow at 320,375 and1280, plus actual doubled text, has no horizontal overflow. Reduced-motion pages report no running CSS animations. These checks do not certify screen readers or physical devices.

Framework build passes before/after. Standalone TypeScript still fails with byte-identical pre-existing errors; the upstream build disables type/lint failures. No claim of a clean typecheck is made. Open mobile-sheet and milestone states have separate before/after evidence. Loading is the actual local hydration state; no backend error state exists to capture safely.
