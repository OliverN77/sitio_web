// Variables y referencias a elementos del DOM
const articleSidebar = document.getElementById('articleSidebar');
const header = document.querySelector('.header__header');
const newsletterCloseBtn = document.querySelector('.modal__newsletter__close');
const newsletterInput = document.querySelector('.modal__newsletter__input');
const newsletterModal = document.getElementById('newsletterModal');
const newsletterOpenBtn = document.querySelector('.ui__newsletter');
const searchBody = document.querySelector('.modal__search__body');
const searchCloseBtn = document.querySelector('.modal__search__close');
const searchInput = document.querySelector('.modal__search__input');
const searchModal = document.getElementById('searchModal');
const searchOpenBtn = document.querySelector('.header__actions > a');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.querySelector('.sidebar__close');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarToggle = document.querySelector('.sidebar__toggle');
const themeLink = document.getElementById('theme-stylesheet');
const themeItems = document.querySelectorAll('.ui__menu li');
const toggleIcon = document.querySelector('.ui__toggle i');
const tocClose = document.getElementById('tocClose');
const tocOverlay = document.getElementById('tocOverlay');
const tocToggle = document.getElementById('tocToggle');

let allCards = [];
let lastScroll = 0;

// Sidebar

function openSidebar() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    sidebar.setAttribute('aria-hidden', 'false');
    sidebarToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    sidebar.setAttribute('aria-hidden', 'true');
    sidebarToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', openSidebar);
}

if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}

// Modal de Busqueda

function openSearchModal() {
    searchModal.classList.add('active');
    searchModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => searchInput && searchInput.focus(), 100);
    document.body.style.overflow = 'hidden';
}

function closeSearchModal() {
    searchModal.classList.remove('active');
    searchModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
    if (searchBody) searchBody.innerHTML = '';
}

if (searchOpenBtn) {
    searchOpenBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openSearchModal();
    });
}

if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', closeSearchModal);
}

if (searchModal) {
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) closeSearchModal();
    });
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (sidebar.classList.contains('active')) closeSidebar();
        if (searchModal.classList.contains('active')) closeSearchModal();
        if (articleSidebar && articleSidebar.classList.contains('active')) closeToc();
    }
    // Atajo Ctrl+K: alterna el modal
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchModal.classList.contains('active')) {
            closeSearchModal();
        } else {
            openSearchModal();
        }
    }
});

// Generar allCards desde los elementos de la página actual
function generateAllCards() {
    const cards = [...document.querySelectorAll('.posts__grid__card, .post__list__card')].map(card => {
        const a = card.querySelector('a');
        const titleEl = card.querySelector('h3') || card.querySelector('h2');
        const imgEl = card.querySelector('img');
        const dateEl = card.querySelector('.card__info span') || card.querySelector('.post__info span');
        return {
            title: titleEl?.textContent.trim() || '',
            href: a?.getAttribute('href') || '#',
            img: imgEl?.getAttribute('src') || '',
            imgAlt: imgEl?.getAttribute('alt') || '',
            date: dateEl?.textContent.trim() || '',
        };
    });
    
    // Si se generaron tarjetas, guardar en localStorage
    if (cards.length > 0) {
        localStorage.setItem('allCards', JSON.stringify(cards));
        return cards;
    }
    
    // Si no hay tarjetas en esta página, restaurar desde localStorage
    const saved = localStorage.getItem('allCards');
    return saved ? JSON.parse(saved) : [];
}

allCards = generateAllCards();

function renderSearchResults(query) {
    searchBody.innerHTML = '';
    if (!query.trim()) return;

    const q = query.toLowerCase();
    const matches = allCards.filter(card => card.title.toLowerCase().includes(q));

    if (matches.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'modal__search__empty';
        empty.textContent = `No se encontraron resultados para "${query}"`;
        searchBody.appendChild(empty);
        return;
    }

    const label = document.createElement('span');
    label.className = 'modal__search__label';
    label.textContent = 'Search results';
    searchBody.appendChild(label);

    matches.forEach(card => {
        const a = document.createElement('a');
        a.className = 'modal__search__result';
        a.href = card.href;

        const info = document.createElement('div');
        info.className = 'modal__search__result__info';

        const titleEl = document.createElement('span');
        titleEl.className = 'modal__search__result__title';
        titleEl.textContent = card.title;

        const dateEl = document.createElement('span');
        dateEl.className = 'modal__search__result__date';
        dateEl.textContent = card.date;

        info.appendChild(titleEl);
        info.appendChild(dateEl);

        const img = document.createElement('img');
        img.className = 'modal__search__result__img';
        img.src = card.img;
        img.alt = card.imgAlt;

        a.appendChild(info);
        a.appendChild(img);
        searchBody.appendChild(a);
    });
}

if (searchInput) {
    searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
}

// Modal flotante de newsletter

function openNewsletterModal() {
    newsletterModal.classList.add('active');
    newsletterModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => newsletterInput && newsletterInput.focus(), 100);
}


if (newsletterOpenBtn) {
    newsletterOpenBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openNewsletterModal();
    });
}

// Cerrar modal de newsletter al hacer click fuera del diálogo
if (newsletterModal) {
    newsletterModal.addEventListener('click', (e) => {
        // Si el click fue en el fondo (no en el cuadro)
        if (e.target === newsletterModal) {
            newsletterModal.classList.remove('active');
            newsletterModal.setAttribute('aria-hidden', 'true');
        }
    });
}

// Ocualtar navbar con scroll

window.addEventListener('scroll', () => {
    // Obtiene la posicion actual del scroll
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 60) {
        // Scroll hacia abajo, ocultar
        header.classList.add('header--hide');
    } else {
        // Scroll hacia arriba, mostrar
        header.classList.remove('header--hide');
    }

    if (newsletterModal) {
        if (currentScroll > lastScroll) {
            // Scroll hacia abajo -> establecer inset: 0
            newsletterModal.style.setProperty('inset', '0');
        } else {
            // Scroll hacia arriba -> remover la propiedad inset
            newsletterModal.style.removeProperty('inset');
        }
    }

    // Actualiza la ultima posicion del scroll
    lastScroll = currentScroll;
});

// Selector de tema
function resolveTheme(theme) {
    if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
}

function applyTheme(theme) {
    const resolved = resolveTheme(theme);
    themeLink.href = `css/themes/${resolved}-theme.css`;

    // Mover el ícono fa-check al ítem activo
    themeItems.forEach(item => {
        const check = item.querySelector('.fa-solid.fa-check');
        if (check) check.remove();
    });
    const activeIndex = theme === 'light' ? 0 : theme === 'dark' ? 1 : 2;
    const checkIcon = document.createElement('i');
    checkIcon.className = 'fa-solid fa-check';
    themeItems[activeIndex].appendChild(checkIcon);

    // Actualizar ícono del botón toggle
    toggleIcon.className = resolved === 'dark' ? 'fa-regular fa-moon' : 'fa-regular fa-sun';

    localStorage.setItem('theme', theme);
}

// Cargar preferencia guardada
applyTheme(localStorage.getItem('theme') || 'system');

// Escuchar clics en el menú de tema
themeItems[0].addEventListener('click', () => applyTheme('light'));
themeItems[1].addEventListener('click', () => applyTheme('dark'));
themeItems[2].addEventListener('click', () => applyTheme('system'));

// Actualizar si cambia la preferencia del sistema mientras está en "system"
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('theme') === 'system' || !localStorage.getItem('theme')) {
        applyTheme('system');
    }
});

// Funcionalidad de copiar código al portapapeles (card)
document.querySelectorAll('.code-block__copy').forEach(btn => {
    btn.addEventListener('click', () => {
        const code = btn.closest('.project__code-block').querySelector('code').innerText;
        navigator.clipboard.writeText(code).then(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            setTimeout(() => btn.innerHTML = '<i class="fa-regular fa-copy"></i>', 1500);
        });
    });
});

function openToc() {
    articleSidebar.classList.add('active');
    tocOverlay.classList.add('active');
    tocToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeToc() {
    articleSidebar.classList.remove('active');
    tocOverlay.classList.remove('active');
    tocToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

if (tocToggle) tocToggle.addEventListener('click', openToc);
if (tocClose) tocClose.addEventListener('click', closeToc);
if (tocOverlay) tocOverlay.addEventListener('click', closeToc);

// Close TOC when a link inside it is clicked
if (articleSidebar) {
    articleSidebar.querySelectorAll('.article-sidebar__link').forEach(link => {
        link.addEventListener('click', closeToc);
    });
}

