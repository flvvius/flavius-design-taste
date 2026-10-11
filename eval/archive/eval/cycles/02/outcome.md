# Cycle 02: notification controls

The builder used native labelled choices and a confirmation dialog. The reviewer verified choice targets, initial cancel focus, Escape cancellation, reset persistence and storage-failure recovery. Enlarged body text remained within a 375px viewport.

The shared input role was too faint to identify a control on the page: 1.27:1 in light mode and 1.46:1 in dark mode. New solid input values exceed 3:1 against the default page, popover, card and secondary backgrounds. Decorative border tokens remain quiet. The skill now distinguishes essential boundaries from separators, and package checks enforce that distinction.

The reviewer correctly rejected treating the warning accent as a blanket defect. It can be decorative beside readable text. A new warning-text role nevertheless removes guesswork when agents need coloured warning copy, and its default page contrast is checked. Fixtures now demonstrate these explicit roles.

The evaluator now measures clickable checkbox/radio labels rather than falsely reporting their smaller painted glyphs as targets. A failed document load stops evaluation instead of yielding empty-page screenshots. Browser checks pass in both themes at 375px and 1280px.
