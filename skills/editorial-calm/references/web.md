# Web

Use `assets/tokens.css` without a framework. Map its variables to your existing theme rather than importing a second reset. In Tailwind, register semantic aliases in the installed version's theme configuration. Avoid raw palette utilities in components.

Use a system sans stack, optionally headed by locally bundled Inter. The optional `assets/fonts.css` loads the supplied Latin and Latin Extended variable files; include their OFL licence when distributing them. Body starts at 16px with 1.625 leading. Titles are 32px, weight 600, with tight tracking. Wide landing heroes may reach 60px; ordinary section titles stay 16px. Prose is at most 65ch, descriptions 55ch.

Default content width is 896px with 16px gutters. Separate sections with 32–40px above a top hairline and 24px below it. Rows share a stable title, description, metadata and trailing-action anatomy. Responsive rows wrap instead of hiding useful content.

Controls use 8px radius; media 10px; overlays 14px. A flat section does not inherit these radii. Input boundaries must remain visible. Use a visible focus outline, associated labels, native button/link semantics and keyboard-operable dialogs. Provide labels for icon-only actions.

A compact checkbox can keep a small painted mark inside a larger native input. Make the activation area meet the platform target size, retain visible keyboard focus and test clicks or taps outside the painted square.

When a breakpoint replaces a focused control, transfer focus to its visible equivalent and preserve the current value or selection. Removing a hidden control from the tab sequence does not move existing focus. Test both resizing directions and leave focus elsewhere on the page alone.

Theme switching replaces semantic tokens at the root. Honour system preference unless the user selected a theme. Set `data-theme="auto"` on `html` to follow the preference in CSS before scripts run. An explicit choice sets `data-theme="light"` or `data-theme="dark"`. The generated CSS also supports the existing `.dark` class for manual themes. `webTheme` in the token JSON records these browser selectors. Test the painted palette and native control scheme, then change the preference and exercise the user override. Use `prefers-reduced-motion` to suppress transforms and nonessential animation. Do not animate navigation that users perform dozens of times a day.

The repository's [browser specimen](https://github.com/flvvius/flavius-design-taste/blob/main/examples/index.html) shows one application of these assets. It is optional reference material, not a dependency of the installed skill or a required page template.

## With shadcn/ui

The semantic roles follow the same convention as [shadcn/ui's CSS variable theme](https://ui.shadcn.com/docs/theming). Use its controls with this taste's layout decisions.

Copy the light and dark colour values into the corresponding theme blocks, or import `assets/tokens.css` after the default token declarations. Keep the existing Tailwind colour aliases and dark variant. Importing the variables alone does not register Tailwind utilities or add a theme provider.

Map control radius to 8px, media to 10px and overlays to 14px through the existing radius aliases or component classes. Keep a base `--radius` if the installed components use it. The package supplies `--radius-control`, `--radius-media` and `--radius-overlay`, rather than replacing every library radius alias.

Use Button, Input, Select, Dialog and DropdownMenu where their interaction fits. Retain their keyboard and focus behaviour. Card is appropriate only when its boundary conveys a function; it is not the default section wrapper. Tables and lists sit on the page with separators.

For Sidebar or Chart components, define their additional semantic roles using the app's content needs. Those roles are not included in the core palette. Check control borders and status text against the actual backgrounds in both themes.

## Colour roles in controls

Use `input` for the boundary that makes an input, select or unchecked option recognisable. `border` is intentionally quieter and belongs to separators, not essential control identification. `ring` identifies keyboard focus.

Status copy uses `success`, `destructive` or `warning-text` against the page. `warning` is an accent/fill and is not suitable for ordinary light-theme text. For a filled status control, use its paired `-foreground`; a foreground token is not the status colour for plain page text.

## Shared dimensions

The CSS asset exports spacing, radii, motion and typography as custom properties. Use `--type-bodyWeb`, `--type-section`, `--type-rowTitle` and `--type-pageTitle` for the default sizes, with `--type-weightBody`, `--type-weightLabel`, `--type-weightTitle` and `--type-lineHeight` for hierarchy. Prose and descriptions use `--type-proseMeasure` and `--type-descriptionMeasure`. Sizes are rem values so browser text preferences can scale them.

Press transforms can use `--motion-pressScale`; durations use `--motion-press`, `--motion-swap` and `--motion-overlay`. The JSON keeps logical numeric dimensions for native consumers.

## Long words and enlarged text

A responsive container does not guarantee its text can fit. Give headings and prose a long-word fallback such as language-aware hyphenation with `overflow-wrap:anywhere` when necessary. Test the longest word at enlarged sizes. Test header actions with the fallback font too; allow groups to wrap when their minimum widths no longer fit. Preserve the requested text size and the full content; hiding overflow or clipping the heading is not a correction. Complete monetary values follow the intact-amount pattern instead of arbitrary character wrapping.

Check the selected value of a choice control as well as its open menu. Concise options can use context from their visible label; preserve the full meaning. Keeping the box within the viewport can still truncate its value. Use a control that supports wrapping when the necessary wording cannot fit.

## Reading before enhancement

Render known reading content in the initial HTML when the task allows it. Keep controls that depend on initialization unavailable until their handlers are ready. Build replacements before removing the existing content, so an interrupted render preserves the reading view. Test with scripting disabled and with an initialization error; an empty shell and enabled controls that do nothing are failures. Keep this decision proportional to the application's core task.

## Forced colours

Keep system colour substitution enabled. Test keyboard focus, form boundaries and selected states with forced colours active. A selected state needs a text or shape marker as well as its regular colour. Use a border or outline for essential boundaries; shadows may disappear. Apply system colours inside a `forced-colors` query when the browser's default substitution needs help, rather than freezing the whole interface with `forced-color-adjust: none`.
