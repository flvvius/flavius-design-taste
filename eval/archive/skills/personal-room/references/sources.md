# Where the decisions came from

Inspected on 9 October 2026. These notes record the references used to build the taste; future changes to either site do not silently redefine it.

## Flavius's portfolio

Read the local `~/Projects/portofolio` source and checked the rendered [public portfolio](https://flavius.pro). The local source is the authority for this extraction.

- `app/globals.css` defines cream `#f4efe6`, warm paper `#ede5d6`, paper shadow `#e0d5c2`, ink `#2b211a`, soft ink `#5c4f43` and orange `#d96b2b`. It uses one paper grain, irregular control outlines and hard shadows.
- `app/layout.tsx` loads Schoolbell at 400. Despite the names `font-display`, `font-mono` and `font-hand`, the current `tailwind.config.ts` maps all of them to Schoolbell. This is a single handwritten voice, not a serif-and-monospace pairing.
- `tailwind.config.ts` specifies a 3rem to 7rem hero, 2.5rem to 5rem section titles and 96px to 160px section rhythm. `components/sections/Section.tsx` sets a 1180px container and a twelve-column grid.
- `components/art/ink.tsx` uses 1.7px brown strokes, round caps and joins, cross-hatching and non-scaling strokes. The turntable, shelf and other objects relate to the owner's work and interests.
- `TheBar.tsx` pairs a large left headline with a right illustration. `TheShelf.tsx` uses captioned objects on desktop and labelled links on mobile. A project remains a link even when a script opens its story.
- `data/site.ts` gives the site a location, interests and casual first-person voice. These are content decisions worth carrying forward; its projects and exact copy are not generic templates.
- Feedback is often 180ms; entrances use 400ms and drawn marks 600ms. The CSS includes reduced-motion and no-JavaScript fallbacks.

## Cluj House

Inspected the rendered [Cluj House homepage](https://clujhouse.com/), its HTML and its linked stylesheets, `/_astro/index.DjvjmqZN.css` and `/_astro/ascii-camera.B-Y4EA5N.css`.

The shared styles define navy `#0b2851`, deeper blue `#113c7a`, chalk `#f5f2ec` and coral `#ffa194`. The page uses Schoolbell at 400, a large centred headline, narrow centred prose and substantial gaps between sections. The poster opening has a washed photograph and scattered music references, with asymmetric outlined actions. Several marks use deliberately uneven outlines and small rotations. A drawn path connects the visit sequence; it becomes a vertical list on mobile. These choices make the page feel connected to a place and its people.

The reusable decisions are the poster composition, navy/chalk contrast, coral annotation, physical invitations and personal cultural references. The house's identity, songs, photographs, slogan and exact layout belong to that reference. The taste does not ship those assets or turn its contact process into a universal rule.

## What this skill changes

The paper and night palettes preserve the reference colours. `accent-text` darkens portfolio orange to `#a44415` for normal text on cream. Muted text and input colours are adaptations checked for contrast, rather than translucent text copied from the sites. The default 24px handwriting body is a portable starting point; the current portfolio uses 25px.

The example drawings and copy in this repository are original. Schoolbell is bundled under its Apache License 2.0, with the upstream copyright notice. The font comes from the [Google Fonts Schoolbell directory](https://github.com/google/fonts/tree/main/apache/schoolbell). No reference photographs, music artwork or logos are redistributed. The night example demonstrates the poster direction without relying on a background photograph or ASCII effect. Neither is necessary for the taste to work.
