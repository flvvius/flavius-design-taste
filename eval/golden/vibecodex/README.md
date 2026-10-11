# VibeCodex four-screen redesign

A real public learning/project catalog built with v0.dev and Cursor. The MIT license and explicit AI-build statement are pinned in [provenance.json](provenance.json). The source repository is [jalcantarab/v0-vibecodex](https://github.com/jalcantarab/v0-vibecodex/tree/00a158c69399389aba48c190ff514fecfb298bb0). No upstream PR, issue or publication.

The selected flow uses real local arrays, not a fabricated authenticated dashboard. It includes project search/categories/reset, persisted goal selection, learning experience switches, milestone expansion, theme persistence and navigation menus. Screens are /projects, /guides, /start and /learning-path.

Read [project-design-brief.md](project-design-brief.md) for discovery and the behavior contract; [audit.md](audit.md) for ranked findings and final review; [rubric.json](rubric.json) for separate gates; [commits.txt](commits.txt) for intervention batches. Source changes are in [redesign.patch](redesign.patch), with the actual installation [lockfile](package-lock.json) and original [LICENSE](LICENSE).

## Evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Baseline/after | 28 captures each, four routes plus search/empty/advanced states; 375/1280, light/dark | [before](before/manifest.json), [after](after/manifest.json) |
| State behavior | Open mobile sheet, focus containment/return; milestone show/hide in both themes | [before states](before-states/manifest.json), [after states](after-states/manifest.json) |
| Contract | 14 browser interactions pass after | [verification](after-verification/verification.json) |
| Destinations | Main-content href inventories match exactly on all four routes | [comparison](destination-comparison.json) |
| Data | Original project data SHA256 matches after | [provenance](provenance.json) |
| Reflow | No horizontal overflow at 320/375/1280, normal and 200% text | [verification](after-verification/verification.json) |
| Text/control/focus contrast | Solid-text scan has zero failures; input 4.07:1 light/5.47:1 dark; 2px focus | [measurement](accessibility-after.json) |
| Reduced motion | No CSS animations run under reduce | [measurement](accessibility-after.json) |
| Build | Next build passes before/after | [before log](build-before.log), [after log](build-after.log) |
| Standalone TypeScript | Fails before/after with identical upstream errors | [before errors](types-before.log), [after errors](types-after.log) |
| Capture failure retention | Intentional unsupported action records attempted state, HTTP 200, error and failure screenshot | [fixture manifest](capture-failure-proof/manifest.json) |

Baseline AnimatedCounter runs from 0 for 1 second on viewport entry. Full-page capture does not scroll every counter into view. The initial baseline remains untouched; [settled baseline](before-settled/manifest.json) scrolls every project and waits 1200ms. After shows the same underlying counts immediately. It also hides absent time metadata rather than making up estimates.

The original Next config skips TypeScript and lint failures during build. Passing build is reported separately from the unchanged failing typecheck. No test script exists upstream. The browser smoke scripts exercise actual controls and destinations; they do not certify auth, external destinations, screen readers or physical devices. Those paths are absent or unverified. Three tool-logo PNGs referenced by original learning-path code return 404 before/after; the scoped patch preserves that pre-existing asset issue and does not invent replacement brands.

## Reproduce

Run these commands outside the taste repository. Copy the saved package-lock.json into the clone before npm ci.

```sh
git clone https://github.com/jalcantarab/v0-vibecodex.git app
cd app
git checkout 00a158c69399389aba48c190ff514fecfb298bb0
cp /path/to/eval/golden/vibecodex/package-lock.json package-lock.json
npm ci --legacy-peer-deps
npm run build
npx tsc --noEmit
git apply /path/to/eval/golden/vibecodex/redesign.patch
npm run build
npx tsc --noEmit
npm run dev -- --port 4326
```

From the taste repository, with its Playwright dev dependency available:

```sh
node eval/golden/vibecodex/verify.mjs http://localhost:4326 /tmp/vibecodex-check
node eval/golden/vibecodex/accessibility.mjs http://localhost:4326 /tmp/vibecodex-accessibility.json
node skills/flavius-design/scripts/capture.mjs --url http://localhost:4326 --states eval/golden/vibecodex/states.json --output /tmp/vibecodex-captures
```

[state-smoke.mjs](state-smoke.mjs) compares original 4328 and redesigned 4326 servers, waits for the mounted theme control, opens the sheet and expands a milestone. [stable-project-baseline.mjs](stable-project-baseline.mjs) needs original 4328. Scratch dependency installation used legacy-peer-deps for the existing React18 package set; no dependencies were added to the shared taste.

## Failures and rescue

The first development capture stalled on a disabled theme toggle. Warm retry worked; the helper now retains failed attempted-route evidence. Independent TypeScript revealed errors hidden by build settings. Initial layout corrections still overflowed with doubled text; measurements traced footer links, long actions and radio-grid minimum widths, and the patch corrected them. Full details and narrowly supported workflow changes are in [CHANGES.md](../CHANGES.md).

Visual preference scores are agent self-review. Human taste review remains open.
