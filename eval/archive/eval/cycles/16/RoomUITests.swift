import XCTest

final class RoomUITests: XCTestCase {
    @MainActor func testReadingAndControls() throws {
        continueAfterFailure = false
        let app = XCUIApplication()
        app.launch()
        XCTAssertTrue(app.staticTexts["title"].waitForExistence(timeout: 10))
        try app.performAccessibilityAudit()
        let scroll = app.scrollViews.firstMatch
        let repair = app.buttons["repair"]
        for _ in 0..<15 {
            if repair.isHittable { break }
            scroll.swipeUp()
        }
        XCTAssertTrue(repair.isHittable, "A reader must reach the action by scrolling")
        try app.performAccessibilityAudit()
        repair.tap()
        XCTAssertTrue(repair.isSelected)
        XCTAssertTrue(repair.label.contains("marked as repaired"))
        let next = app.buttons["next"]
        for _ in 0..<4 {
            if next.isHittable { break }
            scroll.swipeUp()
        }
        XCTAssertTrue(next.isHittable)
        next.tap()
        XCTAssertEqual(app.staticTexts["note-title"].label, "A loose spine")
        XCTAssertTrue(app.staticTexts["body"].label.contains("strip of linen"))
        XCTAssertTrue(app.staticTexts["note-title"].isHittable, "Reading the next note must show its heading")
        XCTAssertFalse(repair.isSelected, "Repair state belongs to its note")
        let capture = XCTAttachment(screenshot: app.screenshot())
        capture.name = "next-note"
        capture.lifetime = .keepAlways
        add(capture)
        try app.performAccessibilityAudit()
        for _ in 0..<15 {
            if next.isHittable { break }
            scroll.swipeUp()
        }
        XCTAssertTrue(next.isHittable)
        next.tap()
        XCTAssertEqual(app.staticTexts["note-title"].label, "The blue notebook")
        XCTAssertTrue(app.staticTexts["note-title"].isHittable)
        XCTAssertTrue(repair.isSelected, "Returning to a note preserves its own repair state")
    }
}
