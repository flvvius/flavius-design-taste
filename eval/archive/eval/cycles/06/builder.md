# Cycle 06 builder

Read the current repository AGENTS.md, Editorial calm skill, web, desktop, mobile, patterns and review references, tokens.css and fonts.css. Read and applied unslop. The web reference now includes long-word wrapping at enlarged text sizes. No previous builder or review reports were read.

Built three project views with distinct content. Project overview covers the release and immediate priorities. Work plan lists responsibilities and milestones. Research decisions contains native expandable decision records. The project navigation retains the same three links in every view, with deliberately long labels.

Routing uses native links to #/overview, #/work and #/decisions. Hash changes update visible content, document title and exactly one aria-current="page" navigation link. Native link navigation creates browser history entries. Loading a recognised hash opens that view. Empty or unknown hashes resolve to overview using replaceState, so correction does not add a history entry. Route changes focus the new view heading; initial load does not move focus. Cross-view content links use the same routes. Inactive views use hidden, removing their content from focus traversal.

The desktop sidebar becomes an always-visible vertical navigation list above the content below 54rem. There is no collapsed menu, truncated label or horizontal navigation scroller. Links have 48px minimum targets and can grow as labels wrap. Headings, prose and navigation have long-word fallbacks. Columns use zero minimum sizing and stack at narrower widths. Active navigation uses a leading rule, underline and title weight as well as aria-current.

Content sits directly on the page, separated by hairlines. Current typography, spacing, input, focus, control radius and status tokens are used. Theme follows system preference until the user changes it. There are no animations or remote dependencies.

The request did not specify the project domain, route names, sidebar behaviour or focus policy. I chose a fictional research release, three readable route names, permanently visible navigation and heading focus on route changes, including Back and Forward. The sidebar is not sticky, so enlarged navigation never occupies a fixed viewport layer. Navigation remains above each view and can be reached by ordinary scrolling and keyboard traversal. The specimen has no editing or persistence requirement. Without JavaScript, only the overview is available and a message explains that limitation.

The parent will capture screenshots and the independent reviewer will test. No browser render, navigation interaction test, enlarged-text inspection or measured contrast audit was performed by this builder.

Static check passed. Node parsed the inline JavaScript without a syntax error. The HTML is 137 lines. This check does not establish browser history behavior or rendered layout.
