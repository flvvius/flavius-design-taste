# Cycle 01 builder notes

Built one standalone account and security preferences screen. It imports the installed tokens and font stylesheet through the requested relative paths, uses a system sans font, and makes no remote requests.

## Guidance used

Read the repository AGENTS.md, Editorial calm SKILL.md, and its web, patterns and review references. Applied Unslop to the page copy and these notes.

Content sits on the page background. Account details and security preferences use spacing and hairlines rather than section containers. The page title uses weight 600 and tight tracking; section headings stay at body size. Labels use weight 500. Controls use the control radius and semantic background, foreground, primary, muted, destructive and focus roles. Success and warning glyphs use their status roles beside explicit text. Their message text uses foreground because the reference warns against assuming status colours meet body-text contrast.

The layout follows the 896px content width and 16px gutters. Rows wrap into a single column on narrow screens. Fields have associated labels, descriptions and adjacent errors. Focus uses a visible outline. Native controls provide keyboard interaction, and status messages use live regions. Appearance defaults to the system preference and offers explicit light and dark choices.

## Behaviour

Save and discard start disabled. Editing details enables them and produces an unsaved-changes warning. Submission validates the name and email, focuses the first invalid field, and reports errors next to the fields and submission action. A valid save shows a brief pending state, disables duplicate actions, and stores details locally before reporting success. The 550ms delay makes that pending state observable; it does not claim server activity. Storage errors are handled only if browser storage actually fails.

Sign-in alerts and inactivity settings save locally. Turning alerts off or choosing never to lock produces a warning caused by that choice. Password checking expands inline, validates minimum length and matching confirmation, and clears the password after a successful check. It does not store passwords or claim to change an account password. The page states that this is a local preview.

## Uncertainties and verification

The installed input role is a quiet boundary. Controls instead use muted foreground for a stronger visible boundary, while decorative separators use border. Actual contrast and rendering need browser review in both themes.

A connected account service was outside this standalone fixture. Alert and lock controls therefore store preferences only; the password form checks length and confirmation only. Those limits appear in the screen copy.

No browser screenshots or independent review were performed. The parent and reviewer handle those checks. No review outcome is claimed here. No other cycle output was read, and no shared skill, token or script files were changed.
