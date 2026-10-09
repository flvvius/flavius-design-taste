# Build a personal room

## Composition

Start with the owner, the content and the action someone came to take. Pick a setting that explains those things. A ceramicist's bench, an author's annotated page or a local film club's noticeboard can support this taste without borrowing the portfolio's bar.

For an asymmetric page, use a wide container around 1180px, with text taking roughly seven of twelve columns and one illustration taking the rest. Supporting sections can reverse the balance. For a poster page, centre a short headline, give it room to breathe, and keep prose around 640px wide. Left align long reading even if the opening is centred. Full viewport height is optional; a small screen should not push the action below the fold just to preserve a desktop poster.

Use 96px between sections on small screens, rising toward 160px on large screens. This is the total gap between sections, not padding on both sides of each. Nearby captions need much less space. Keep paragraphs around 45 to 62 characters per line and avoid manually breaking every sentence for one viewport.

Choose one main visual gesture, such as a drawing beside the headline or a real photograph behind a poster. Other sections can echo its line treatment with smaller marks. Do not build a room full of unrelated decorative props.

## Typography and materials

The bundled Schoolbell font covers basic Latin. It is optional. For unsupported scripts or missing fonts, choose an available face with reliable glyphs and adjust size by eye. Do not depend on Comic Sans being installed. Use the system reading stack for extended writing, unfamiliar scripts or dense work. A font that looks handwritten at 16px can read much smaller than ordinary body type. Start near 24px for Schoolbell prose and 20px for labels; keep at least 1.5 line height. Headings use size rather than artificial bold or tight tracking.

Import `assets/tokens.css` and `assets/fonts.css` from the installed skill folder. The default palette is paper; set `data-personal-room="night"` on the root for night. Properties are prefixed `--pr-` so they can coexist with an existing theme. Example names are `--pr-background`, `--pr-type-hero`, `--pr-layout-section-gap` and `--pr-material-sketch-radius`. Map them to your framework or native styling system as needed. The JSON contains literal hex colours and CSS dimensions, with no library-specific schema.

A 1.7px SVG stroke with rounded joins is a useful starting pen. Keep it consistent with `vector-effect="non-scaling-stroke"` on each path. Uneven geometry can be drawn directly; a filter is optional. Do not distort text with an SVG displacement filter. Texture should stay faint, ignore pointer events and sit behind content. One page-wide texture is enough. Essential boundaries must use the input colour, not the decorative separator colour.

Photography belongs to the subject. On night, a navy wash can quiet a background photograph while keeping the headline readable. Check contrast against its lightest and darkest areas. Provide a solid fallback and image dimensions. ASCII rendering is an optional treatment for a real image, never a required canvas effect or a reason to conceal the original content.

## Objects and controls

An illustrated object is an actual link with a visible title below or beside it. Give it a destination even if a script adds a detail panel. Repeated activation must reopen the same destination, even when its hash has not changed. Move keyboard focus to a visible heading or disclosure control after navigation. An object used only for atmosphere is decorative and should not accept focus. Keep text labels visible on touch; hover captions may supply extra detail but cannot carry the only name or destination.

Buttons can use the irregular radius token with a 2px border. Their text and hit area stay rectangular and stable. Focus uses a visible ring outside the object, independent of its hover animation. Gate pointer hover lift and tilt with `(hover: hover) and (pointer: fine)`. Keyboard focus can use colour and an outline without movement. Touch activation must work without hover.

Use real headings, lists and form labels. A sequence may use a drawn connecting path on desktop, but its DOM stays an ordered list. Collapse it to a vertical sequence on mobile. Do not turn an ordinary group of projects into numbered steps.

For forms and app screens, keep the expressive title, colour and a useful aside, then use conventional controls and plain labels. Data rows, toolbars and validation stay aligned and readable. Personality should survive a practical screen without requiring an illustrated room around every field.

## Responsive and native work

On narrow screens, move text before the supporting object, collapse shelves to labelled lists, and remove decorative overhangs before shrinking type. Preserve every meaningful link. Keep standalone touch targets at least 44px across and allow navigation to wrap. Check a 320px viewport, then double every computed text size, including explicit labels, before checking again. A doubled root size alone misses pixel-sized text. Also test user overrides of line height, paragraph spacing, tracking and word spacing. Do not hide overflow to disguise a broken layout. Give flexible grid columns `minmax(0, 1fr)` and shrinkable text children `min-width: 0`; allow object names to wrap. Limit tilted notes to slightly less than the available width so rotation cannot clip their text.

Native mobile and desktop apps can use the palette, title voice and illustrations while keeping platform focus, navigation and controls. Use the native font for dense interface text. Respect larger text and screen-reader order. Do not reproduce a desktop diorama on a phone when a short labelled list would carry the same content.

## Motion and fallbacks

Animate transforms or opacity for small feedback. An object can lift 6px and add about 1.5 degrees to its resting tilt. Optional entrances can settle over 400ms; drawn marks can take 600ms. Do not stagger every paragraph or replay reveals on each scroll. If content starts hidden for an entrance, only enable that state after the animation system has successfully initialised and provide a failsafe.

With reduced motion, show final marks, stop continuous movement and remove lift, tilt and entrance travel. A soundtrack is optional, has a named play/pause control, and never starts on load. No work or contact action depends on media playback, an external API or a canvas rendering.

## Forced colours

Let the browser replace the palette in forced-colour mode. Keep native links, buttons and field boundaries; avoid `forced-color-adjust: none` on the whole page. A selected option needs a shape or text marker that survives colour replacement. For adjacent palette buttons, a forced-colour underline on `[aria-pressed="true"]` distinguishes selection from the keyboard focus outline. Check the marker after switching options, not only on first load. Shadows and texture may disappear without changing the reading order or hiding an action.

## Review the result

Open it on a wide and narrow screen, with the font unavailable and with reduced motion. Tab through the interactive objects. Read the content without the illustrations. It should still tell you whose page it is, what they do and where the links go. If removing the handwriting leaves a generic sales page, improve the content and composition before adding more doodles.
