const root = document.documentElement;
const palette = document.querySelector('.palette');
palette.hidden = false;
for (const button of palette.querySelectorAll('button')) {
  button.addEventListener('click', () => {
    root.dataset.personalRoom = button.dataset.palette;
    for (const option of palette.querySelectorAll('button')) {
      option.setAttribute('aria-pressed', String(option === button));
    }
  });
}
function openLinkedStory(hash = window.location.hash, focus = false) {
  const target = document.getElementById(hash.slice(1));
  if (target?.tagName !== 'DETAILS') return;
  target.open = true;
  if (focus) target.querySelector('summary').focus({ preventScroll: true });
}
for (const link of document.querySelectorAll('.object-link')) {
  link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    openLinkedStory(link.hash);
    requestAnimationFrame(() => openLinkedStory(link.hash, true));
  });
}
window.addEventListener('hashchange', () => openLinkedStory(window.location.hash, true));
openLinkedStory();
