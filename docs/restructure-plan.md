# Design practice restructure plan

Checkpoint 0. No existing files have moved, and no design guidance or token values have changed. Phase 1 waits for Flavius's OK.

## Baseline and safety

The starting tree is commit `1dc7f84`, which records cycle 28 verification and the exploratory native baseline. The working tree was clean on `main`, tracking `origin/main`.

- Annotated tag `v1-before-restructure` preserves that commit.
- Work is on `restructure/design-practice`.
- [The inventory](restructure-inventory.json) records all 814 tracked files, their sizes and SHA-256 hashes, every proposed move, and the v1 support files needed by the archive. It records the starting tree, not this new plan.
- Use `git mv` for source moves. Keep the restructure and subsequent work on this branch for one final PR. Do not merge before the final review and authorization.
- Preserve historical reports, screenshots, source hashes, licenses and font notices. No deletion is proposed.
- Clone the two named own-work repositories into scratch directories for inspection. Do not edit the originals, push to their remotes or copy private data. No external design references will be selected without approval.
- Retain the existing Node token pipeline. No DTCG migration, third direction, paid API or product-specific dependency in the shared taste.

## Current file map

| Location | Files | What is there |
| --- | ---: | --- |
| `skills/editorial-calm/` | 16 | Short entrypoint, seven references, source JSON, generated CSS and sRGB, Inter fonts and licenses. |
| `skills/personal-room/` | 12 | Short entrypoint, four references, source JSON, generated CSS, Schoolbell and licenses. |
| `examples/` | 19 | Workspace specimen, Personal room specimen, screenshots, provenance and one reference logo. |
| `eval/` | 732 | Cycle artifacts, gallery, briefs, research, reports and screenshots. |
| `scripts/` | 27 | Build, checks, gallery, cycle runner, maintained browser/native runners, helpers and tests. |
| Root and `.github/` | 8 | README, package and lockfile, instructions, notices, MIT license, ignore file and CI. |

The evaluation log has 28 completed cycles. `eval/cycles/29/before/` is an exploratory native baseline, explicitly not a completed cycle. Preserve it too. Historical reports contain both successful and failed attempts; none should be relabeled as current verification.

The only development dependency is Playwright. Both directions already work as standalone folders. Editorial calm maps shadcn semantic colors; Personal room uses separate paper/night roles with a `--pr-` prefix. Keep these identities when centralizing their sources.

The research already rejects universal bans on cream palettes, Inter and familiar libraries. Preserve that reasoning. Existing native and asynchronous behavior guidance is useful material for the shared workflow, but should not become a requirement to reproduce the specimen's product.

## Target map

```text
core/
  principles.md  anti-patterns.md  voice.md  dna.md
directions/
  editorial-calm/  personal-room/
skills/flavius-design/
  SKILL.md
  references/
    codebase-discovery.md  audit-rubric.md  redesign.md
    new-site.md  intervention-levels.md  verification.md
  assets/
    brief.template.md  audit.template.md
    implementation-plan.template.md  handoff.template.md
    project-design-brief.template.md  starter/
  scripts/
    capture.mjs  find-theme.mjs  slop-lint.mjs  README.md
recipes/
  settings-page/  table-and-filters/  onboarding-flow/
  editorial-landing/  case-study-page/  ink/
references/
  annotated/  counterexamples/  own-work/
tokens/
  editorial-calm/  personal-room/  exports/
registry/
eval/
  README.md
  archive/
    eval/                 # Entire original eval tree, unchanged
    skills/               # Frozen v1 directions and assets
    scripts/              # Frozen v1 tooling and tests
    examples/             # Frozen v1 specimens and provenance
    ...                   # Other original root files for relative links
  golden/  blind/
docs/
  restructure-plan.md  restructure-inventory.json  teardown-001.md
examples/                 # Existing maintained specimens retained
scripts/                  # Maintained tooling retained and extended
dist/                     # Generated standalone skill packages
```

`eval/archive/eval/` is a deliberate deviation from the proposed flat archive. Adding a directory level to individual cycles would break links such as `../../../skills/...` and `../../research/...`. Editing those links would change the historical files. Instead, archive the original tree with its original root layout. Copy the 82 non-eval baseline files alongside it, using bytes from the tag. Those support files add about 3.8 MB and keep local relative links valid without symlinks or dependencies on the live directions. The 732 original eval files remain byte-for-byte unchanged, including executable file modes.

Frozen token JSON in the archive is evidence from v1. It is excluded from active token generation and is not another editable source. Archived tooling does not add research cycles. Fresh rerun output goes to `.artifacts/` and is identified as a new run.

Keep `examples/` because the current browser checks rely on those working specimens. Recipes can link to them where appropriate; their existing code and screenshots need not be replaced by recipe copies.

## Complete move list

Each row covers every descendant, including fonts, binary captures, licenses and failed reports. The inventory expands these rows into individual file destinations.

| Phase | From | To | Treatment |
| --- | --- | --- | --- |
| 1 | `skills/editorial-calm/` | `directions/editorial-calm/` | Move all 16 files first; preserve wording and token values. |
| 1 | `skills/personal-room/` | `directions/personal-room/` | Move all 12 files first; preserve wording and token values. |
| 1 | Original `eval/` contents | `eval/archive/eval/` | Move all 732 files unchanged. Includes research, gallery, root reports and cycle 29 baseline. |
| 4 | `directions/editorial-calm/assets/tokens.json` | `tokens/editorial-calm/tokens.json` | Move the editable source. Generate the direction's portable JSON from it. |
| 4 | `directions/personal-room/assets/tokens.json` | `tokens/personal-room/tokens.json` | Same treatment, retaining paper/night names and role semantics. |

No other existing file moves or renames are proposed. Copy the baseline non-eval files to `eval/archive/` from the tag after the moves, never from the evolving branch. Generated direction assets remain under `directions/*/assets/` so their implementation references continue to work. Registry JSON and Tailwind v4 exports are additional outputs of the same active sources.

## Path updates and packaging

Update maintained root documentation, NOTICE and AGENTS.md, specimen HTML/CSS, build/check scripts, gallery code, browser and native runners, source capture lists, helper code and fixtures. The archive copies keep their old paths and wording.

The current browser runner hardcodes cycle 04, 07, 09 and 12 paths. Native tooling uses cycles 15 and 16. Tests also reference these paths. Give maintained runners an explicit archive root or source map, using the archived assets for historical specimens and current assets for maintained specimens. Keep source capture strict: every served file must have captured bytes and a matching hash.

`scripts/evaluate.mjs` currently overwrites screenshots and `checks.json` inside a cycle and does not set a failing exit code for all measured defects. Add a separate output directory and fail on verified layout, label, runtime and request failures. Keep the old cycle invocation usable, with fresh evidence outside the archive. Do not claim success solely because the command exited zero.

Keep the frozen gallery unchanged. Generate a current index outside the archive that links into it. Existing gallery commands must not overwrite the frozen file.

Add `scripts/check-links.mjs`, reusing the existing local asset checker where useful. Check Markdown links and images, reference-style links, HTML attributes, CSS imports and URLs, encoded paths and local anchors. Add an isolated-package check that rejects dependencies outside the package root. Exclude `.git`, `node_modules`, generated runtime evidence and scratch projects from source traversal. Check the frozen archive separately against its own root.

Add `scripts/bundle-skill.mjs`. Copy each direction into `dist/`, include the shared core files within its package, and rewrite its shared-core links locally. Package the router with both presets, core, templates and portable assets. Prove each package works from an isolated temporary directory without sibling folders. Bundled copies are generated, not additional authored guidance or token sources.

Phase 1 introduces packaging support. Phase 2 adds the reviewed core guidance and direction links, then rebuilds the packages. Do not invent core rules merely to make Phase 1 packaging pass.

## Phases and approval gates

| Phase | Deliverables and evidence | Stop condition |
| --- | --- | --- |
| 0 | Inventory, baseline tag, branch, this plan and baseline checks. | Wait for OK before moving files. |
| 1 | Moves, preserved-byte manifest check, working runners, link checker and portable packaging support. Inspect Git rename detection. Rerun at least one archived specimen with fresh output. | Report Checkpoint 1 and wait for approval to continue. |
| 2 | Read-only own-work clones, code-derived decisions and feasible 375/1280 captures, core documents, annotated template and 5-8 reference gaps. Reuse existing guidance. Label observations, inherited guidance and inferences. | Present `dna.md` and `principles.md`; wait for edits or approval. |
| 3 | Router under roughly 5,000 tokens, six references, five templates, starter, three documented scripts and sample runs. | Report Checkpoint 3 and wait. |
| 4 | Canonical token sources and generated CSS, Tailwind v4 and shadcn registry. Verify the current official schema. Install into a fresh shadcn scratch app and capture before/after. | Report Checkpoint 4 and wait. |
| 5 | Ink extraction and recipes supported by own-work evidence. Include React/Tailwind code, use limits and screenshots. | No separate checkpoint was specified. Defer recipes without evidence until Phase 6. |
| 6 | Licensed public app, full redesign of 3-5 screens, separately timed audit, service landing page, screenshots, rubric scores, build/tests, smoke checks and observed workflow repairs. | Report Checkpoint 6 and wait. |
| 7 | Comparable blind-test artifacts, held-out brief, anonymization and scoring sheets, README, teardown draft and one reviewable PR. | Report Checkpoint 7. Merge only after authorization. |

Audit mode ranks findings and then produces its included representative redesign as a review artifact. It does not extend changes across the application. This resolves the instruction to stop after the ranked audit while also delivering one redesigned screen. Record the screen's intervention level and preserve the behavior contract. Audit timing includes that screen, not only the report.

The router's client approval gates must distinguish visual changes from flow changes. POLISH and RESTRUCTURE stay in separate commits. RETHINK FLOW requires explicit client approval. Approve one representative screen before extending it. Write discovery, behavior boundaries and selected decisions into the client's design brief.

For new sites, compare two genuinely different compositions before building one complete page. The starter demonstrates the selected stack without making that stack a dependency of the shared taste. Mark placeholder service copy.

The linter reports heuristic candidates with file, line, rule, reason and suggested correction. Derive about 15 checks from approved anti-patterns. Test deliberate cream, hairline and serif choices as permitted fixtures. Context and documented exceptions matter; the scanner cannot infer whether a visual decision was examined from a class name alone.

Do not fabricate recipes for settings, onboarding or case studies to fill directories. Each needs an observed pattern or a successful Phase 6 implementation. Pricele's broadsheet patterns become recipes with provenance, never a third preset.

The blind kit must contain actual outputs for no skill, v1 skills and the new practice, with comparable model, task, budget and environment records. A kit of prompts alone does not prove those runs happened. Keep functional and accessibility failures as gates. Human taste scores remain for Flavius to supply.

## Ambiguities and decisions to review

1. Approve the archive root layout above. It preserves historical bytes and links at the cost of a small frozen copy of supporting files.
2. Preserve Personal room's existing night palette and Cluj House provenance. New shared-DNA claims will be based on the two named own-work repositories; this phase does not choose another reference.
3. Treat `tokens/` as one active source location with one JSON per existing direction. Combining both schemas would be needless migration. There will be no manually maintained copies in packages.
4. Existing live-app screenshots and the reference logo remain visual references under their existing notices. They are not default identities or reusable recipe imagery.
5. A licensed public app still needs to be selected and its AI-built provenance documented in Phase 6. If the license, setup or required credentials prevent the full run, report the evidence before selecting another app. Do not lower the behavior checks to match what is easy to run.
6. No upstream PRs or issues, new external references, dependency additions beyond authorized tooling, deletion or publishing are included in Phase 1 approval.
7. The final acceptance criterion requires one merged PR, while Checkpoint 7 asks for a reviewable PR. Create the PR at Checkpoint 7 and leave merging as the final authorized step.

## Verification ledger

Verified at the unchanged baseline:

- `node scripts/check.mjs` passed generated-asset parity, semantic contrast, local paths, standalone direction checks and font packaging.
- `npm run test:tooling` passed all 21 tests in the default Chromium environment.
- `python3 -m unittest discover -s scripts/tests -p 'test_*.py'` passed all three fixtures.
- `node scripts/verify-examples.mjs --surface repair-notebook --output .artifacts/restructure-baseline/repair-notebook` passed 18 layouts and five interaction checks, with zero failures and zero unverified conditions. Its `checks.json` records source hashes.

Failed checks: none in these baseline runs.

Unverified here: the full six-surface matrix, fresh Firefox/WebKit runs, native simulator runs, screen-reader behavior, other repositories, registry installation, redesign results and blind comparisons. Historical reports are retained evidence of their recorded runs, not verification of this restructure.

After approval, verify all proposed source destinations against the inventory. Every archived eval file and frozen support copy must match the starting SHA-256 and mode. For active files that need path edits, inspect the diff and account for each change. Check package isolation and every supported link form, rerun the affected tooling fixtures and at least one archived specimen, then inspect the render. Subsequent phases add their own direct evidence to the ledger.
