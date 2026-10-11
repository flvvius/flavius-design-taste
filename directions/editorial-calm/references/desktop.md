# Desktop

Preserve the content hierarchy while adapting to pointer and keyboard use. Browser shells use the web reference. Native frameworks use the portable sRGB tokens and platform fonts.

A wide window can have a stable sidebar, a main list and a detail pane. Hairlines or spacing separate panes. Do not turn the extra width into a grid of statistical tiles. Give prose a readable measure and tables the width they need.

Use platform-standard menus, shortcuts, window controls and focus traversal. Selection needs a clear state; a restrained background is earned when it identifies the selected row. Hover is supplemental feedback, never the only way to discover an action.

Support compact and expanded window sizes, text scaling and long labels. Dense pointer controls can be smaller than mobile targets, but touchscreen modes retain touch-sized targets. Avoid draggable regions overlapping controls in custom title bars.

In SwiftUI or AppKit, map roles into named colours and use system type. In WinUI or WPF, map roles into theme resources and retain high-contrast behaviour. In Qt, use palette roles and native focus semantics. The taste guides content and chrome; it does not replace operating-system interaction conventions.

## Dense tables on narrow screens

Preserve table headers for assistive technology when rows stack. If live header controls become visually hidden, remove their invisible tab stops and provide visible equivalent controls. A mobile sort selector does not replace select-all unless that action is also available. Keep equivalent selection controls synchronized, including mixed and disabled states.

A padded cell is not a larger hit target unless it actually activates the control. Wrap compact selection glyphs in associated clickable labels. Keep the painted glyph small while making the interactive area touch-sized on touch screens. Test a tap outside the glyph, and traverse every keyboard stop at the narrow breakpoint.
