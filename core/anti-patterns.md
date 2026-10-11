# Anti-patterns

These are context-dependent findings, derived from the principles and existing reviews. Their rejection is an inference about fit, except measurable readability and behavior failures. None bans cream, serif type, hairlines, paper grain, Inter or deliberate material objects.

The deterministic linter identifies candidates, not intent. A client brief can record an exception. Use `taste-allow rule-id -- concrete reason` next to deliberate code, or a narrow file-and-rule entry in `.flavius-design-lint.json`. Do not use a blanket suppression to make a report green.

## nested-cards. Cards inside ordinary section cards

Why: Repeated boundaries obscure grouping.

Applies: Repeated sections and rows.

Limits: Nested overlays, selectable groups and material objects may need boundaries.

Example: Separated account rows on the page.

Anti-example:

```tsx
<Card><Card>Account details</Card></Card>
```

## section-chrome. Border, soft shadow and large rounding on an ordinary section

Why: All three decorations compete with content.

Applies: Ordinary page sections.

Limits: A floating dialog, photograph or material note can earn chrome.

Example: One hairline around a distinct comparison region.

Anti-example:

```tsx
<section className="rounded-2xl border shadow-lg">Settings</section>
```

## feature-template. Centered three-column icon-square feature grid with no subject reason

Why: A familiar template does not explain this particular offer.

Applies: Marketing feature lists.

Limits: Three comparisons can require three columns; annotated intent can permit them.

Example: Specific claims arranged by priority or a meaningful comparison.

Anti-example:

```tsx
<section className="text-center"><div className="grid grid-cols-3"><div className="rounded-xl">Icon</div></div></section>
```

## gradient-glow. Unexplained gradient blobs behind the opening

Why: They add atmosphere without explaining the subject.

Applies: Decorative backgrounds.

Limits: Data encodings, actual light, branded artwork and deliberate illustration are permitted.

Example: A meaningful object or type-led opening.

Anti-example:

```tsx
<div className="absolute blur-3xl bg-gradient-to-r" />
```

## status-pills. Tinted rounded pills for plain status labels

Why: Color furniture replaces a readable label and increases noise.

Applies: Plain row metadata.

Limits: Interactive filters, selected tokens and domain encodings can use filled shapes.

Example: Saved, with readable status text and an optional glyph.

Anti-example:

```tsx
<span className="rounded-full bg-green-100 text-green-600">Saved</span>
```

## faint-text. Low-contrast small text on a known white background

Why: Readers lose explanations they need.

Applies: Known foreground/background pairs.

Limits: A token name alone cannot prove rendered contrast. Decorative disabled marks differ.

Example: Measured readable muted text.

Anti-example:

```tsx
<p className="bg-white text-gray-300">Required field</p>
```

## control-radius. Oversized rounding on small ordinary controls

Why: A pill silhouette can become an unexplained default.

Applies: Small fields and selects.

Limits: A deliberate pill button or branded control is permitted. Pricele has rounded controls.

Example: Radius selected for the existing control system.

Anti-example:

```tsx
<input className="rounded-3xl" />
```

## arbitrary-spacing. Repeated off-scale spacing without a layout reason

Why: Unrelated values weaken rhythm and make adjustments expensive.

Applies: Routine spacing.

Limits: Optical correction, art paths and measured constraints can use exact values.

Example: Shared spacing roles, with a documented optical adjustment.

Anti-example:

```tsx
<div className="p-[13px] gap-[19px] mt-[27px]" />
```

## accent-sprawl. Many unrelated expressive hues

Why: The page has no stable signal.

Applies: Expressive accents within one composition.

Limits: Chart series, price temperature and other labeled domain colors are excluded.

Example: One expressive accent alongside meaningful domain colors.

Anti-example:

```tsx
const accents = ["red", "blue", "violet", "lime", "pink"];
```

## floating-dock. Decorative blurred floating navigation

Why: Movement and transparency complicate frequent navigation.

Applies: Frequent app navigation.

Limits: A project brief can require a floating tool palette.

Example: Stable navigation with a visible current destination.

Anti-example:

```tsx
<nav className="fixed bottom-6 rounded-full backdrop-blur-xl" />
```

## rotated-copy. Rotated paragraphs or essential fields

Why: The flourish makes reading and input harder.

Applies: Paragraphs, labels and inputs.

Limits: Short material notes and decorative objects can tilt.

Example: An upright paragraph beside a tilted note.

Anti-example:

```tsx
<p className="rotate-3">Long instructions...</p>
```

## hover-only. Essential names or actions revealed only on hover

Why: Touch and keyboard visitors cannot reliably discover them.

Applies: Essential controls and destinations.

Limits: Supplemental hover feedback is permitted when the action remains discoverable.

Example: A visible caption and focus treatment.

Anti-example:

```tsx
<button className="opacity-0 group-hover:opacity-100">Open</button>
```

## transition-all. Animating every property without choosing them

Why: Unexpected layout changes animate and interruptions become harder to review.

Applies: Interactive controls.

Limits: A measured experiment can justify an exception.

Example: transition: color 180ms, transform 140ms.

Anti-example:

```tsx
button { transition: all 400ms; }
```

## continuous-decoration. Infinite decorative motion beside work

Why: Movement keeps taking attention after the state is understood.

Applies: Decorative emphasis and loading effects.

Limits: A truthful progress indicator or sound visualizer has a state reason.

Example: A finite update with reduced-motion handling.

Anti-example:

```tsx
<div className="animate-bounce">Try me</div>
```

## vague-action. Promotional action copy that conceals the result

Why: Visitors cannot predict what clicking will do.

Applies: Functional CTAs and error recovery.

Limits: A personal invitation can be playful when its destination is clear.

Example: Review changes, Save settings or Read the project.

Anti-example:

```tsx
<button>Unlock your potential</button>
```
