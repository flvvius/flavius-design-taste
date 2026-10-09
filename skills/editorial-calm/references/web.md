# Web

Use `assets/tokens.css` without a framework. Map its variables to your existing theme rather than importing a second reset. In Tailwind, register semantic aliases in the installed version's theme configuration. Avoid raw palette utilities in components.

Use a system sans stack, optionally headed by locally bundled Inter. Body starts at 16px with 1.625 leading. Titles are 32px, weight 600, with tight tracking. Wide landing heroes may reach 60px; ordinary section titles stay 16px. Prose is at most 65ch, descriptions 55ch.

Default content width is 896px with 16px gutters. Separate sections with 32–40px above a top hairline and 24px below it. Rows share a stable title, description, metadata and trailing-action anatomy. Responsive rows wrap instead of hiding useful content.

Controls use 8px radius; media 10px; overlays 14px. A flat section does not inherit these radii. Input boundaries must remain visible. Use a visible focus outline, associated labels, native button/link semantics and keyboard-operable dialogs. Provide labels for icon-only actions.

Theme switching replaces semantic tokens at the root. Honour system preference unless the user selected a theme. Use `prefers-reduced-motion` to suppress transforms and nonessential animation. Do not animate navigation that users perform dozens of times a day.

The specimen at `../../../examples/index.html` uses these assets directly. It is a starting example, not a required page template.
