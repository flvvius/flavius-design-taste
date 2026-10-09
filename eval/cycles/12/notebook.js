const entries = [...document.querySelectorAll('.entries details')];
const form = document.querySelector('#editor');
const feedback = document.querySelector('#feedback');
const edit = document.querySelector('#edit');
const titleInput = document.querySelector('#note-title');
const bodyInput = document.querySelector('#note-body');
const storageKey = 'personal-room-repair-notes';
let selected = entries[0];
let storageAvailable = true;
const drafts = new Map();
const textOf = entry => [...entry.querySelectorAll('.entry-body p')].map(p => p.textContent).join('\n\n');
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  for (const entry of entries) {
    const value = saved[entry.id];
    if (value && typeof value.title === 'string' && typeof value.body === 'string' && value.title.trim() && value.body.trim()) update(entry, value.title, value.body);
  }
} catch {storageAvailable = false;}
function update(entry, title, body) {
  entry.querySelector('summary').textContent = title;
  document.querySelector(`[data-note="${entry.id}"]`).textContent = title;
  const paragraphs = body.split(/\n\s*\n/).map(text => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
  });
  entry.querySelector('.entry-body').replaceChildren(...paragraphs);
}
function clearErrors() {
  for (const input of [titleInput, bodyInput]) input.removeAttribute('aria-invalid');
  document.querySelector('#title-error').textContent = '';
  document.querySelector('#body-error').textContent = '';
}
function choose(id, focus = false) {
  const entry = entries.find(entry => entry.id === id);
  if (!entry) return;
  if (!form.hidden) drafts.set(selected.id, {title: titleInput.value, body: bodyInput.value});
  selected = entry;
  for (const item of entries) {item.hidden = item !== entry; item.open = item === entry;}
  for (const link of document.querySelectorAll('[data-note]')) {
    if (link.dataset.note === id) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  }
  form.hidden = true;
  edit.hidden = false;
  clearErrors();
  feedback.textContent = drafts.has(entry.id) ? 'You have an unsaved draft for this note. Use edit to continue.' : storageAvailable ? '' : 'Saved notes could not be loaded. You can read these notes, but keep a copy of any edits.';
  if (focus) selected.querySelector('summary').focus({preventScroll:true});
}
for (const link of document.querySelectorAll('[data-note]')) link.addEventListener('click', event => {
  if (event.button || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
  choose(link.dataset.note);
  requestAnimationFrame(() => choose(link.dataset.note, true));
});
window.addEventListener('hashchange', () => choose(location.hash.slice(1), true));
edit.addEventListener('click', () => {
  const draft = drafts.get(selected.id);
  titleInput.value = draft?.title ?? selected.querySelector('summary').textContent;
  bodyInput.value = draft?.body ?? textOf(selected);
  selected.open = true;
  form.hidden = false;
  edit.hidden = true;
  clearErrors();
  feedback.textContent = '';
  titleInput.focus();
});
document.querySelector('#cancel').addEventListener('click', () => {
  drafts.delete(selected.id);
  form.hidden = true; edit.hidden = false; clearErrors(); edit.focus();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  clearErrors();
  const title = titleInput.value.trim(), body = bodyInput.value.trim();
  if (!title || !body) {
    if (!title) {titleInput.setAttribute('aria-invalid','true'); document.querySelector('#title-error').textContent='Add a title so you can find this note again.';}
    if (!body) {bodyInput.setAttribute('aria-invalid','true'); document.querySelector('#body-error').textContent='Write what happened before saving the note.';}
    feedback.textContent='The note needs a title and some text.';
    (!title ? titleInput : bodyInput).focus();
    return;
  }
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) throw new Error('Invalid saved notes');
    saved[selected.id] = {title, body};
    localStorage.setItem(storageKey, JSON.stringify(saved));
    update(selected, title, body);
    drafts.delete(selected.id);
    storageAvailable = true;
    form.hidden = true; edit.hidden = false; edit.focus();
    feedback.textContent='Note saved in this browser.';
  } catch {
    feedback.textContent='The browser could not save this note. Your draft is still here. Copy it somewhere safe before leaving.';
  }
});
const palette = document.querySelector('.palette');
palette.hidden = false;
for (const button of palette.querySelectorAll('button')) button.addEventListener('click', () => {
  document.documentElement.dataset.personalRoom = button.dataset.palette;
  for (const option of palette.querySelectorAll('button')) option.setAttribute('aria-pressed',String(option===button));
});
choose(location.hash.slice(1) || entries[0].id);
