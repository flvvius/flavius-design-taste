# Portfolio decisions

Observed in public source at `b1ec9593cd059b67acbd4533c2543c8f98f4be47`. The unchanged clone is in `/private/tmp/flavius-design-practice/source/portofolio`. Install and rendering work uses a separate runtime copy. Source takes precedence over stale README descriptions.

| Decision | Code evidence | Scope |
| --- | --- | --- |
| One handwriting face | `app/layout.tsx` imports Schoolbell at 400. `tailwind.config.ts` maps display, mono and hand to the same variable. | Portfolio identity. A mono class name does not establish a monospace face. |
| Large readable handwriting | `app/globals.css` sets body to 1.5625rem, line height 1.55. Hero is clamp 3rem to 7rem; sections 2.5rem to 5rem, leading near 1.05. Caption is 1.26rem/1.6. | Handwriting needs these dimensions; do not impose them on a SaaS table. |
| Reading measure | `.measure` and `maxWidth.measure` use 62ch. | Actual prose, not the whole canvas. |
| Rhythm and grid | `components/sections/Section.tsx` uses 1180px max width, 20/32px gutters, a 12-column composition and 48/80px section padding per side. | 96/160px between sections. Density is specific to this site. |
| Paper and one orange signal | Paper #f4efe6, material #ede5d6, shadow #e0d5c2, ink #2b211a, secondary #5c4f43, accent #d96b2b. | Brown and orange belong to the personal setting. Existing Personal room uses a darker readable accent-text. |
| Surfaces have material roles | Tailwind shadows are hard 2px/3px or 3px/4px offsets. Controls have irregular outlines; notes have tape. | Material objects, rather than a card around each section. |
| One drawing protocol | `components/art/ink.tsx` sets 1.7px currentColor strokes, round joins and sparse hatching. `.ink-art *` uses non-scaling strokes. | Shared illustration treatment, not a requirement to draw a shelf. |
| Pointer and entrance motion differ | Feedback commonly uses 180ms. `Scribble.tsx` defaults to 600ms drawing after 400ms delay. Global CSS includes reduced-motion and no-script fallbacks. | Do not infer a universal 300ms ceiling from this project. |
| Specific voice | `data/site.ts` uses first person, Bucharest, actual projects and ordinary work descriptions. | Lowercase is the owner's choice. Preserve proper names and precise errors in client work. |
| Mobile simplifies the metaphor | `TheShelf.tsx` changes illustrated desktop shelves into labelled links on small screens. | Keep destinations and names while adapting the visual setting. |

[Source tree](https://github.com/flvvius/portofolio/tree/b1ec9593cd059b67acbd4533c2543c8f98f4be47). [Capture manifest](captures/manifest.json) records supported viewports, font measurements, response status and errors. No dark palette is defined by this source.

Inference: the setting makes the work easier to remember because its objects relate to the owner. Code establishes the objects and labels; the effect on a visitor is visual judgment, not a measured usability result.
