# Discover the codebase

Read local instructions, package manifests and lockfiles first. Record framework and installed version, routing model, build/dev/test commands and environment requirements. A README can be stale; confirm against imports, configuration and the rendered app.

Find the styling system: Tailwind version and config, CSS imports, globals, semantic variables, inline colors, CSS modules and component-library metadata. Run `find-theme.mjs` to locate candidates, then follow the actual import graph. Inspect `components.json` and alias definitions if shadcn is present. Do not add another reset or theme provider without understanding the current one.

Map representative routes and query parameters, navigation and deep links. Identify server/client boundaries, API calls, data loaders, cache state, local storage and mutations. Record which data can be safely mocked for capture, which needs a fixture account and which must never be written. Never include client data in a public taste repository.

Write the behavior contract in the project's design brief:

- Auth, redirect and session behavior.
- Permissions and visibility for each role.
- Routes, query parameters, history and deep links.
- Forms, defaults, validation, dirty drafts and cancellation.
- Mutations, pending/failed states and optimistic recovery.
- Analytics events and tracking boundaries.
- Keyboard order, focus destinations, shortcuts and dialog semantics.

For each entry, specify a trigger, expected result and verification method. Mark absent features as absent with code evidence. Mark unavailable services as unverified; do not replace their contract with a fabricated success path.

Run the existing build/tests before changing anything. Capture normal screens, empty/loading/error states, long content, an open dialog and mobile where they exist. If a state cannot be induced safely, record why. One screenshot of a dashboard is not a baseline for an entire flow.

Inspect build configuration for skipped checks. A successful framework build can hide TypeScript or lint failures. Run those checks separately when the project disables them, record the baseline failures, and compare the same commands after the visual change.
