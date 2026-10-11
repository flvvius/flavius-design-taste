# Flavius design practice

I redesign apps in their codebase and build small websites. This repository is the public taste and working method behind that work: two design directions, a shared core, a short workflow skill and evidence from real runs. Clients pay for judgment and implementation. These files stay public.

## Redesign an app

Use `flavius-design` in audit or redesign mode. It discovers the codebase and theme, writes a behavior contract, captures routes and states, ranks the problems and gets one screen right before extending. Tokens, layout and copy arrive as separate, reviewable changes.

```text
Use $flavius-design in redesign mode on this project.
Improve the project catalog and its related flow.
Preserve routes, data, forms and keyboard behavior.
```

For a review, ask for audit mode. The deliverable is a ranked top ten where the evidence supports ten findings, one redesigned screen and a sprint recommendation. An audit stops before the broader implementation. POLISH and RESTRUCTURE keep the agreed scope. RETHINK FLOW requires explicit approval.

The [VibeCodex run](eval/golden/vibecodex/README.md) shows an actual four-screen Next.js/shadcn redesign, contract checks, before/after, patches and known baseline defects. The [audit-only run](eval/golden/vibecodex-audit/README.md) records its time and one-screen limit. Read the [teardown draft](docs/teardown-001.md) for the decisions behind the changes.

## Start a site

Use new-site mode. Start with audience, primary action, message and actual content. Compare two compositions, choose a direction and a visual idea from the subject, then build a complete page before extending.

```text
Use $flavius-design in new-site mode.
Build a site for my service, with email as the primary action.
Show two composition options. Mark missing content as placeholder.
```

The [service-site run](eval/golden/service-site/README.md) includes its brief, both compositions, complete source and responsive checks. The [optional starter](skills/flavius-design/assets/starter/README.md) uses Next.js and Tailwind v4. The practice also works in an existing stack.

## Quick start

Build a package before installing a skill. A bare direction folder in this repository links to shared files; the distributable carries those files with it.

```sh
git clone https://github.com/flvvius/flavius-design-taste.git
cd flavius-design-taste
node scripts/bundle-skill.mjs
mkdir -p ~/.codex/skills
cp -R dist/flavius-design ~/.codex/skills/flavius-design
```

Use `.claude/skills/` for a project-local Claude installation, or give another agent the packaged Markdown. `dist/editorial-calm` and `dist/personal-room` also install on their own. They contain the core and required references, with local links checked in isolation. The skills do not require this repository, a component library or a paid model API at runtime. Screenshot capture uses locally installed Playwright as dev tooling.

For a shadcn app already initialized with `components.json`, apply the base theme:

```sh
npx shadcn@latest add https://raw.githubusercontent.com/flvvius/flavius-design-taste/main/registry/r/editorial-calm.json
```

This installs semantic colors and radius. It leaves composition to the app. A [fresh CLI install](eval/golden/registry-install/README.md) has before/after evidence. See [registry instructions](registry/README.md) for local testing.

## The taste

[Editorial calm](directions/editorial-calm/SKILL.md) uses type, whitespace and separated rows for recurring task work. [Personal room](directions/personal-room/SKILL.md) uses authored objects and annotations when a personal subject earns them. They share [principles](core/principles.md), [voice](core/voice.md) and [DNA](core/dna.md), while keeping their own typography, palettes and motion.

The core comes from code and renders of my [portfolio](references/own-work/portofolio.md) and [Pricele](references/own-work/pricele.md), alongside useful existing guidance. Inferences are labelled. Portfolio imports Schoolbell despite its stale README font list. Pricele uses Instrument Serif, Archivo and IBM Plex Mono. Broadsheet rails and standing heads are [recipes](recipes/editorial-landing/README.md), not a third direction.

Cream, serif display, hairlines, Inter and taped notes can fit this taste. The [anti-patterns](core/anti-patterns.md) question unexamined defaults. The [linter](skills/flavius-design/scripts/README.md) reports candidates with reasons and permits documented exceptions; it cannot decide intent from a class name.

## Folder map

| Folder | Job |
| --- | --- |
| `core/` | Shared principles, anti-patterns, voice and DNA |
| `directions/` | The two standalone taste presets |
| `skills/flavius-design/` | Audit, redesign and new-site router, templates, helpers and optional starter |
| `recipes/` | Implemented patterns with provenance, code and actual renders |
| `references/own-work/` | Pinned code observations and browser captures |
| `references/annotated/` | Your external-reference template and gaps, with none selected for you |
| `references/counterexamples/` | Specific mismatches from real public output |
| `tokens/` | Canonical token sources and generated exports |
| `registry/` | Generated shadcn theme item and catalog |
| `eval/golden/` | Real before/after, audit and new-site evidence |
| `eval/blind/` | Comparable anonymous outputs and an unfilled human scoring sheet |
| `eval/archive/` | Frozen v1 cycles, research and supporting context |

## Verify or maintain

Edit the relevant `tokens/*/tokens.json` source first. Generated direction copies remain portable; they are not separate editable sources. There is no DTCG migration.

```sh
npm ci
node scripts/build.mjs
node scripts/check.mjs
node scripts/check-links.mjs
node scripts/check-archive.mjs
node scripts/bundle-skill.mjs
npm run test:tooling
```

[Helper usage](skills/flavius-design/scripts/README.md) covers theme discovery, deterministic lint and route/state capture. The existing [browser verifier](scripts/verify-examples.mjs) still checks the v1 examples and interactions. The [archived runner](eval/README.md) can re-run a historical specimen into a fresh output directory. Research cycles are paused. New evidence comes from real work.

The archive keeps all 814 original tracked files and their executable modes, verified against the [inventory](docs/restructure-inventory.json). The [restructure plan](docs/restructure-plan.md) explains moves and the archive context mirror. The `v1-before-restructure` tag preserves the original checkout.

Licensed under [MIT](LICENSE). Commercial and closed-source use is permitted with its notice. Bundled fonts and third-party screenshots retain their own licenses and attribution, documented with the relevant source. Public app evidence contains no client data.
