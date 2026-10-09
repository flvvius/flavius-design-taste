# Cycle 05 builder

Read the current repository AGENTS.md, Editorial calm skill, desktop, web, patterns and review references, tokens.css and fonts.css before building. Read unslop and applied it to the interface and this record. The desktop reference now explicitly addresses hidden table controls and actual selection hit areas. This screen has no hidden interactive substitutes or compact selection glyphs.

The appointment form uses a native date input and time select. Dates run from tomorrow through fourteen days ahead, calculated using the current date in Europe/Bucharest. Weekends are unavailable. The time select enables only after a valid weekday and disables the unavailable 11:00 and 12:00 choices. Date changes reset the selected time. Required date, time, name and email fields have associated labels and inline errors. Failed submission focuses the first invalid field and announces a form error.

A successful submission creates a confirmation preview using text nodes. Editing any form field clears that preview. The page and preview both state that no appointment is scheduled and no invitation is sent. Data stays in the page until reload.

Content sits on the page background. A hairline separates the preview. The interface uses current typography size and weight variables, input boundaries, control radii, focus rings, success, destructive and warning-text roles. Controls have at least 44px height and grow with text. The columns stack below 48rem. Text wraps, including long preview names and emails. The theme follows system preference until manually changed. There is no animation.

The request leaves appointment type, provider, duration, timezone and actual availability unspecified. I chose a fictional design consultation, 30 minutes, a named provider, Bucharest time and a small daily schedule. Native date pickers do not support disabling arbitrary weekend dates; the nearby guidance explains the rule, selecting a weekend displays an error, and validation blocks its preview. Native disabled time options can appear differently across platforms. The availability is a demonstration schedule, with no claim of a live calendar. No consent checkbox is needed because the page sends nothing.

No browser render, enlarged-text check, theme contrast measurement, assistive-technology check or interaction test was run. The parent renders and the independent reviewer tests the artifact.

Static verification passed. Node parsed the inline JavaScript without a syntax error. The HTML has 148 lines. These checks do not verify browser behavior or visual layout.
