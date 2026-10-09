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
    var eventChecks: [[String: Any]] = []
    var secondNote = false
    var night: Bool { traitCollection.userInterfaceStyle == .dark }
    func ink(_ role: String) -> UIColor {
        UIColor { [palette] traits in palette.color(role, night: traits.userInterfaceStyle == .dark) }
    }
    func text(_ value: String, id: String, style: UIFont.TextStyle = .body, handSize: CGFloat? = nil) -> UILabel {
        let label = UILabel()
        label.text = value
        label.accessibilityIdentifier = id
        label.numberOfLines = 0
        label.isAccessibilityElement = true
        label.font = handSize.map { UIFontMetrics(forTextStyle: style).scaledFont(for: UIFont(name: "Schoolbell", size: $0)!) } ?? UIFont.preferredFont(forTextStyle: style)
        label.adjustsFontForContentSizeCategory = true
        label.textColor = ink(id == "byline" ? "muted-foreground" : "foreground")
        labels.append(label)
        return label
    }
    func button(_ title: String, id: String, action: @escaping () -> Void) -> UIButton {
        let button = UIButton(type: .system)
        button.accessibilityIdentifier = id
        var configuration = UIButton.Configuration.plain()
        configuration.title = title
        configuration.titleLineBreakMode = .byWordWrapping
        configuration.contentInsets = NSDirectionalEdgeInsets(top: 12, leading: 16, bottom: 12, trailing: 16)
        configuration.baseForegroundColor = ink("foreground")
        configuration.background.strokeColor = ink("input")
        configuration.background.strokeWidth = 2
        configuration.background.cornerRadius = 4
        configuration.titleTextAttributesTransformer = UIConfigurationTextAttributesTransformer { attributes in
            var result = attributes
            result.font = UIFont.preferredFont(forTextStyle: .body)
            return result
        }
        button.configuration = configuration
        button.isAccessibilityElement = true
        button.titleLabel!.adjustsFontForContentSizeCategory = true
        button.titleLabel!.numberOfLines = 0
        button.heightAnchor.constraint(greaterThanOrEqualToConstant: 44).isActive = true
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
            self.buttons[0].configuration?.title = self.buttons[0].isSelected ? "✓ marked as repaired" : "mark as repaired"
            self.view.setNeedsLayout()
        })
        actions.addArrangedSubview(button("read next note", id: "next") { [weak self] in
            guard let self else { return }
            self.secondNote.toggle()
            let values = self.secondNote ? [
                "note-title": "A loose spine", "date": "4 October 2026",
                "body": "The sewing still holds, but the cover has come away from the spine. I lifted the old glue and added a narrow strip of linen.",
                "second-paragraph": "The book opens more easily now. The pages can lie flat without pulling at the hinge.",
                "romanian": "O reparație mică. Cartea poate fi citită din nou."
            ] : [
                "note-title": "The blue notebook", "date": "7 October 2026",
                "body": "The cloth is worn through at the corners. Underneath, the board is still firm. I cut four small patches instead of replacing the cover.",
                "second-paragraph": "Someone has written a grocery list on the last page. I left it there.",
                "romanian": "Încet, cu răbdare. Păstrez urmele pe care le-a lăsat timpul."
            ]
            for label in self.labels { if let value = values[label.accessibilityIdentifier!] { label.text = value } }
            self.buttons[1].configuration?.title = self.secondNote ? "read previous note" : "read next note"
            self.view.setNeedsLayout()
        })
        stack.addArrangedSubview(actions)
        observer = NotificationCenter.default.addObserver(forName: UIContentSizeCategory.didChangeNotification, object: nil, queue: .main) { [weak self] _ in self?.view.setNeedsLayout() }
    }
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) { [weak self] in
            guard let self else { return }
            if ProcessInfo.processInfo.arguments.contains("--exercise-controls") {
                self.buttons[0].sendActions(for: .touchUpInside)
                self.eventChecks.append(["name": "mark repaired", "passed": self.buttons[0].isSelected && self.buttons[0].configuration?.title == "✓ marked as repaired"])
                self.buttons[0].sendActions(for: .touchUpInside)
                self.eventChecks.append(["name": "unmark repaired", "passed": !self.buttons[0].isSelected && self.buttons[0].configuration?.title == "mark as repaired"])
                self.buttons[1].sendActions(for: .touchUpInside)
                let noteTitle = self.labels.first(where: { $0.accessibilityIdentifier == "note-title" })!.text
                let body = self.labels.first(where: { $0.accessibilityIdentifier == "body" })!.text!
                self.eventChecks.append(["name": "next note updates its content", "passed": noteTitle == "A loose spine" && body.contains("strip of linen")])
                self.view.layoutIfNeeded()
            }
            if ProcessInfo.processInfo.arguments.contains("--bottom") {
                self.scroll.setContentOffset(CGPoint(x: 0, y: max(0, self.scroll.contentSize.height - self.scroll.bounds.height)), animated: false)
            }
            self.writeReport()
        }
    }
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        let desiredAxis: NSLayoutConstraint.Axis = traitCollection.preferredContentSizeCategory.isAccessibilityCategory ? .vertical : .horizontal
        if actions.axis != desiredAxis {
            actions.axis = desiredAxis
            actions.distribution = desiredAxis == .vertical ? .fill : .fillEqually
            view.setNeedsLayout()
            return
        }
        DispatchQueue.main.async { [weak self] in self?.writeReport() }
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
                    "title": button.configuration?.title ?? button.title(for: .normal)!, "isAccessibilityElement": button.isAccessibilityElement]
        }
        let report: [String: Any] = ["category": traitCollection.preferredContentSizeCategory.rawValue,
            "night": night, "viewport": rect(scroll.bounds), "contentSize": ["width": scroll.contentSize.width, "height": scroll.contentSize.height],
            "actionsAxis": actions.axis == .vertical ? "vertical" : "horizontal", "labels": items, "controls": controls, "eventChecks": eventChecks]
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
        if ProcessInfo.processInfo.arguments.contains("--snapshot") { UIView.setAnimationsEnabled(false) }
        window = UIWindow(frame: UIScreen.main.bounds)
        window!.rootViewController = RoomController()
        window!.makeKeyAndVisible()
        return true
    }
}
