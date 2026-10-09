# Cycle 10 handoff

Open `index.html` directly in a browser. It has no dependencies or network requests. Theme, larger text, digest frequency and link preference save in local storage. Reset restores defaults. When storage is blocked, the screen explains that changes last for the current visit. Digest and link settings store preferences only; this example does not send mail or open articles.

The browser embeds the semantic sRGB palette from `skills/editorial-calm/assets/tokens.srgb.json`. Its dimensions match the exported web defaults: 896px content width, 16px gutters, 32px title, 16px body and section label, 18px row title, 40px section gap and 8px control radius. Rem units preserve browser text scaling. Controls stack below descriptions on narrow screens. System fonts, native controls and visible focus outlines support keyboard use.

`NativeExample.swift` is a real SwiftUI view. Load `SemanticPalette(tokensURL:)` with the exported token file, then embed `NativeExample(palette: palette)` inside a `ScrollView` in a native application window. The file loads semantic colours and numeric typography, section spacing and mobile gutter dimensions at runtime. SwiftUI retains native switch, picker and button behaviour. AppStorage persists its preferences separately from browser storage.

Native fonts use the system font with exported sizes and a body-relative `@ScaledMetric` multiplier. This responds to iOS Dynamic Type, but uses a single body scaling curve for all text roles. Native control rows reserve at least 44pt and have flexible height. Frame dimensions alone do not prove the platform control hit area; native interaction checks remain necessary. iOS runtime, accessibility sizes and VoiceOver have not been validated here. The macOS larger-text option adds a 1.35 multiplier; the enlarged PNG is evidence of that manual layout variant, not an iOS Dynamic Type test. Native control chrome follows platform conventions rather than overriding its borders and radii with web styling.

## Compile and render

From the repository root:

```sh
eval/cycles/10/render /private/tmp/cycle10-png skills/editorial-calm/assets/tokens.srgb.json
```

The renderer captures a real NSHostingView through AppKit. ImageRenderer produced unsupported-control placeholders for switches and menu pickers, so it is not used for the final captures. The original source and captures remain in Renderer-before.swift.txt and native-before.

The executable script uses `swiftc -parse-as-library` to compile `NativeExample.swift` and `Renderer.swift` under `/private/tmp`. Its exit trap removes the compiled binary. It writes `light-normal.png`, `dark-normal.png`, `light-enlarged.png` and `dark-enlarged.png` into the requested output directory using the host bitmap backing resolution. The renderer fixes width at 760pt and lets content determine height. Explicit render overrides keep theme and size deterministic. Each run creates an isolated AppStorage suite, seeds every preference and removes the suite on exit. Capture controls therefore show the same chosen theme and enlargement as the rendered page.

The parent owns independent compilation and PNG review. No compiled binaries are retained in the repository. All deliverable edits are inside `eval/cycles/10`; shared files, earlier cycles and review files were not read or changed.

## Review checks

Compare light and dark at normal and enlarged sizes. At a narrow browser width, confirm labels and controls wrap without horizontal scrolling. Tab through every control, change appearance, toggle larger text, disable the digest, reload and reset. Confirm system appearance follows an operating-system theme change when selected. For the native application, resize the ScrollView host and verify preference persistence. Test iOS Dynamic Type in an iOS host before claiming mobile validation.
