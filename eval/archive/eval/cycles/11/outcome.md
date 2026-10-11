# Cycle 11: Personal room resilience

The starting specimen passed its package checks and a doubled-root-font check. It failed when every rendered text size doubled, including fixed-size labels. At 320px, the page grew to 357px in both palettes. Opening a project, closing the story and activating the same object again also left the story closed.

The [baseline report](before-checks.json) was captured from commit `59c14fc`, using that commit's files in an isolated temporary directory. The six baseline screenshots retain normal, enlarged and spacing states for both palettes.

Flexible grid columns now use zero minimums. Text children can shrink, object labels wrap and can move below their drawings, and tilted notes leave room for rotation. Font sizes use rem values. Hover travel is limited to fine pointers. Repeated links reopen their disclosure, and keyboard activation focuses a visible summary.

[After-checks](after/checks.json) record 24 layout reports across both maintained examples, with 320px, 390px, 768px and 1440px normal views, every text size doubled at 320px, and text-spacing overrides. Interaction checks cover repeated links, keyboard destinations, the skip link, palette activation, reduced motion, touch and missing-font/no-script use.

The root agent reviewed the normal and enlarged renders. This was self-review, not an independent builder/reviewer run. Visual inspection caught the narrow enlarged-name columns after the first correction had already passed the overflow check. The final captures show names taking the available width.

The shared Personal room guidance now describes these cases and distinguishes a visual judgment from a measured check. Reproduce current checks with `npm run check:browser`; the historical report retains its own source hashes and does not automatically represent a future revision.
