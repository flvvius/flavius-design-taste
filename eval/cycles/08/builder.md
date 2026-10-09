# Cycle08 builder

Built one local profile editor with editable name, email and bio. Review changes opens a modal containing the changed values. Confirm save updates the in-memory profile; discard requires a separate confirmation and restores that profile. Reload resets the demo.

Guidance used: repository AGENTS.md, current editorial-calm/SKILL.md, references/web.md, patterns.md and review.md, assets/tokens.css and fonts.css, and the Unslop skill. The new charts reference is not relevant to this form. No previous cycle artifacts or reviews were read.

The form sits directly on the page. Hairlines separate content; the modal earns its enclosing surface. Root theme switching uses the shared dark class. Essential control boundaries use input, separators use border, plain discard text uses destructive, and the filled discard confirmation uses destructive with destructive-foreground in both themes. The dialog uses popover and popover-foreground.

Native dialog.showModal provides modal background inertness and keyboard focus containment. Opening focuses Keep editing. Escape and Keep editing preserve drafts; closing restores focus to the initiating button. The dialog scrolls within a viewport-relative maximum height, while the page locks scrolling. Its short entrance animation is disabled for reduced motion. Controls and text use inherited or rem-based sizes; actions stack on narrow screens. Native required/email validation and a whitespace-name constraint precede save review. User text enters the review through textContent.

Actual ambiguity: the request does not say which operation needs confirmation or whether edits should persist. I chose confirmation for both save and discard and in-memory persistence, with that limit stated on the screen. Appearance follows the system until the user chooses a theme for this page session.

Checks performed: source inspection of event paths, safe review rendering, root theme roles, relative assets and reduced-motion rules. The parent renders and the independent reviewer tests browser behavior, focus recovery, scrolling, contrast and enlarged text. No browser-render claim is made here.
