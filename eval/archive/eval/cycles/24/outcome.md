# Cycle 24: Focus through responsive control changes

The original document-library review removed clipped header controls from the narrow tab sequence. The new [Chromium](before/chromium.json), [Firefox](before/firefox.json) and [WebKit](before/webkit.json) baselines reproduce a separate defect at commit `7e184b4a847576906e2cb36e8bf2e90680aaa349`: shrinking leaves existing focus in the clipped header, while widening drops mobile-control focus to the body.

The library now transfers focus between equivalent visible controls. Select-all maps to select-all. A header sort button maps to the narrow sort selector; returning from the selector or direction button focuses the header for the current sort key. The handler preserves sorting, selection and row content. It remembers mobile focus through CSS disappearance, clears that memory on an ordinary visible blur, and leaves focus on rows or the view selector alone.

The maintained helper checks twelve resize cases per theme, a visible outline, unclipped ancestry and viewport geometry. It independently specifies expected row order and selection. Keyboard activation after transfer checks both select-all controls, sort direction and the header for a newly selected sort key. Explicit blur must stay blurred. Additional checks cover partial selection, archive, undo, repeated archive, restore, an empty archive and undoing restore. Two deliberate mutations remove the transfer and the reverse sort transfer; each is rejected at its specific missing destination in all three engines.

The [research notes](../../research/2026-10-10-focus.md) connect W3C keyboard guidance to the reproduction and record a pinned Radix philosophy and focus-scope comparison. The shared web guide adds the portable responsive-focus rule. The example remains freely navigable and adds no framework or service dependency.

| Local engine | Layout checks | State and interaction checks | Unverified conditions | Failures |
| --- | ---: | ---: | ---: | ---: |
| [Chromium](after/chromium.json) | 206 | 162 | 0 | 0 |
| [Firefox](after/firefox.json) | 206 | 162 | 0 | 0 |
| [WebKit](after/webkit.json) | 206 | 157 | 5 | 0 |

The library adds two interaction groups to the default run, one per theme. It does not join the full layout matrix yet. Its retained [Chromium](after/chromium-light-focus.json), [Firefox](after/firefox-light-focus.json) and [WebKit](after/webkit-light-focus.json) observations record each focus destination; corresponding dark-theme records are retained alongside them. All captured runtime hashes match the final files.

The [initial Chromium run](before/chromium-incomplete-run.json) stopped during a chart-disclosure click after 89 layouts. It is incomplete evidence. The final engines ran sequentially and all completed. Screenshot review also required keyboard modality before retaining the final focus captures. The root agent reviewed the [Chromium dark](after/chromium-dark-narrow-focus.png), [Firefox light](after/firefox-light-narrow-focus.png) and [WebKit dark](after/webkit-dark-narrow-focus.png) captures. Each shows the visible mobile sort control and its ring. This is self-review; screen-reader behavior and physical devices remain unverified.

A separate [enlarged-text review](after/enlarged-review.json) and [capture](after/enlarged-review.png) confirm remaining library work. With all text synthetically doubled at 320px, the view selector extends to 374px and creates horizontal overflow. The generic scanner also reports clipped semantic headers and small painted checkbox glyphs, which need assessment against their actual visibility and associated label hit areas. Those candidates are not all product defects. The measured selector overflow is a concrete next finding, and the passing interaction checks do not resolve it.

Validation: token build, package checks and all twelve tooling fixtures passed in Chromium. The new library fixture passed separately in Firefox and WebKit. The complete final browser suite passed in all three engines. CI runs the expanded fixture and browser suite for each engine.
