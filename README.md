# Flavius design taste

My design taste as two reusable skills for AI agents. Choose a direction for the project; each works without a framework or model API.

- [Editorial calm](skills/editorial-calm/SKILL.md) is for app interfaces with restrained typography, warm neutrals and separated rows.
- [Personal room](skills/personal-room/SKILL.md) is for personal sites, portfolios, communities and expressive screens. Handwriting, meaningful objects, imperfect outlines and a conversational voice give it character.

Personal room draws on my [portfolio](https://flavius.pro) and [Cluj House](https://clujhouse.com/). It adds warm paper and navy poster directions. The [source notes](skills/personal-room/references/sources.md) explain the extraction and adaptations. Editorial calm keeps its existing guidance and assets.

## Choose the direction

| The job | Starting direction |
| --- | --- |
| Repeated task work, settings, dashboards or dense tools | Editorial calm. Keep navigation and controls predictable. |
| A personal collection, portfolio or small community | Personal room. Choose its objects and voice from the subject. |
| An article or notes within either project | Keep the chosen palette and title voice, then use a readable prose role. |
| A practical screen inside a Personal room project | Keep its identity while using upright labels and conventional controls. |

A project's chosen direction and the user's brief take precedence over these starting points. The tastes describe visual decisions, not a mandatory page template. Give one taste responsibility for page typography, colour and layout when combining them.

## Personal room

![Personal room paper example](examples/personal-room/screenshots/paper-desktop.png)

![Personal room night example](examples/personal-room/screenshots/night-desktop.png)

Open the [interactive example](examples/personal-room/index.html) locally to try both palettes and the project stories. The example uses original drawings and fictional content. Its palette switch is for comparison; a finished site can choose one direction.

Ask your agent:

> Read `skills/personal-room/SKILL.md` and use Personal room for this project. Choose objects and a voice that belong to its subject, then apply the paper or night direction. Preserve the product behaviour.

Install the whole `skills/personal-room` folder in `~/.codex/skills/personal-room` for Codex or `.claude/skills/personal-room` for Claude Code. Other agents can read the Markdown directly. The folder includes the [portable tokens](skills/personal-room/assets/tokens.json), [generated CSS](skills/personal-room/assets/tokens.css), [optional font stylesheet](skills/personal-room/assets/fonts.css) and [implementation guide](skills/personal-room/references/implementation.md). It does not depend on the Editorial calm folder. The [repair notebook](eval/cycles/12/index.html) shows the same taste on a reading and editing screen, without an illustrated room.

Schoolbell is bundled under the [Apache License 2.0](skills/personal-room/assets/fonts/LICENSE.txt). Reference photos, music artwork and logos are not part of this package.

## Editorial calm

Content sits on the page. Typography, whitespace and hairlines establish hierarchy. Warm neutrals and graphite actions give the interface its character. Colour carries meaning. Boxes need a reason to exist.

## The look

Real app screens in light and dark themes. Readable headlines, quiet navigation, separated rows and clear section hierarchy share the page background.

### Light

![Live light theme showing warm neutrals, readable headlines and hairline-separated rows](examples/screenshots/feed-light.png)

### Dark

![Live dark theme showing warm off-white text, restrained controls and separated rows](examples/screenshots/feed-dark.png)

### On a smaller screen

Navigation adapts, rows wrap and controls keep their touch targets. The visual hierarchy stays the same.

<p>
  <img src="examples/screenshots/mobile-light.png" alt="Live mobile feed in light theme" width="360" />
  <img src="examples/screenshots/mobile-dark.png" alt="Live mobile feed in dark theme" width="360" />
</p>

These are screenshots from a live app, not generated mockups. They show one application of the taste; its branding, content and domain colours are specific to that app. The mobile previews show responsive web; native implementations use their own platform controls.

### Detail and reading

![Live light theme detail with section hierarchy, readable prose and inline source references](examples/screenshots/detail-light.png)

![Live dark theme detail with the same typography and section rhythm](examples/screenshots/detail-dark.png)

See the [capture notes](examples/screenshots/README.md) for provenance. The separate [browser example](examples/index.html) is a generic workspace you can open locally to try the themes and controls.

## Give it to an agent

Clone this repository into your project or a shared tools directory. Ask your agent:

> Read `skills/editorial-calm/SKILL.md` and use Flavius design taste for this app. Read the reference for my platform. Preserve the product's behaviour and use this system for its visual decisions.

Agents that support skills can install the `skills/editorial-calm` folder in their skill directory. For Codex, copy it into `~/.codex/skills/editorial-calm`. For Claude Code, copy it into `.claude/skills/editorial-calm` in your project. Agents without skill support can read the Markdown directly. No model API or build dependency is required.

## Works well with shadcn/ui

This taste combines well with [shadcn/ui](https://ui.shadcn.com). Its [CSS variable theming](https://ui.shadcn.com/docs/theming) uses the same semantic roles, including `background`, `foreground`, `primary`, `muted`, `border` and `ring`, with `.dark` overrides.

Use shadcn/ui for buttons, inputs, dialogs, menus and other controls. Apply this taste to the page layout, typography, spacing and choice of surfaces. Ordinary sections stay on the page; a dialog earns its own surface.

Copy the token values into your existing theme or import `tokens.css` after the default theme definitions. Keep your Tailwind semantic mappings and dark-mode setup. Map the component radii to the supplied control, media and overlay values. Charts and sidebars may need additional app-specific tokens. The [web guide](skills/editorial-calm/references/web.md) covers the integration.

shadcn/ui is optional. The skill and tokens also work with other component libraries and native controls.

## Use the assets

- [tokens.json](skills/editorial-calm/assets/tokens.json) is the portable source of truth.
- [tokens.css](skills/editorial-calm/assets/tokens.css) provides CSS custom properties.
- [tokens.srgb.json](skills/editorial-calm/assets/tokens.srgb.json) provides colours for platforms without OKLCH support.
- [fonts.css](skills/editorial-calm/assets/fonts.css) loads the bundled Inter variable fonts, covering Latin and Latin Extended text.
- [Reference assets](examples/reference-assets/README.md) include the live app logo for visual reference.
- [Web guide](skills/editorial-calm/references/web.md) covers browser implementations.
- [Mobile guide](skills/editorial-calm/references/mobile.md) covers React Native, SwiftUI and Compose.
- [Desktop guide](skills/editorial-calm/references/desktop.md) covers desktop layouts and interaction.

Edit the relevant skill's `assets/tokens.json` first. Run `node scripts/build.mjs` to regenerate both skills' CSS and Editorial calm's portable sRGB values. Run `node scripts/check.mjs` to verify generated assets, links, palette contrast and font packaging.

## Tested with agents

The [evaluation log](eval/README.md) records build, review and fix cycles. The first ten used independent agents; later cycles identify self-review explicitly. It includes working screens, builder notes, findings, browser checks and screenshots. These exercises test how the tastes transfer to different tasks, including enlarged text and both themes. The [research notes](eval/research/2026-10-09.md) compare seven design-skill repositories, published designer methods and primary accessibility guidance. They explain which ideas fit this repo and which were excluded.

## Verify a change

The installed skill folders work without repository tooling. Maintainers can run the following checks from this repository:

```sh
node scripts/build.mjs
node scripts/check.mjs
npm ci
npx playwright install chromium
npm run test:tooling
npm run check:browser -- --output .artifacts/browser
```

The browser runner checks both specimens and the repair notebook at 320px, 390px, 768px and 1440px, then applies all-text enlargement, spacing overrides and forced-colour substitution. It tests interactions and writes screenshots plus a report with source hashes. CI retains those artifacts. Visual composition, images, screen readers and native platforms still require their own review.

## What belongs to Editorial calm

Warm neutral backgrounds, graphite actions, semibold hierarchy, sentence case, readable prose, separated rows, stable navigation and short motion. Settings, forms and statistics belong on the page too.

Choose content, navigation and domain colours for the app you're building. Dense operator tools may use bordered groups when their interaction needs them; a route name alone does not earn a box.

## Licence

Licensed under MIT. Commercial and closed-source use is permitted. Include the copyright and permission notice in copies or substantial portions of the software. See [LICENSE](LICENSE). Bundled Inter fonts have their own [SIL Open Font License](skills/editorial-calm/assets/fonts/OFL.txt). Screenshots contain app content and publisher imagery for visual reference; the MIT licence does not relicense third-party material shown in them.
