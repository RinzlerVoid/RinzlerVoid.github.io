(() => {
  'use strict';
  const galleryCopy = {
    es: { dialog: 'Vista ampliada de la imagen', close: 'Cerrar imagen', image: 'Vista ampliada del trabajo' },
    en: { dialog: 'Enlarged image view', close: 'Close image', image: 'Enlarged project image' },
    pt: { dialog: 'Visualização ampliada da imagem', close: 'Fechar imagem', image: 'Imagem ampliada do trabalho' },
    de: { dialog: 'Vergrößerte Bildansicht', close: 'Bild schließen', image: 'Vergrößerte Projektansicht' },
    fr: { dialog: 'Agrandissement de l’image', close: 'Fermer l’image', image: 'Image agrandie du projet' },
    id: { dialog: 'Tampilan gambar yang diperbesar', close: 'Tutup gambar', image: 'Gambar proyek yang diperbesar' }
  };
  function currentLanguage() {
    try {
      const lang = localStorage.getItem('nekronex-language-v3') || localStorage.getItem('nyvex-language') || 'es';
      return galleryCopy[lang] ? lang : 'es';
    } catch { return 'es'; }
  }
  let language = currentLanguage();
  let viewer;
  let currentButton = null;

  document.querySelectorAll('.portfolio-browser').forEach((browser) => {
    const filters = [...browser.querySelectorAll('[data-filter]')];
    const cards = [...browser.querySelectorAll('[data-category]')];
    filters.forEach((filter) => filter.addEventListener('click', () => {
      const value = filter.dataset.filter;
      filters.forEach((button) => {
        const active = button === filter;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      cards.forEach((card) => {
        const categories = (card.dataset.category || '').split(/\s+/);
        card.hidden = value !== 'todo' && !categories.includes(value);
      });
    }));
  });

  function translateViewer(lang) {
    language = galleryCopy[lang] ? lang : 'es';
    if (!viewer) return;
    const copy = galleryCopy[language];
    viewer.setAttribute('aria-label', copy.dialog);
    viewer.querySelector('.image-viewer-close')?.setAttribute('aria-label', copy.close);
    if (currentButton) {
      const caption = currentButton.dataset.caption || currentButton.querySelector('img')?.alt || copy.image;
      viewer.querySelector('figcaption').textContent = caption;
      const image = viewer.querySelector('img');
      image.alt = currentButton.querySelector('img')?.alt || copy.image;
    }
  }
  window.addEventListener('nekronex:language', (event) => translateViewer(event.detail?.lang || currentLanguage()));

  function getViewer() {
    if (viewer) return viewer;
    viewer = document.createElement('div');
    viewer.className = 'image-viewer';
    viewer.hidden = true;
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-modal', 'true');
    const copy = galleryCopy[language];
    viewer.setAttribute('aria-label', copy.dialog);
    viewer.innerHTML = `<button class="image-viewer-close" type="button" aria-label="${copy.close}">×</button><figure><img alt=""><figcaption></figcaption></figure>`;
    document.body.appendChild(viewer);
    viewer.addEventListener('click', (event) => { if (event.target === viewer || event.target.closest('.image-viewer-close')) closeViewer(); });
    return viewer;
  }
  function openViewer(button) {
    currentButton = button;
    const modal = getViewer();
    const img = modal.querySelector('img');
    const copy = galleryCopy[language];
    img.src = button.dataset.full || button.querySelector('img')?.src || '';
    img.alt = button.querySelector('img')?.alt || copy.image;
    modal.querySelector('figcaption').textContent = button.dataset.caption || img.alt;
    modal.hidden = false;
    document.body.classList.add('viewer-open');
    modal.querySelector('.image-viewer-close').focus();
  }
  function closeViewer() {
    if (!viewer) return;
    viewer.hidden = true;
    const image = viewer.querySelector('img');
    image.removeAttribute('src');
    document.body.classList.remove('viewer-open');
    if (currentButton) currentButton.focus();
    currentButton = null;
  }
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.gallery-image-button');
    if (button) { event.preventDefault(); openViewer(button); }
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeViewer(); });
})();
