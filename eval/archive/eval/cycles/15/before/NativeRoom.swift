import UIKit

struct RoomPalette {
    let colors: [String: [String: String]]
    init() throws {
        let url = Bundle.main.url(forResource: "tokens", withExtension: "json")!
        let object = try JSONSerialization.jsonObject(with: Data(contentsOf: url)) as! [String: Any]
        colors = object["colors"] as! [String: [String: String]]
    }
    func color(_ role: String, night: Bool) -> UIColor {
        let hex = colors[night ? "night" : "paper"]![role]!.dropFirst()
        let value = UInt64(hex, radix: 16)!
        return UIColor(red: CGFloat((value >> 16) & 255) / 255,
                       green: CGFloat((value >> 8) & 255) / 255,
                       blue: CGFloat(value & 255) / 255, alpha: 1)
    }
}

final class RoomController: UIViewController {
    let palette = try! RoomPalette()
    let scroll = UIScrollView()
    let stack = UIStackView()
    let actions = UIStackView()
    var labels: [UILabel] = []
    var buttons: [UIButton] = []
    var observer: NSObjectProtocol?
    var night: Bool { traitCollection.userInterfaceStyle == .dark }
    func ink(_ role: String) -> UIColor { palette.color(role, night: night) }
    func text(_ value: String, id: String, style: UIFont.TextStyle = .body, handSize: CGFloat? = nil) -> UILabel {
        let label = UILabel()
        label.text = value
        label.accessibilityIdentifier = id
        label.numberOfLines = 0
        label.font = handSize.map { UIFontMetrics(forTextStyle: style).scaledFont(for: UIFont(name: "Schoolbell", size: $0)!) } ?? UIFont.preferredFont(forTextStyle: style)
        label.adjustsFontForContentSizeCategory = true
        label.textColor = ink(id == "byline" ? "muted-foreground" : "foreground")
        labels.append(label)
        return label
    }
    func button(_ title: String, id: String, action: @escaping () -> Void) -> UIButton {
        let button = UIButton(type: .system)
        button.accessibilityIdentifier = id
        button.setTitle(title, for: .normal)
        button.titleLabel!.font = UIFont.preferredFont(forTextStyle: .body)
        button.titleLabel!.adjustsFontForContentSizeCategory = true
        button.titleLabel!.numberOfLines = 0
        button.titleLabel!.lineBreakMode = .byWordWrapping
        button.setTitleColor(ink("foreground"), for: .normal)
        button.layer.borderColor = ink("input").cgColor
        button.layer.borderWidth = 2
        button.layer.cornerRadius = 4
        button.heightAnchor.constraint(equalToConstant: 44).isActive = true
        button.addAction(UIAction { _ in action() }, for: .touchUpInside)
        buttons.append(button)
        return button
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = ink("background")
        scroll.translatesAutoresizingMaskIntoConstraints = false
        stack.translatesAutoresizingMaskIntoConstraints = false
        stack.axis = .vertical
        stack.spacing = 24
        view.addSubview(scroll)
        scroll.addSubview(stack)
        NSLayoutConstraint.activate([
            scroll.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scroll.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
            scroll.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scroll.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            stack.topAnchor.constraint(equalTo: scroll.contentLayoutGuide.topAnchor, constant: 24),
            stack.bottomAnchor.constraint(equalTo: scroll.contentLayoutGuide.bottomAnchor, constant: -24),
            stack.leadingAnchor.constraint(equalTo: scroll.contentLayoutGuide.leadingAnchor, constant: 20),
            stack.trailingAnchor.constraint(equalTo: scroll.contentLayoutGuide.trailingAnchor, constant: -20),
            stack.widthAnchor.constraint(equalTo: scroll.frameLayoutGuide.widthAnchor, constant: -40)
        ])
        stack.addArrangedSubview(text("mara's repair notes", id: "byline", style: .headline, handSize: 24))
        stack.addArrangedSubview(text("some things can be mended.", id: "title", style: .largeTitle, handSize: 48))
        labels.last!.accessibilityTraits.insert(.header)
        stack.addArrangedSubview(text("From a bookbinder's workbench. Notes on old books, stubborn glue, and knowing when to leave a mark alone.", id: "intro"))
        let line = UIView()
        line.backgroundColor = ink("border")
        line.heightAnchor.constraint(equalToConstant: 1).isActive = true
        stack.addArrangedSubview(line)
        stack.addArrangedSubview(text("The blue notebook", id: "note-title", style: .title2, handSize: 32))
        labels.last!.accessibilityTraits.insert(.header)
        stack.addArrangedSubview(text("7 October 2026", id: "date", style: .subheadline))
        stack.addArrangedSubview(text("The cloth is worn through at the corners. Underneath, the board is still firm. I cut four small patches instead of replacing the cover.", id: "body"))
        stack.addArrangedSubview(text("Someone has written a grocery list on the last page. I left it there.", id: "second-paragraph"))
        stack.addArrangedSubview(text("Încet, cu răbdare. Păstrez urmele pe care le-a lăsat timpul.", id: "romanian"))
        actions.axis = .horizontal
        actions.spacing = 12
        actions.distribution = .fillEqually
        actions.addArrangedSubview(button("mark as repaired", id: "repair") { [weak self] in
            guard let self else { return }
            self.buttons[0].isSelected.toggle()
            self.buttons[0].setTitle(self.buttons[0].isSelected ? "✓ marked as repaired" : "mark as repaired", for: .normal)
            self.writeReport()
        })
        actions.addArrangedSubview(button("read next note", id: "next") { [weak self] in
            self?.labels.first(where: { $0.accessibilityIdentifier == "note-title" })?.text = "A loose spine"
        })
        stack.addArrangedSubview(actions)
        observer = NotificationCenter.default.addObserver(forName: UIContentSizeCategory.didChangeNotification, object: nil, queue: .main) { [weak self] _ in self?.view.setNeedsLayout() }
    }
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) { [weak self] in
            guard let self else { return }
            if ProcessInfo.processInfo.arguments.contains("--bottom") {
                self.scroll.setContentOffset(CGPoint(x: 0, y: max(0, self.scroll.contentSize.height - self.scroll.bounds.height)), animated: false)
            }
            self.writeReport()
        }
    }
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        writeReport()
    }
    func writeReport() {
        guard view.window != nil else { return }
        func rect(_ frame: CGRect) -> [String: CGFloat] {
            ["x": frame.minX, "y": frame.minY, "width": frame.width, "height": frame.height]
        }
        let items: [[String: Any]] = labels.map { label in
            let required = label.sizeThatFits(CGSize(width: label.bounds.width, height: .greatestFiniteMagnitude))
            return ["id": label.accessibilityIdentifier!, "fontName": label.font.fontName, "fontSize": label.font.pointSize,
                    "frame": rect(label.convert(label.bounds, to: stack)), "requiredHeight": required.height,
                    "text": label.text!, "isAccessibilityElement": label.isAccessibilityElement]
        }
        let controls: [[String: Any]] = buttons.map { button in
            let label = button.titleLabel!
            let required = label.sizeThatFits(CGSize(width: max(1, button.bounds.width - 24), height: .greatestFiniteMagnitude))
            return ["id": button.accessibilityIdentifier!, "frame": rect(button.convert(button.bounds, to: stack)),
                    "labelFrame": rect(label.frame), "requiredTextHeight": required.height, "fontSize": label.font.pointSize,
                    "title": button.title(for: .normal)!, "isAccessibilityElement": button.isAccessibilityElement]
        }
        let report: [String: Any] = ["category": traitCollection.preferredContentSizeCategory.rawValue,
            "night": night, "viewport": rect(scroll.bounds), "contentSize": ["width": scroll.contentSize.width, "height": scroll.contentSize.height],
            "actionsAxis": actions.axis == .vertical ? "vertical" : "horizontal", "labels": items, "controls": controls]
        if let data = try? JSONSerialization.data(withJSONObject: report, options: [.prettyPrinted, .sortedKeys]) {
            let url = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("layout.json")
            try? data.write(to: url, options: .atomic)
        }
    }
}

@main
final class RoomApp: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    func application(_ application: UIApplication, didFinishLaunchingWithOptions options: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        window = UIWindow(frame: UIScreen.main.bounds)
        window!.rootViewController = RoomController()
        window!.makeKeyAndVisible()
        return true
    }
}
