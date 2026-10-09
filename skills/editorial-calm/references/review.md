# Review

Inspect the rendered screen, not just its classes.

Before a new screen, name its user, primary task and content hierarchy. Inspect the existing behavior and preserve the requested scope. Decide whether the screen is for scanning, reading or repeated task work, then choose the appropriate density. Typography, shared backgrounds and restrained separators carry this taste; a row, grid or grouped operator tool is a decision about content, not a required page template.

Write a short rationale for the hierarchy, grouping and navigation. If another composition would help the task, compare it before building. A small correction does not need a fresh design presentation.

Look at the render before reading automated findings. Check whether the main action is apparent, whether content can be scanned in the right order and whether repeated rows share the same anatomy. Then use the measurements to investigate failures.

- Remove boxes whose absence changes no interaction or meaning.
- Check hierarchy at narrow, medium and wide sizes. Keep section headings quieter than row content.
- Check light and dark modes, long labels and enlarged text. Enlarge all text, not only inherited body text; explicit sizes on figures and controls need checking too. No clipping or sideways prose scrolling.
- Check text contrast against its actual background. Normal text needs 4.5:1, large text 3:1; focus and essential control boundaries need 3:1. Decorative separators may be quieter. Essential chart marks also need checking against adjacent colours; see [Charts](charts.md). Palette defaults are not certification for every combination.
- Warning and success colours may need a darker text variant on light backgrounds. Do not assume every chart or status colour works as body text.
- Traverse controls by keyboard or platform accessibility navigation. Check names, focus, target sizes and non-colour state cues.
- Check a 320 CSS pixel layout separately from text enlargement. Apply user text-spacing overrides as well: 1.5 line height, 2em after paragraphs, .12em tracking and .16em word spacing. These are resilience checks, not new defaults.
- Test important actions twice. Close and reopen overlays, retry failed requests and follow the same destination again. Check where focus lands after activation, not only whether an outline exists.
- Confirm that the action produces the result its label promises. A success message alone does not establish that a preview, download or saved change exists.
- Enable reduced motion. Verify that content remains understandable when animation disappears.
- Compare repeated content across screens. Equivalent content should share anatomy.

Report actual visual checks and platform builds performed. A browser specimen proves browser behaviour only; native adoption needs a native render and build.

Record each finding with its screen, trigger, observed behavior and effect on the task. Distinguish interaction failures, readability problems and visual preferences. Recheck the scenario after fixing it. Separate verified, failed and unverified results; identify self-review when no independent reviewer took part.
