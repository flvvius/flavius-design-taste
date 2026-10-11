---
name: personal-room
description: Apply Flavius Cojocaru's Personal room design taste to personal sites, portfolios, community pages and expressive app screens. Use when this taste is requested or installed as the project's direction, with handwritten typography, meaningful objects and paper or navy palettes.
---

# Personal room

Make the page feel like someone made it for their own corner of the internet. A recognisable hand, a few objects with a reason to be there, and words the owner would actually say. Choose the setting from the subject before drawing anything.

## Decisions that matter

- Let a large handwritten headline carry the opening. Schoolbell at weight 400 is the reference voice. Hierarchy comes from size and spacing; keep tracking natural. Handwriting needs larger body text than a system sans. Use a readable native or system face for dense tables, forms and long reading, while keeping handwriting in titles and asides.
- Choose one palette for the page. Paper uses warm cream, brown ink and burnt orange. Night uses deep navy, chalk and coral. These are two art directions, not a requirement to offer a theme switch. Read [tokens.json](assets/tokens.json) for portable defaults; [tokens.css](assets/tokens.css) and [fonts.css](assets/fonts.css) work without a build step.
- Compose on a real grid, then let one drawing or note overhang it. Paper usually suits an asymmetric text-and-object opening. Night can suit a centred poster and narrow sections. Neither arrangement is mandatory. Keep the headline and next action clear before adding texture.
- Use objects that belong to this person or place. A tool, a sketch, a photograph or something they collect can represent work or interests. Give clickable objects a visible name and an ordinary link destination. A shelf, record player or house is reference content, not a reusable requirement.
- Draw with one pen. Use consistent line weight, rounded caps, slightly uneven paths and sparse hatching. Scale SVG objects with non-scaling strokes. Avoid mixing polished icon sets, cartoon clipart and pencil drawings in the same scene.
- Most content lives directly on the background. A note, ticket, label or photograph can earn a material surface. For paper objects, choose an ink edge or a small hard offset shadow. Use tape only where something appears attached. Keep ordinary sections and every repeated item out of decorative boxes.
- Spend marks selectively. An underline can emphasise a thought; an arrow can point to its subject. A couple of accent marks in a content group is a useful starting limit, not a quota. Rotate individual objects or short notes a few degrees. Leave paragraphs, input fields and essential labels upright.
- Use colour for both personality and meaning. `accent` is decorative ink; `accent-text` is the readable text variant. Orange from the portfolio needs this darker text variant on cream. Use `input` for essential control boundaries and `ring` for focus. Identify status with words as well as colour.
- Write in a person's voice. Specific work, interests and place names beat promotional claims. Lowercase can suit the voice, but preserve proper names, acronyms and the user's wording. Playful labels still need to explain their destination. Errors and destructive actions should be plain.
- Let an object lift or straighten for a fine pointer. Keyboard focus uses a visible outline without travel. Keep feedback near 180ms. Longer drawing or entrance motion is optional and should happen once. Content is visible before JavaScript runs; reduced motion leaves all words and marks visible. Sound requires an explicit play action.

## Apply and review

Use [the decision and critique guide](references/review.md) before a new composition and before delivery. It separates the visitor's task, visual judgment and measured behavior.

Read [the implementation guide](references/implementation.md) when building a screen. It covers composition, controls, mobile, native apps and interaction fallbacks. Read [the native guide](references/native.md) for platform type scaling, colour updates and control sizing. Read [the source notes](references/sources.md) to understand which decisions came from each reference and which are adaptations.

Before delivery, check that the page has a specific owner or subject, that one main gesture carries its personality, and that the objects say something about its content. Remove any prop that could move unchanged to an unrelated site. Check narrow screens, enlarged text, keyboard focus, reduced motion and missing fonts. Meaningful work and contact links must still work without animation or JavaScript.

This taste is a separate choice from Editorial calm. If combining them at the user's request, decide which controls page typography, colour and layout; do not quietly inherit Editorial calm's semibold headings or 300ms motion ceiling. Preserve the requested product behaviour and scope. No framework, component library, paid API or repository tooling is required.
