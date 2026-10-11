# Charts

A plot earns space to explain data. Its heading, summary and controls still sit on the page. Use colour when it identifies a series, not to decorate a dashboard.

Label the units and scale. Comparable values need a common scale; bar charts normally start at zero. Period changes must update the chart, labels, totals and summary together.

Direct labels help, but crowded or crossing series also need distinct line styles, markers or patterns. Keep a labelled legend when direct labels cannot fit. Identification must survive colour loss and both themes.

Check forced-colour mode separately. Browsers can replace fills and remove gradient patterns, making bars disappear or series look alike. Use system colour pairs such as CanvasText on Canvas for essential marks and their legend keys. If a pattern needs `forced-color-adjust: none`, scope it to those marks and use system colours inside it; keep the surrounding interface under the user's colour settings. Verify the rendered result, not just a matching media query. See the [CSS colour adjustment specification](https://www.w3.org/TR/css-color-adjust-1/#forced-colors-properties).

Check contrast of essential marks against adjacent colours, including the plot background. A semantic accent is not automatically a readable chart colour. Meaningful graphics generally need 3:1. Decorative gridlines can stay quiet. See [W3C non-text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

Give the chart a brief text summary and access to the underlying values, often through a disclosure table. Hover-only values exclude keyboard and touch users. See [W3C guidance for complex images](https://www.w3.org/WAI/tutorials/images/complex/).

The values need their own responsive layout. For a few paired values, labelled rows can keep each series, date and count together when table columns become cramped. Preserve the comparison table when cross-row scanning needs it. Show one representation at a time and update both from the same data. Keep labels readable and numbers intact. Dense tables may need a labelled, keyboard-accessible scroll region; keep the surrounding prose within the page width.

For a static report enhanced with period controls, put the default data and readable values in the initial HTML. Enable script-dependent controls only when their behavior is ready. A missing script should not turn a readable report into empty headings and inert controls.

At narrow or enlarged sizes, check axis labels, legends and annotations independently of the bars or lines. SVG labels need explicit attention too; scaling the plot can shrink their text. Prefer a readable alternative layout to clipping labels or turning prose into a horizontal scroller.

Keep short category labels intact. When many vertical buckets squeeze labels, a horizontal bar layout can give each label its own row while preserving the same values and scale. Place zero and maximum labels at the matching ends of the actual value axis; labels at the wrong end can contradict otherwise accurate data.
