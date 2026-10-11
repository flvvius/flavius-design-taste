# Token sources and exports

Edit only `editorial-calm/tokens.json` or `personal-room/tokens.json`. Their existing schemas and palettes remain intact. Frozen v1 token files under eval/archive are historical evidence.

```sh
node scripts/build.mjs
node scripts/check.mjs
node scripts/bundle-skill.mjs
```

The build generates portable JSON/CSS in each direction, Editorial calm sRGB values, Tailwind v4 aliases, shadcn cssVars and the registry item. It also refreshes the optional starter. Exported copies are not another editable source.

Use `exports/editorial-calm.theme.css` alongside Editorial calm's `tokens.css` in Tailwind v4. It registers semantic colors and derives the base control radius from the source. Existing consumers keep their own reset and dark-mode strategy. Personal room retains its paper/night names and `--pr-` roles; it has not been forced into Editorial calm's schema.
