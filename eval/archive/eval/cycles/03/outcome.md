# Cycle 03: localized finance dashboard

The builder created a dashboard using English, German and Arabic presentation, EUR values and account filters. The reviewer confirmed that localization preserved the values and isolated number direction, but found a clipped filter selection and monetary amounts splitting into misleading lines at enlarged text sizes.

The narrow filter now gets a full row, and complete amounts stay together below their labels. The shared pattern explains intact monetary values, locale-aware formatting, logical alignment and translated control sizing. The review guide now asks for enlargement of all text, including explicitly sized figures and controls.

Builder notes also exposed duplicated typography constants because JSON values were missing from the CSS export. Typography and press scale now have generated CSS variables. Browser type preferences scale rem-based sizes; dimension-checks.json confirms the body moves from 16px to 20px with the root preference.

The independent review and recheck distinguish financial-value and layout checks from Arabic linguistic validation. verify.mjs exercises all-text enlargement at 375px in three locales and checks intact summary amounts with no page overflow. It counts distinct vertical lines, not bidi fragments on the same line. The four theme/layout checks also pass.
