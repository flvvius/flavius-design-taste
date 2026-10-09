# Personal room example

Open `index.html` directly in a browser. No server, build step or network connection is needed. The bundled Schoolbell font loads locally. JavaScript adds the paper/night comparison controls and opens project stories when their object links are followed. Without JavaScript, the page uses paper and the stories remain ordinary disclosure controls.

This is fictional content with original SVG drawings. It demonstrates a paper composition based on Flavius's portfolio and a navy poster composition informed by Cluj House. It does not contain their photographs, logos, music artwork or exact copy. The contact section explains its role instead of pointing to a fictional inbox.

Run `npm run check:browser -- --surface personal-room` from the repository to repeat the maintained checks. The failing baseline and fixes are recorded in [cycle 11](../../eval/cycles/11/outcome.md).

The screenshots were captured from this example in Chromium on 9 October 2026, at 1440px desktop and 390px mobile widths. They are browser renders, not generated mockups.

- [Paper desktop](screenshots/paper-desktop.png)
- [Paper mobile](screenshots/paper-mobile.png)
- [Night desktop](screenshots/night-desktop.png)
- [Night mobile](screenshots/night-mobile.png)

Browser verification covered both palettes, 320px layouts, every rendered text size doubled, font loading, project link and disclosure behavior, keyboard activation, the skip link, reduced motion and no-JavaScript use with the font blocked. The root package checker verifies generated token parity, normal-text contrast, control boundaries, local links and the font licence. Visual review checked all four screenshot layouts.
