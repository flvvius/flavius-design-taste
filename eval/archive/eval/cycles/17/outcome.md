# Cycle 17: The optional font can be absent

The Personal room guide described Schoolbell as optional. The native specimen force-unwrapped its named font lookup. A build without the actual font file and application registration never produced a reading screen. The [first report](before/checks.json) recorded a startup timeout. Adding app stderr to the runner exposed the [fatal diagnostic](before-diagnostic/app-stderr.log): the lookup returned nil and the force-unwrap failed. The [baseline source](before/NativeRoom.swift) retains the implementation at commit `3334eeb`.

The revised specimen selects an available system face if Schoolbell is missing, then applies the same native scaling metrics. Headings retain their size hierarchy. Native reading, translated text, selected states and actions do not depend on the optional face. The normal build still requires Schoolbell to load; a silent packaging fallback cannot count as success for that mode.

Both native commands now accept `--without-font`. It removes the font resource and its application registration, rather than changing a family string or hiding the font only after launch. Fresh isolated simulators keep an earlier registration from disguising the missing-resource case. The layout runner records the bundle mode and actual rendered font names. It also retains app stderr when startup fails.

[Fallback layout checks](after/layout-fallback.json) and [bundled layout checks](after/layout-bundled.json) each pass nine layouts, two live size changes and three dispatched control events. [Fallback UI checks](after/ui-fallback.json) and [bundled UI checks](after/ui-bundled.json) each run four XCTest scenarios across both palettes at ordinary and largest accessibility text. Every scenario performs three unfiltered native accessibility audits and exercises scrolling, repair state and navigation.

The root agent reviewed the fallback reading captures and the gesture attachments. This is self-review. The fallback loses the handwritten face, as expected, while Mara's subject, dated notes, text hierarchy and reading path remain clear. The published images come from XCTest after it waits for the app to idle; the earlier layout captures sample the geometry and are not used as final gesture-state images.

The shared native guide now asks for a real missing-font build and an explicit scaled fallback. No palette or dimension token changed. The installed skill remains usable without repository tooling. Apple's [font overview](https://developer.apple.com/documentation/technologyoverviews/fonts) supports verifying availability and keeping a fallback path.

Run `npm run check:native -- --without-font --output .artifacts/native-fallback` for layout evidence, and `npm run check:native-ui -- --without-font --output .artifacts/native-ui-fallback` for simulator gestures and audits. Use a fresh UI output directory. Physical devices, hardware keyboard use and VoiceOver order remain separate checks.
