# Patterns

## Settings

Page title, short supporting sentence, section heading and separated rows. Each row has a label, optional explanation and the control. Group related controls with space and a hairline. An account invitation is a line and a sign-in action, not a centred mascot panel.

## Dashboard

A few large tabular figures with muted labels above a list or table. Use column alignment and spacing. A chart earns its own plot area; its heading and explanation still sit on the page. Label series directly and provide a text summary.

## Form

A readable column of labels and fields. Put errors next to their fields and a form error near the submission action. Use clear success text. A modal form earns an overlay; a full-page form does not need a surrounding card.

## Collection

Use rows with consistent anatomy. A lead item can have a larger headline and image when editorial priority justifies it. Saved items should resemble the collection they came from. Media grids are appropriate for visual selection, without decorative shadows and category pills on every thumbnail.

## Empty and loading

Say what is empty and offer a relevant next step. Avoid dashed containers and icon circles. Skeletons reserve the actual title, metadata and media geometry. An error includes a recovery action when one exists.

## Exceptions

A selectable option earns a boundary because that boundary describes a hit target. A dialog earns elevation because it covers the page. A media frame earns clipping because it contains an image. These reasons do not transfer to the section around them.

## Numbers and translated layouts

Keep the sign, digits, decimal separator and currency of a formatted amount together. Tabular figures prevent width changes; they do not prevent a number from wrapping into misleading fragments. Stack a figure below its label when space is short. Do not apply arbitrary character wrapping to amounts. If even a stacked value cannot fit, use an explicitly labelled compact presentation with the full value available.

Use locale-aware number formatting and bidi isolation for amounts in RTL prose. Switching locale changes presentation, not currency or underlying values. Use logical spacing and alignment. Give selects room for their longest translated choice, including at enlarged text sizes; a page without overflow can still hide its selected label.

## Search and asynchronous results

Keep the query, results and status together on the page. Distinguish an untouched search from an empty result and a failed request. State which query produced the result count. Errors offer retry when the request can be repeated. Skeletons match result rows and need no continuous animation.

Invalidate pending results as soon as the query changes, including during a debounce delay or composition. A slow success or failure must not replace the latest query's state. Clearing the query also invalidates pending work. Preserve input focus while results arrive. If retry removes its own button, move focus to a stable control before removing it.

Announce status outside a region marked busy so the loading announcement is available while results update. Test success, empty, repeated failure, recovery and out-of-order responses with a deterministic local source. Check composition before treating every input event as a completed query.

## State when the item changes

A reused row, dialog or toolbar must show the current item's title, content and state together. Store selection, completion or saved status with the item it describes. Check changing the first item, opening another and returning; the second must not inherit the first item's state. Navigation should bring a useful destination into view and identify it through the platform's focus or accessibility mechanism. Enlarged text can expose a destination that was visible at ordinary size but is several screens away at larger sizes.
