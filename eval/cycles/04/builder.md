# Cycle 04 builder

Built a document library with eight local records, sortable document, owner, updated and status columns, individual and select-all checkboxes, bulk archive and restore, and undo for the latest bulk action. Selection follows document IDs through sorting. Switching between active and archived documents clears selection. Changes last until page reload.

Read the repository AGENTS.md, current Editorial calm skill, desktop, web, patterns and review references, tokens.css and fonts.css. Applied unslop to the interface copy and this record. No previous builder or reviewer reports were read.

The layout puts content directly on the page and uses hairlines between rows. Selected rows earn a restrained accent background. Typography uses the supplied size and weight variables, with smaller metadata for table density. Controls use input boundaries, control radius and ring tokens. Ready uses success text, and In review uses warning-text. The theme follows system preference until the user chooses a theme.

Native checkboxes provide Tab and Space selection. Arrow keys move focus between row checkboxes without changing selection. Column buttons expose aria-sort. A separate sorting control is available on small screens, where rows stack every metadata field beneath the document title. Bulk actions announce their result and move focus to Undo.

The request did not specify document opening, upload, backend persistence or a selection shortcut scheme. This specimen covers collection management with in-memory data. Document titles are plain text. Undo stores only the most recent bulk action. The narrow layout retains the table markup and visible metadata; screen-reader interpretation of the CSS layout needs review in the target browser.

No browser render, interaction tests, accessibility audit or native build was run. The parent renders the artifact and an independent reviewer tests it. Static file and script syntax checks are recorded only if performed below.

Static checks passed. Node parsed the inline script without a syntax error. The HTML is 71 lines, within the 220-line limit, and both referenced CSS assets exist. These checks do not establish rendered layout or interaction correctness.
