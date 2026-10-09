# Cycle 05: appointment booking

The builder produced a native-input form with date limits, unavailable slots, inline validation and a confirmation preview. The reviewer verified invalid and available choices, error focus, safe text rendering, preview focus and invalidation after edits. It found the enlarged title's longest word overflowing by eight pixels.

The title now uses language-aware hyphenation with a long-word fallback. Independent rechecking confirmed that its 64px enlarged size and full text remain visible within 375px in both themes. Shared guidance distinguishes prose/heading wrapping from the intact monetary values tested in cycle 03.

The growing artifact collection also exposed the limited scope of the original asset checker. Package checks now traverse local documentation, HTML and CSS links, including image tags and bundled font URLs. A negative probe demonstrated missing docs/images/fonts fail and restoring them passes; external links remain outside this local check. Evidence is in eval/asset-link-checks.json.

Original and final browser reports, screenshots, independent review and recheck remain alongside the fixture. No live scheduling service or native platform build was evaluated.
