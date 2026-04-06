// Variables y referencias a elementos del DOM
const articleSidebar = document.getElementById('articleSidebar');
const header = document.querySelector('.header__header');
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

// Funcion para abrir el sidebar
function openSidebar() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    sidebar.setAttribute('aria-hidden', 'false');
    sidebarToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

// Funcion para cerrar el sidebar
function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    sidebar.setAttribute('aria-hidden', 'true');
    sidebarToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// Escuchar eventos de clic para abrir el sidebar
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', openSidebar);
}

// Escuchar eventos de clic para cerrar el sidebar
if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
}

// Cerrar sidebar al hacer clic en el overlay (fuera del sidebar)
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}

// Modal de Busqueda

// Función para abrir modal de búsqueda
function openSearchModal() {
    searchModal.classList.add('active');
    searchModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => searchInput && searchInput.focus(), 100);
    document.body.style.overflow = 'hidden';
}

// Función para cerrar modal de búsqueda
function closeSearchModal() {
    searchModal.classList.remove('active');
    searchModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
    if (searchBody) searchBody.innerHTML = '';
}

// Abrir modal con el botón de búsqueda en el header
if (searchOpenBtn) {
    searchOpenBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openSearchModal();
    });
}

// Cerrar modal con el botón de cerrar
if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', closeSearchModal);
}

//Evita que se cierre el modal al hacer click dentro del contenido
if (searchModal) {
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) closeSearchModal();
    });
}

// Atajos de teclado
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

// Funcion para renderizar resultados de búsqueda
function renderSearchResults(query) {
    searchBody.innerHTML = '';
    if (!query.trim()) return;

    // Filtrar tarjetas que coincidan con la busqueda y se convierte a lowercase para hacer la búsqueda case-insensitive
    const q = query.toLowerCase();
    const matches = allCards.filter(card => card.title.toLowerCase().includes(q));

    // Si no hay resultados, mostrar mensaje
    if (matches.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'modal__search__empty';
        empty.textContent = `No se encontraron resultados para "${query}"`;
        searchBody.appendChild(empty);
        return;
    }

    // Mostrar resultados
    const label = document.createElement('span');
    label.className = 'modal__search__label';
    label.textContent = 'Search results';
    searchBody.appendChild(label);

    // Crear un elemento para cada resultado
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

// Escuchar cambios en el input de búsqueda para actualizar resultados en tiempo real
if (searchInput) {
    searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
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

// Función para aplicar el tema seleccionado
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

// Escuchar clics en el menú de temas
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

//Tabla de contenidos (TOC) - visible en móvil, tablet desktop, ocultado en desktop-xl (donde se muestra el sidebar fijo)

// Función para abrir el TOC
function openToc() {
    articleSidebar.classList.add('active');
    tocOverlay.classList.add('active');
    tocToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

// Función para cerrar el TOC
function closeToc() {
    articleSidebar.classList.remove('active');
    tocOverlay.classList.remove('active');
    tocToggle.setAttribute('aria-expanded', 'false');
}

// Escuchar eventos de clic para abrir y cerrar el TOC
if (tocToggle) tocToggle.addEventListener('click', openToc);
if (tocClose) tocClose.addEventListener('click', closeToc);
if (tocOverlay) tocOverlay.addEventListener('click', closeToc);

// Cerrar TOC al hacer clic en cualquier enlace del sidebar
if (articleSidebar) {
    articleSidebar.querySelectorAll('.article-sidebar__link').forEach(link => {
        link.addEventListener('click', closeToc);
    });
}

// Ticks para map y para links en sidebar (artículos)
const sidebarSections = [...document.querySelectorAll('.article-sidebar__link')].map(link => link.getAttribute('href')?.substring(1)).filter(id => id);
const mapTicks = document.querySelectorAll('.article-sidebar__map-tick');
const sidebarLinks = document.querySelectorAll('.article-sidebar__link');
const mapObserver = new IntersectionObserver(e => {
    e.forEach(en => {
        if (en.isIntersecting) {
            const i = sidebarSections.indexOf(en.target.id);
            mapTicks.forEach(t => t.classList.remove('article-sidebar__map-tick--active'));
            sidebarLinks.forEach(l => l.classList.remove('article-sidebar__link--active'));
            if (i > -1 && mapTicks[i]) {
                mapTicks[i].classList.add('article-sidebar__map-tick--active');
                if (sidebarLinks[i]) sidebarLinks[i].classList.add('article-sidebar__link--active');
            }
        }
    });
}, { threshold: 0.1 });
sidebarSections.forEach(id => {
    const el = document.getElementById(id);
    if (el) mapObserver.observe(el);
});

//Redirigir a card.html si se le da click a todos los <article> con la clase .article-card
document.querySelectorAll('article.article-card').forEach(card => {
    card.addEventListener('click', () => {
        window.location.href = 'card.html';
    });
});