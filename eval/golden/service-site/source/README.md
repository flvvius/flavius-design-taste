# Optional site starter

Copy this folder into a new project outside the taste repository. Node 20.9 or newer is required by the current Next.js setup. The starter has Next.js App Router, Tailwind v4 through PostCSS and Editorial calm semantic tokens. System typography keeps it independent of font downloads. All page copy is marked as placeholder.

```sh
npm install
npm run dev
npm run typecheck
npm run build
```

Replace the page using the site brief. The bundled token stylesheet is generated from the repository's active token source; do not treat this copy as another canonical source. Existing apps should map roles into their existing theme rather than import a second reset.

The scaffold follows the [Next.js installation guide](https://nextjs.org/docs/app/getting-started/installation) and [Tailwind's Next.js integration](https://tailwindcss.com/docs/installation/framework-guides/nextjs), checked during creation. It is optional. The design practice works with other stacks.
