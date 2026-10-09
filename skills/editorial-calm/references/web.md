# Web

Use `assets/tokens.css` without a framework. Map its variables to your existing theme rather than importing a second reset. In Tailwind, register semantic aliases in the installed version's theme configuration. Avoid raw palette utilities in components.

Use a system sans stack, optionally headed by locally bundled Inter. The optional `assets/fonts.css` loads the supplied Latin and Latin Extended variable files; include their OFL licence when distributing them. Body starts at 16px with 1.625 leading. Titles are 32px, weight 600, with tight tracking. Wide landing heroes may reach 60px; ordinary section titles stay 16px. Prose is at most 65ch, descriptions 55ch.

Default content width is 896px with 16px gutters. Separate sections with 32–40px above a top hairline and 24px below it. Rows share a stable title, description, metadata and trailing-action anatomy. Responsive rows wrap instead of hiding useful content.

Controls use 8px radius; media 10px; overlays 14px. A flat section does not inherit these radii. Input boundaries must remain visible. Use a visible focus outline, associated labels, native button/link semantics and keyboard-operable dialogs. Provide labels for icon-only actions.

Theme switching replaces semantic tokens at the root. Honour system preference unless the user selected a theme. Use `prefers-reduced-motion` to suppress transforms and nonessential animation. Do not animate navigation that users perform dozens of times a day.

The specimen at `../../../examples/index.html` uses these assets directly. It is a starting example, not a required page template.

## With shadcn/ui

The semantic roles follow the same convention as [shadcn/ui's CSS variable theme](https://ui.shadcn.com/docs/theming). Use its controls with this taste's layout decisions.

Copy the light and dark colour values into the corresponding theme blocks, or import `assets/tokens.css` after the default token declarations. Keep the existing Tailwind colour aliases and dark variant. Importing the variables alone does not register Tailwind utilities or add a theme provider.

Map control radius to 8px, media to 10px and overlays to 14px through the existing radius aliases or component classes. Keep a base `--radius` if the installed components use it. The package supplies `--radius-control`, `--radius-media` and `--radius-overlay`, rather than replacing every library radius alias.

Use Button, Input, Select, Dialog and DropdownMenu where their interaction fits. Retain their keyboard and focus behaviour. Card is appropriate only when its boundary conveys a function; it is not the default section wrapper. Tables and lists sit on the page with separators.

For Sidebar or Chart components, define their additional semantic roles using the app's content needs. Those roles are not included in the core palette. Check control borders and status text against the actual backgrounds in both themes.

## Colour roles in controls

Use `input` for the boundary that makes an input, select or unchecked option recognisable. `border` is intentionally quieter and belongs to separators, not essential control identification. `ring` identifies keyboard focus.

Status copy uses `success`, `destructive` or `warning-text` against the page. `warning` is an accent/fill and is not suitable for ordinary light-theme text. For a filled status control, use its paired `-foreground`; a foreground token is not the status colour for plain page text.
