# Helpers

Run from the project you are inspecting. Discovery and linting need only Node. Capture uses Playwright already installed as development tooling in the script's workspace or current project.

```sh
node /path/to/flavius-design/scripts/capture.mjs --url http://localhost:3000 --routes /,/settings
node /path/to/flavius-design/scripts/find-theme.mjs --root . --output theme-report.json
node /path/to/flavius-design/scripts/slop-lint.mjs --root . --output lint-report.json
```

Capture writes routes × 375/1280px × light/dark media schemes into a dated directory. `--output folder` selects another destination. `--states states.json` replaces the route list with reproducible state setup:

```json
[
  {"name":"settings-dialog","route":"/settings","actions":[{"selector":"#edit","click":true}]},
  {"name":"search-empty","route":"/search","actions":[{"selector":"input[name=q]","fill":"no-match"},{"selector":"[data-state=empty]","waitFor":"visible"}]}
]
```

An action supports click, fill, select or waitFor. `themeActions` can supply light/dark action arrays for a manual theme control. Capture requests system preference by default and records actual colors; it does not claim that a site supports dark mode merely because a dark screenshot was requested.

Theme discovery reports CSS variable definitions, globals, Tailwind config/v4 entries, hardcoded color counts, shadcn metadata, declared frameworks/libraries and route-file candidates. Follow the active imports before editing. It ignores build outputs, dependencies, symlinks and frozen archives.

Linting reports file:line, rule ID, reason and a suggested fix. Its 15 lexical rules come from the shared anti-patterns. It cannot infer visual intent, JSX component behavior or rendered accessibility. It does not ban cream, hairlines, serif type, Inter, grain or material notes. Use `--strict` only when reviewed candidates should fail the command.

Document a deliberate exception next to its code with `taste-allow rule-id -- concrete reason`, or use `.flavius-design-lint.json`:

```json
{"maxAccentColors":4,"allow":[{"file":"components/Temperature.tsx","rule":"accent-sprawl","reason":"Five labeled temperatures communicate game feedback."}]}
```

Keep exceptions narrow and inspect the render. A linter pass does not establish taste or a preserved behavior contract.
