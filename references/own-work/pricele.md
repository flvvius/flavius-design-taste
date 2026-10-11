# Pricele decisions

Observed in public source at `5dc8352651c66808f483c3e1faad924ac5c3e58b`. The original clone remains unchanged. Runtime installation uses a separate copy and does not refresh data or connect a database.

| Decision | Code evidence | Scope |
| --- | --- | --- |
| Type roles come from the subject | `app/layout.tsx` imports Instrument Serif 400, Archivo and IBM Plex Mono 400/500/600. | Serif headlines, upright UI and monospace figures. A config comment naming Geist is stale; imports are authoritative. |
| Display scale | `.display` is 400, leading .92 and tracking -.02em. Page titles are 2.75/3.5rem. Masthead clamp 1.625 to 2.0625rem; reveal figure 3.5 to 5.5rem. | Headlines and the game's price reveal, not body copy or small control labels. |
| Reading and standing heads | `ContentPage.tsx` sets prose 16px/1.7 with `max-w-prose`. `.label` is .6875rem, mono 500, uppercase, tracking .16em. | Tracked caps identify categories. They do not become all page copy. |
| Dense game, wider reference pages | Game owns a compact column. ContentPage uses max-w-2xl, then max-w-5xl, 16px gutters and 32px main gaps. | Density follows the activity. |
| Broadsheet rails | ContentPage and Section use a 13rem heading rail, remaining copy column and 48px gap on large screens; small screens stack. | Reusable recipe, not another aesthetic direction. |
| Semantic editions | Paper #f2ede1, raised #faf7ef, body ink #3d352c, primary ink #1a1613. Night paper #12100d, ink #f6f1e6. CSS maps existing neutral roles into edition variables. | Theme migration can preserve old classes while changing their meaning consistently. |
| Accent budget | Vermilion #c4321c, night #f2543a. Win, streak and a five-step hotter/colder ramp have game meaning. | One expressive accent does not prohibit labelled domain colors. |
| Structural rules | Border roles #d5ccb8 and #e4dcca separate rows and aligned regions. Reference pages use page background. A reveal figure and modal can earn a boundary. | Avoid claiming that all boxes are forbidden. |
| Radius and elevation | Hard-ruled board; rounding belongs to controls. Panel shadow is 0 24px 60px -24px plus 0 2px 8px -2px. | Floating panels, not ordinary sections. |
| Motion fits state | Press 140ms, fast 180ms. CSS defines set-in 260ms, print-in 460ms, sheet-in 340ms and shorter exits. Ease-out is cubic-bezier .23/1/.32/1; sheet .32/.72/0/1. | No single duration fits every gesture. Reduced-motion rules retain content. |
| Imagery and grain | One pointer-transparent static grain layer, .055 paper/.05 night. Item thumbnails identify actual products. | Paper texture is deliberate, not decorative gradient furniture. |
| Voice and mobile | Page copy explains prices, methodology and play. Theme toggle says paper/night edition. Rails collapse; essential game figures remain intact. | Editorial vocabulary belongs to the game. A settings page still needs clear action names. |

[Source tree](https://github.com/flvvius/pricele/tree/5dc8352651c66808f483c3e1faad924ac5c3e58b). [Capture manifest](captures/manifest.json) records local paper/night renders.

Inference: hierarchy and aligned rules make the interface read like a publication. The code proves type roles and grouping; the perceived editorial character needs human judgment. Color tokens alone do not prove contrast for each actual pairing.
