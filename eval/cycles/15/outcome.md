# Cycle 15: Personal room on iOS

The native specimen carries Mara's repair notes into a 375-point iPhone SE simulator. Schoolbell titles retain the handwritten voice. System body text handles reading and Romanian copy. Literal paper and night colours come from the shared JSON; native font metrics choose the text sizes. No palette or browser dimension token changed.

This is a new native implementation, not a browser screen rendered into an image. The [first source](before/NativeRoom.swift) used fixed 44-point buttons in a horizontal row. It compiled and looked plausible at ordinary text size. At the largest accessibility size, body type grew from 17 to 53 points, while the buttons stayed 44 points tall. Their labels spilled outside their targets. The [baseline report](before/checks.json) and captures retain that failure. A minimum target height must not become a fixed content height.

[The revised source](NativeRoom.swift) lets native button configuration size the wrapped labels and insets. Accessibility categories stack the actions vertically. Reading and labels grow in a scroll view. Custom fonts use UIKit semantic metrics, text elements update automatically, and semantic colour providers follow system appearance. Controls retain explicit names and accessibility element properties. The next-note action updates its title, date and paragraphs together.

[After-checks](after/checks.json) record nine captured layouts across ordinary and largest text sizes in paper and night, including top and bottom positions and the next note. Two live changes verify that the open app updates its fonts and control arrangement. Three dispatched native control events check marking, unmarking and moving to the next note. A separate run using the runner's default isolated-simulator creation and deletion also passed.

The live-size check initially retained stale child frames from an early layout callback. The [report before correction](live-report-before.json) records that sampling failure; inspecting the actual simulator showed that the screen had reflowed. Reporting now occurs after child layout, and the runner waits for stable live measurements. That is a correction to the evidence path, not a claim that the stale frames were the final displayed UI.

A passing geometry check did not catch a transient button-title crossfade in the next-note screenshot. Visual inspection did. Snapshot launches now explicitly disable UIKit animations, and the report records that setting. Ordinary launches keep native animations. The captures therefore show final content states rather than animation behavior.

The root agent reviewed the ordinary and largest-size captures, including the action area and translated reading. This was self-review. The visual result keeps the expressive opening while the controls stay conventional and legible. The [native guide](../../../skills/personal-room/references/native.md) now explains platform token mapping, scaled custom type, minimum target sizing and the limits of native evidence.

Run `npm run check:native -- --output .artifacts/native-room` on macOS with Xcode and an installed iOS simulator runtime. The default creates and removes its own simulator. An optional `--device` accepts a dedicated test simulator; that mode changes its appearance and text-size preferences. The runner includes the font notices and repository licence in the temporary app bundle.

These are simulator layout checks and programmatic scrolling and control events. They do not prove finger gestures, keyboard operation, physical-device rendering or VoiceOver order. The skill remains usable without the repository's runner or Xcode.
