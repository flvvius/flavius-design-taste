---
name: editorial-calm
description: Apply Flavius Cojocaru's Editorial calm design taste to app interfaces on web, mobile or desktop. Use for building, restyling or reviewing screens when this taste is requested or installed as the project's design direction.
---

# Editorial calm

Typography, whitespace and hairlines carry the design. Content sits on the page background. Use this taste within the user's requested scope; adopting it does not authorize redesigning unrelated screens or publishing work.

## Decisions that matter

- Start with the content hierarchy. Establish a page title, quieter section headings, row titles, body and metadata before adding decoration.
- A section is not a surface. Settings, forms, summaries, figures and empty states live directly on the page.
- Surfaces are earned by overlays, media frames and interactive controls. Dense operator tools may need grouped surfaces; explain the function they serve. Ask what breaks if a box disappears.
- Repeated items are hairline-separated rows. Use grids when comparison or media browsing requires them, without wrapping every item in chrome.
- Titles use weight 600. Body uses 400 and labels 500. Section headings are sentence case, roughly body size. Reserve a tracked uppercase kicker for a meaningful content category.
- Use semantic colour roles from `assets/tokens.json`. Graphite is the default action colour. Status is text plus a label or glyph, not a decorative tinted pill. Use `warning-text` for warning copy; `warning` is an accent or fill. Use `input` for essential control boundaries and `border` for decorative separators. Charts may introduce labelled domain colours.
- Figures use tabular digits and a muted label. Empty states use a short explanation and at most one useful action. Loading placeholders mirror the final content geometry.
- Navigation remains stable on frequent screens. No floating blurred docks or decorative scroll motion. Motion communicates a state change and ends within 300ms. Springs are for gestures.

## Apply it

Read the platform reference needed for the work:

- [Web](references/web.md) for HTML, React, Vue, Svelte or browser shells.
- [Mobile](references/mobile.md) for React Native, SwiftUI, Compose or Flutter.
- [Desktop](references/desktop.md) for native desktop or Electron/Tauri.
- [Patterns](references/patterns.md) when deciding how a screen should be structured.
- [Charts](references/charts.md) for data plots, series identification and readable alternatives.
- [Review](references/review.md) before delivering a visual change.

Use the portable tokens as defaults, not as an excuse to ignore accessibility or platform conventions. Larger text, localisation, keyboard use and touch targets must work. If a brand requires another accent, change the semantic primary pair and validate contrast; preserve hierarchy and restraint.

Keep domain colours, objects and navigation specific to the app being built. Do not require Tailwind, React or Inter to apply this taste. Use the platform's system font when Inter is unavailable. The same decisions should remain recognisable across different frameworks.
