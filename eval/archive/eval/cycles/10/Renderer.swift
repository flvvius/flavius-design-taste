import SwiftUI
import AppKit

@main
struct PreferencesRenderer {
    @MainActor static func main() throws {
        guard CommandLine.arguments.count == 3 else {
            throw NSError(domain: "Renderer", code: 1, userInfo: [NSLocalizedDescriptionKey: "Usage: render OUTPUT_DIRECTORY TOKENS_PATH"])
        }
        _ = NSApplication.shared
        let output = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
        let palette = try SemanticPalette(tokensURL: URL(fileURLWithPath: CommandLine.arguments[2]))
        try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
        let snapshotDomain = "design-taste.snapshot." + UUID().uuidString
        guard let snapshotDefaults = UserDefaults(suiteName: snapshotDomain) else {
            throw NSError(domain: "Renderer", code: 4, userInfo: [NSLocalizedDescriptionKey: "Snapshot preferences unavailable"])
        }
        defer { snapshotDefaults.removePersistentDomain(forName: snapshotDomain) }
        for dark in [false, true] {
            for enlarged in [false, true] {
                snapshotDefaults.set(dark ? "Dark" : "Light", forKey: "cycle10.appearance")
                snapshotDefaults.set(enlarged, forKey: "cycle10.enlarged")
                snapshotDefaults.set(true, forKey: "cycle10.digest")
                snapshotDefaults.set(false, forKey: "cycle10.links")
                snapshotDefaults.set("Daily", forKey: "cycle10.edition")
                let view = NativeExample(palette: palette, renderDark: dark, renderEnlarged: enlarged)
                    .defaultAppStorage(snapshotDefaults)
                    .frame(width: 760)
                let host = NSHostingView(rootView: view)
                host.appearance = NSAppearance(named: dark ? .darkAqua : .aqua)
                let size = host.fittingSize
                host.frame = NSRect(origin: .zero, size: size)
                host.layoutSubtreeIfNeeded()
                guard let bitmap = host.bitmapImageRepForCachingDisplay(in: host.bounds) else {
                    throw NSError(domain: "Renderer", code: 2, userInfo: [NSLocalizedDescriptionKey: "Native bitmap allocation failed"])
                }
                host.cacheDisplay(in: host.bounds, to: bitmap)
                guard let png = bitmap.representation(using: .png, properties: [:]) else {
                    throw NSError(domain: "Renderer", code: 3, userInfo: [NSLocalizedDescriptionKey: "Native PNG encoding failed"])
                }
                let name = "\(dark ? "dark" : "light")-\(enlarged ? "enlarged" : "normal").png"
                try png.write(to: output.appendingPathComponent(name))
                print(output.appendingPathComponent(name).path)
            }
        }
    }
}
