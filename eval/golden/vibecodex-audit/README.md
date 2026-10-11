# Timed audit run

Audit mode ran on a separate worktree at the pinned original revision. It stops after one project catalog prototype. Its patch includes semantic token polish and that catalog only. The full redesign is a separate run.

Read [audit.md](audit.md), [timing.json](timing.json), [verification.json](verification.json) and [redesign.patch](redesign.patch). The same project baseline images are in [the full run](../vibecodex/before/manifest.json); this audit has its own [prototype captures](after/manifest.json). Baseline source/build discovery is shared to avoid downloading the same dependency tree twice. That reuse is recorded rather than described as an independent fresh install.

The prototype has seven original destinations, working case-insensitive search, empty state and reset. The patch deliberately stops before fixing the remaining screens. It is ready for a scoped client discussion, with unresolved whole-app accessibility and upstream TypeScript errors named in the audit. No upstream issue, PR or publication.

## Reproduce

```sh
git clone https://github.com/jalcantarab/v0-vibecodex.git app
cd app
git checkout 00a158c69399389aba48c190ff514fecfb298bb0
npm install --legacy-peer-deps
git apply /path/to/redesign.patch
npm run dev -- --port 4327
```

The upstream MIT notice is preserved in [LICENSE](LICENSE). Versions using upstream latest dependencies can drift; the full run includes its actual installation lockfile.

The original data has one absent time estimate. Its label remains visible in this audit prototype and is a small follow-up copy correction; the full redesign hides absent metadata. The prototype is intentionally retained as delivered at the timed checkpoint.
