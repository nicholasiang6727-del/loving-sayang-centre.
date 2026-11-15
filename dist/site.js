const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}

menu.addEventListener('click', () => {
  const opened = navigation.classList.toggle('is-open');
  menu.setAttribute('aria-expanded', String(opened));
});

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});

const desktop = matchMedia('(min-width: 701px)');
desktop.addEventListener('change', closeMenu);
document.documentElement.classList.add('js');

for (const trigger of document.querySelectorAll('button[aria-haspopup="dialog"][aria-controls]')) {
  const dialog = document.getElementById(trigger.getAttribute('aria-controls'));
  const guideBody = dialog.querySelector('.guide-body');

  trigger.addEventListener('click', () => {
    closeMenu();
    dialog.showModal();
    guideBody.scrollTop = 0;
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('close', () => {
    trigger.focus({ preventScroll: true });
  });
}

const store = JSON.parse(document.getElementById('store-details').textContent);

function renderStoreList(id, templateId, items, fill) {
  if (!items.length) return;
  const list = document.getElementById(id);
  const template = document.getElementById(templateId);
  for (const item of items) {
    const fragment = template.content.cloneNode(true);
    fill(fragment, item);
    list.append(fragment);
  }
  list.hidden = false;
  document.getElementById(id + '-empty').hidden = true;
}

renderStoreList('store-photos', 'store-photo-template', store.photos, (photo, item) => {
  const image = photo.querySelector('img');
  image.src = item.src;
  image.alt = item.alt;
  photo.querySelector('figcaption').textContent = item.caption;
});

renderStoreList('store-team', 'staff-template', store.staff, (profile, person) => {
  profile.querySelector('h4').textContent = person.name;
  profile.querySelector('.staff-role').textContent = person.role;
  profile.querySelector('.staff-bio').textContent = person.bio;
});

renderStoreList('store-hours', 'store-hours-template', store.hours, (row, entry) => {
  row.querySelector('dt').textContent = entry.days;
  row.querySelector('dd').textContent = entry.hours;
});

const mapsLink = document.getElementById('store-maps-link');
if (store.address) {
  document.getElementById('store-address').textContent = store.address;
  const map = document.getElementById('store-map');
  map.src = 'https://www.google.com/maps?' + new URLSearchParams({ q: store.address, z: '16', output: 'embed' });
  map.title = 'Google map of the Loving & Sayang Centre address';
  document.getElementById('map-caption').textContent = 'Loving & Sayang Centre';
  mapsLink.href = 'https://www.google.com/maps/search/?' + new URLSearchParams({ api: '1', query: store.address });
  mapsLink.firstChild.textContent = 'Open in Google Maps ';
}
if (store.mapsUrl) {
  mapsLink.href = store.mapsUrl;
  mapsLink.firstChild.textContent = 'Open shop pin ';
  if (!store.address) document.getElementById('map-caption').textContent = 'Johor Bahru area';
}

const whatsappNumber = store.whatsappNumber.replace(/[\s()+-]/g, '');
if (/^[1-9]\d{6,14}$/.test(whatsappNumber)) {
  const whatsappLink = document.getElementById('whatsapp-link');
  whatsappLink.href = 'https://wa.me/' + whatsappNumber;
  whatsappLink.hidden = false;
  document.getElementById('whatsapp-status').hidden = true;
}
