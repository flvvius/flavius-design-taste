# Install the base theme

For a shadcn app that already has `components.json`:

```sh
npx shadcn@latest add https://raw.githubusercontent.com/flvvius/flavius-design-taste/restructure/design-practice/registry/r/editorial-calm.json
```

After the PR merges, replace `restructure/design-practice` with `main`. The branch URL works as soon as its generated file is pushed. To test locally, serve the repository and use its item URL:

```sh
python3 -m http.server 4320 --bind 127.0.0.1
npx shadcn@latest add http://127.0.0.1:4320/registry/r/editorial-calm.json
```

`node scripts/build.mjs` generates the standalone item and catalog from the canonical Editorial calm tokens. The item is `registry:theme`, with theme, light and dark CSS variables. It changes semantic colors and the base radius. It does not redesign the app's layout, install a theme provider or redistribute a product identity.

The shape follows the current [registry-item schema](https://ui.shadcn.com/docs/registry/registry-item-json) and [theme examples](https://ui.shadcn.com/docs/registry/examples). Light/dark roles are tested in a fresh initialized scratch app; capture evidence belongs in the checkpoint report.
