# Evidence from applying the practice

The [v1 evaluation log](archive/eval/README.md) retains 28 completed cycles and the exploratory cycle 29 baseline. The [original gallery](archive/eval/index.html), source, reports and captures are frozen with their v1 dependencies under `archive/`. Research cycles have stopped.

New app redesigns and site builds belong in `golden/`. Controlled comparisons belong in `blind/`. Historical results describe their recorded input bytes, not the current practice.

Rerun an archived specimen without modifying its evidence:

```sh
node scripts/evaluate.mjs 01 --output .artifacts/archive-01
node scripts/verify-examples.mjs --surface repair-notebook --output .artifacts/archive-notebook
node scripts/check-archive.mjs
node scripts/check-links.mjs
node scripts/bundle-skill.mjs
```

Fresh reports retain captured source hashes. Visual composition, screen readers and physical devices require separate inspection.
