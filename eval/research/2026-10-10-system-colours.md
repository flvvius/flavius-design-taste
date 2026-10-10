# System colours before initialization

Reviewed on 10 October 2026 after the library reading correction.

[Primer CSS](https://github.com/primer/css) was inspected at `9b8bcf361aa4c8353576091c0d588b972eeedaac`. Its [colour-mode mixins](https://github.com/primer/css/blob/9b8bcf361aa4c8353576091c0d588b972eeedaac/src/support/mixins/color-modes.scss) distinguish explicit light and dark modes from an automatic mode. Automatic selectors sit inside `prefers-color-scheme` media queries. This lets CSS choose the palette before JavaScript runs. The source also treats selection and backdrop styles separately. This is the thirteenth distinct repository studied across the research passes; Primer's Sass and its theme catalogue are outside this repo's scope.

The [CSS media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme) reflects the user agent or operating-system preference. A browser can match that preference while a page still paints its default palette. The next check must inspect actual semantic colours, then test a live preference change and an explicit user override. Adding automatic styling must preserve existing manual theme consumers.

The cycle 27 baseline compares light and dark preferences with page scripts disabled. It records media matching, painted colours, source hashes and document availability separately. All three engines match the dark query but retain `oklch(0.99 0.002 80)` as the page background. The transition probe confirms that enabled scripts already follow a live preference change and preserve an explicit light choice across later changes. Implementation and verification of script-independent automatic colours remain pending.
