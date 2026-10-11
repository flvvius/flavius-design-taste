import SwiftUI

struct SemanticPalette {
    let colors: [String: [String: String]]
    let dimensions: [String: [String: Double]]
    func dimension(_ group: String, _ key: String) -> CGFloat { CGFloat(dimensions[group]![key]!) }
    init(tokensURL: URL) throws {
        let object = try JSONSerialization.jsonObject(with: Data(contentsOf: tokensURL)) as? [String: Any]
        guard let colors = object?["colors"] as? [String: [String: String]],
              ["light", "dark"].allSatisfy({ mode in
                  ["background", "foreground", "muted-foreground", "border", "primary", "input", "ring"].allSatisfy { colors[mode]?[$0] != nil }
              }) else { throw NSError(domain: "Palette", code: 1, userInfo: [NSLocalizedDescriptionKey: "Missing semantic palette roles"]) }
        self.colors = colors
        self.dimensions = ["spacing", "type", "radius"].reduce(into: [String: [String: Double]]()) { result, key in
            result[key] = (object?[key] as? [String: Any])?.compactMapValues { ($0 as? NSNumber)?.doubleValue } ?? [:]
        }
    }
    func color(_ role: String, dark: Bool) -> Color {
        let hex = colors[dark ? "dark" : "light"]![role]!.dropFirst()
        let value = UInt64(hex, radix: 16)!
        let alpha = hex.count == 8 ? Double(value & 255) / 255 : 1
        let rgb = hex.count == 8 ? value >> 8 : value
        return Color(.sRGB, red: Double((rgb >> 16) & 255) / 255,
                     green: Double((rgb >> 8) & 255) / 255, blue: Double(rgb & 255) / 255, opacity: alpha)
    }
}

/// Embed in a ScrollView for a resizable application window.
struct NativeExample: View {
    let palette: SemanticPalette
    var renderDark: Bool? = nil
    var renderEnlarged: Bool? = nil
    @ScaledMetric(relativeTo: .body) private var dynamicScale: CGFloat = 1
    @Environment(\.colorScheme) private var systemScheme
    @AppStorage("cycle10.appearance") private var appearance = "System"
    @AppStorage("cycle10.enlarged") private var enlarged = false
    @AppStorage("cycle10.digest") private var digest = true
    @AppStorage("cycle10.links") private var links = false
    @AppStorage("cycle10.edition") private var edition = "Daily"
    @State private var status = "Changes save automatically on this device."
    private var dark: Bool { renderDark ?? (appearance == "Dark" || (appearance == "System" && systemScheme == .dark)) }
    private var scale: CGFloat { (renderEnlarged ?? enlarged) ? 1.35 : 1 }
    private func color(_ role: String) -> Color { palette.color(role, dark: dark) }
    private func font(_ size: CGFloat, _ weight: Font.Weight = .regular) -> Font { .system(size: size * scale * dynamicScale, weight: weight) }
    private func line() -> some View { Rectangle().fill(color("border")).frame(height: 1) }
    private func description(_ text: String) -> some View {
        Text(text).font(font(palette.dimension("type", "bodyMobile"))).foregroundStyle(color("muted-foreground")).fixedSize(horizontal: false, vertical: true)
    }
    private func row<Control: View>(_ title: String, _ detail: String, @ViewBuilder control: () -> Control) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title).font(font(palette.dimension("type", "rowTitle"), .medium))
            description(detail)
            control().font(font(palette.dimension("type", "bodyMobile"))).frame(minHeight: 44)
        }.frame(maxWidth: .infinity, alignment: .leading).padding(.vertical, 20)
    }
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Preferences").font(font(palette.dimension("type", "pageTitle"), .semibold)).padding(.bottom, 12)
            description("Make room for the way you read.")
            Text("Display").font(font(palette.dimension("type", "section"), .medium)).padding(.top, palette.dimension("spacing", "sectionGap")).padding(.bottom, 12)
            line()
            row("Appearance", "Follow your device or choose a theme.") {
                Picker("Appearance", selection: $appearance) {
                    ForEach(["System", "Light", "Dark"], id: \.self) { Text($0).tag($0) }
                }.pickerStyle(.menu).fixedSize().accessibilityLabel("Appearance")
            }
            line()
            row("Larger text", "Increase text size throughout preferences.") {
                Toggle("Use larger text", isOn: $enlarged).toggleStyle(.switch)
            }
            Text("Reading").font(font(palette.dimension("type", "section"), .medium)).padding(.top, 20).padding(.bottom, 12)
            line()
            row("Email digest", "Receive a summary of the stories you follow.") {
                Toggle("Send email digest", isOn: $digest).toggleStyle(.switch)
                if digest {
                    Picker("Frequency", selection: $edition) {
                        Text("Daily").tag("Daily")
                        Text("Weekly").tag("Weekly")
                    }.pickerStyle(.menu).fixedSize()
                }
            }
            line()
            row("Open original articles", "Open story links in your default browser.") {
                Toggle("Open in browser", isOn: $links).toggleStyle(.switch)
            }
            line()
            description(status).padding(.top, palette.dimension("spacing", "sectionInset")).accessibilityAddTraits(.updatesFrequently)
            Button("Reset preferences") {
                appearance = "System"; enlarged = false; digest = true; links = false; edition = "Daily"
                status = "Preferences reset. Changes save automatically."
            }.buttonStyle(.bordered).font(font(palette.dimension("type", "bodyMobile"))).frame(minHeight: 44).padding(.top, 12)
        }
        .padding(palette.dimension("spacing", "gutterMobile"))
        .frame(maxWidth: .infinity, alignment: .leading)
        .foregroundStyle(color("foreground"))
        .background(color("background"))
        .tint(color("primary"))
        .environment(\.colorScheme, dark ? .dark : .light)
    }
}
