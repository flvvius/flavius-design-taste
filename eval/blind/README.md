# Held-out blind comparison

The same task ran under three conditions: no design skill, the v1 tag's direction skills, and the new router plus core. Three isolated agents inherited the same parent model without overrides. They received the same [brief](brief/held-out.md) and [baseline](brief/baseline.html), with only their allowed skill sources changed. The fictional water-sampling laboratory is outside the reference set.

Every condition had a ceiling of 18 tool calls and 15 minutes. Agents reported different counting conventions for nested calls. The top-level orchestration counts were 7, 9 and 14, all below that ceiling; elapsed work was roughly 3.2, 4.5 and 5.2 minutes. Exact billed tokens, backend model revision and generation seeds were not exposed, so this does not claim token-for-token equality. Unused budget was not reallocated after seeing outcomes.

Outputs were copied, randomly labelled and hashed before common evaluation. The pages remain unchanged after freezing. The [private key](key/mapping.json) maps conditions and source hashes. Keep it and condition notes closed until you finish scoring. This is procedural blinding, not restricted access; the repository is public.

Open the [comparison](index.html) in a browser, or serve the repository locally and open `/eval/blind/`. Compare each page at the same width/theme/text setting. Open an image at full size to inspect line spacing and small labels. The [scoring sheet](scoring-sheet.md) has separate criteria and remains blank. No automatic taste winner is declared.

## Measured gates

| Anonymous sample | Function | Automated accessibility | Human visual gate | Human ratings |
| --- | --- | --- | --- | --- |
| FFF6 | pass | fail | Pending | Pending |
| 1FE9 | pass | pass | Pending | Pending |
| 3BBD | pass | pass | Pending | Pending |

The failed candidate has weak essential input boundaries in both themes and small light-theme text at 4.44:1 where 4.5:1 is required. Keep the failure alongside any aesthetic rating. A pleasant composition cannot average it away.

The [results](results.json) contain identical browser checks across 375/1280 and light/dark: search, empty/reset, status filter, dialog data/Escape/focus, required status validation, mutation/persistence, disappearing-row focus, theme change and destinations. The checker also measures solid-color text, essential input boundaries, names, CSS focus and all-font 200% geometry. Captures include normal and enlarged text. Human visual inspection of line spacing, clipping and reading order is still a gate; width measurements alone do not prove it. Screen readers and other engines were not tested.

The common checker was built from the supplied behavior and verification requirements, then strengthened to include non-text boundaries. All candidates received the same final checks. No page was repaired after a failure. This is a small comparison kit, not a statistically powered model benchmark.

## Repeat the common checks

Install this repository's existing Playwright dev tooling, serve its root and run:

```sh
python3 -m http.server 4320 --bind 127.0.0.1
node eval/blind/verify.mjs http://127.0.0.1:4320
```

The [checker](verify.mjs) writes results and screenshots, leaving the frozen HTML alone. It creates a separate browser context per case, so saved sample status cannot contaminate another condition. Live pages on the same origin share the supplied storage key; use a fresh browser profile or serve each sample on a different port when testing manually. New generations should use fresh workspaces and the exact brief/source sets, preserve their original pages, then create a new anonymous mapping. Do not append these outputs to the archived research cycles.
