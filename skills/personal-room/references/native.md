# Native screens

Carry the palette and handwritten title into the platform's reading and control conventions. A narrow reading screen can use one column, a meaningful title and ordinary actions. It does not need to reconstruct a desktop shelf or draw every control.

## Tokens and type

Read the literal hex roles in `assets/tokens.json`. Resolve paper or night from the user's selected appearance, or from the system when no choice was made. Keep that resolution live when the system changes. Native colour providers or framework theme environments can supply this behavior. Layers that store a resolved colour value may need explicit updates.

CSS units and expressions are browser values. Do not pass `rem`, `clamp()` or the irregular CSS radius string to a native dimension API. Choose a base point, dp or sp size for the platform, then apply its font-scaling system. Keep the semantic colour roles and visual hierarchy; reproduce the purpose of a dimension rather than parsing a browser layout expression as a universal number.

For iOS, bundle Schoolbell with its licence and register the font with the application. UIKit custom fonts should come from `UIFontMetrics(forTextStyle:).scaledFont(for:)`; set `adjustsFontForContentSizeCategory` on text elements. In SwiftUI, use `.custom("Schoolbell-Regular", size: 48, relativeTo: .largeTitle)` for a scaled opening title. The exact base size belongs to the screen. Use native semantic body styles for reading, fields and long translated text. Confirm the actual font loaded; a successful compile can still render a fallback.

Test the largest supported accessibility category in the target platform. A manual multiplier or a macOS image cannot establish iOS Dynamic Type behavior. Also change the setting while the screen is open. Text, control geometry and reading order need to update together.

## Controls and layout

A 44-point iOS target is a minimum hit area, not a fixed row height. Give labels room to wrap and let the control grow around them. Nearby actions can share a row at ordinary sizes and stack vertically when larger text needs the width. Keep the requested font size rather than shrinking it to preserve the row. Android targets should follow its 48dp convention.

Use a scrollable reading region when content grows beyond the viewport. Preserve useful gutters and check the last action after scrolling. Do not fix the opening to one screen height. Native controls should keep their names, selected states and accessibility traits; a drawn outline cannot replace those semantics.

## Evidence

Inspect actual platform captures at ordinary and accessibility sizes in both appearances. Check text measurements and target bounds, then review the images for overlap, truncation and a readable composition. Verify live size changes separately from fresh launches.

Programmatic scrolling proves that a destination can be displayed. Dispatching a control event can test its state change. Neither establishes touch gestures, hardware keyboard use or VoiceOver order. State those limits beside the results. Simulator UI tests can exercise swipes and taps through the same visible controls a reader uses. Run accessibility audits at the opening, action area and new destination, including enlarged text. Keep the default audit findings; do not ignore an issue merely to obtain a passing run. Automated audits cover common defects and still require separate VoiceOver testing.

The taste folder works without a simulator, build system or repository script; those are verification tools for the application being built.
