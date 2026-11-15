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

for (const trigger of document.querySelectorAll('.pet-card[aria-haspopup="dialog"]')) {
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
