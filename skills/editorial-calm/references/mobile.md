# Mobile

Use platform-native controls and navigation with the same hierarchy. Read `assets/tokens.json` for dimensions and `assets/tokens.srgb.json` for colour values on platforms that cannot consume OKLCH.

Start with 20 logical units of screen gutter, 17 for body text, 32 for the screen title and 16 for section headings. Use system sans and weights 400, 500 and 600. Allow Dynamic Type or font scaling to change the layout. Never fix row heights around unscaled text.

React Native consumes the sRGB hex values through a theme context and StyleSheet. Use dp values for spacing and `fontVariant: ['tabular-nums']` for figures. SwiftUI uses named theme colours, semantic font styles with semibold titles and `.monospacedDigit()`. Compose uses a Material theme mapped to these roles, sp text and dp spacing. Flutter maps roles into a ThemeExtension and uses the platform text scaling settings.

Lists are editorial rows with separators. Keep the tab bar flat, full width and stable. The active tab uses foreground and a filled icon or other non-colour cue. Respect safe areas and keyboard insets. Media reserves its aspect ratio before loading.

Use at least 44pt targets on iOS and 48dp on Android. Small icons can sit inside larger unpainted hit areas. Swipes must have a visible or accessibility action alternative. Sheets keep native dismissal, focus and back behaviour.

Press feedback may scale to 0.97 over 140ms, content swaps use 150ms opacity, and sheets or toasts use 200–250ms. Disable optional motion when the accessibility setting requests it. Gesture springs may follow velocity; do not add springs to ordinary content updates.

When checking a native handoff, inspect the actual platform controls in the capture. In the macOS SwiftUI exercise, ImageRenderer compiled successfully but drew unsupported placeholders for AppKit-backed switches and pickers. Capturing an NSHostingView through AppKit preserved those controls. A compiled view or a complete PNG file alone does not prove the screen rendered correctly.

Keep manual enlargement evidence separate from Dynamic Type or platform font-scaling tests. Use semantic font styles or scaled metrics for custom token sizes, and test the target platform's accessibility sizes in its own host before claiming support. A macOS bitmap does not establish iOS interaction or VoiceOver behavior.
