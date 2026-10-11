# Reproduce the recipe renders

Copy the optional starter to a scratch folder outside this repository. Copy the recipes folder into its root, then copy this [page](page.tsx) to `app/[recipe]/page.tsx`. Add `import '../recipes/ink/ink.css'` to app/layout.tsx, install and run:

```sh
npm install
npm run build
npm run dev -- --port 4314
```

Open `/settings-page`, `/table-and-filters`, `/onboarding-flow`, `/editorial-landing`, `/case-study-page` and `/ink`. The instruction screenshot opens the real native dialog. All example data is identified as demonstration content. These are screenshots of the exported snippets, not static mockups.

The [verification script](verify.mjs) checks filtering and clearing, saving a preference, dialog Escape and focus restoration, narrow composition and 200% text. Run it from this repository's installed dev tooling with `node recipes/demo/verify.mjs http://127.0.0.1:4314`.
