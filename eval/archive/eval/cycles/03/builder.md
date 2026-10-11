# Cycle 03 builder notes

Built a personal finance dashboard with EUR balances, outstanding debt, previous-month comparisons and signed changes. Locale selection translates labels and formats figures with Intl.NumberFormat for en-US, de-DE and ar. Filtering shows all accounts, positive balances or negative balances. Summary totals always cover all accounts, as the inline result message explains.

Read the current AGENTS.md, Editorial calm skill, web, patterns and review references, tokens.css and tokens.json afresh. Applied Unslop to prose. Used the latest input role for select boundaries, ring for keyboard focus and warning-text for outstanding-debt copy. Hairlines use border. The page follows the 896px web content width and 16px gutters, flat summary figures and separated account rows. No chart is needed for four direct account comparisons.

## Ambiguities and decisions

RTL guidance does not prescribe currency direction. Arabic sets the document language and direction, while each formatted amount uses an isolated bdi with RTL direction. English and German amounts use LTR isolation. Intl supplies currency placement, digits and sign conventions. Logical spacing and end alignment mirror the layout without reversing the data's reading order. The system font provides Arabic glyphs; tabular digit support depends on that font.

Locale switching changes presentation only. EUR stays the account currency, so the fixture does not imply an exchange-rate conversion. Outstanding debt retains its negative sign and a written negative-balance label rather than relying on colour. Signed changes are arithmetic balance differences, not general claims that a financial situation improved.

The portable JSON defines typography values but the CSS asset does not expose type custom properties. This fixture applies the JSON values directly: 16px body and section heading, 18px row title, 32px page title, weights 400, 500 and 600, and 1.625 body leading. Large summary figures use 28px, a dashboard-specific choice where no figure-size token exists.

Long German and Arabic labels wrap naturally. Comparison rows stack on narrow screens rather than making prose scroll horizontally. Summary figures allow wrapping if text enlargement or a narrow viewport requires it. The 896px width is the web reference default, not a generated width token. No clipping or ellipsis is used to shorten translated content.

No remote requests, libraries, storage operations, seeded faults or bank connections are involved. Language, theme and filter choices last for the current page visit. Only this cycle's two files were written; shared files were not changed and no commit was made.

Parent screenshots and reviewer testing are pending. No browser rendering, contrast result or independent review outcome is claimed here. Arabic wording and bidirectional currency rendering still need review by an Arabic reader and in the target browser.
