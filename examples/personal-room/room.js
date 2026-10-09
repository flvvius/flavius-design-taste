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
function openLinkedStory() {
  const id = window.location.hash.slice(1);
  const target = document.getElementById(id);
  if (target?.tagName === 'DETAILS') target.open = true;
}
window.addEventListener('hashchange', openLinkedStory);
openLinkedStory();
