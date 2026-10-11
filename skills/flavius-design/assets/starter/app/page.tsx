export default function Page(){
 return <main className="mx-auto max-w-4xl px-5 py-12">
  <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6"><span>Project name</span><a href="#brief">Read the brief</a></header>
  <section className="py-14" aria-labelledby="title"><p className="text-muted-foreground">Placeholder content</p><h1 id="title" className="mt-3 max-w-2xl text-4xl font-semibold leading-tight sm:text-6xl">Start with the person and the task.</h1><p className="mt-6 max-w-xl text-muted-foreground">Replace this representative page with content from the site brief. Choose its hierarchy before adding a visual idea.</p><a href="#brief" className="mt-7 inline-flex min-h-11 items-center rounded-control bg-primary px-5 py-2 text-primary-foreground">Review the brief</a></section>
  <section id="brief" className="border-t border-border py-8" aria-labelledby="brief-title"><h2 id="brief-title" className="font-medium">What the page needs to do</h2><p className="mt-3 max-w-prose">Name the audience, the next action and the proof. The site's subject decides what makes it memorable.</p></section>
 </main>;
}
