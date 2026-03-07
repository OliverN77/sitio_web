// Variables y referencias a elementos del DOM
const searchModal = document.getElementById('searchModal');
const searchOpenBtn = document.querySelector('.header__actions > a');
const searchCloseBtn = document.querySelector('.modal__search__close');
const searchInput = document.querySelector('.modal__search__input');
const header = document.querySelector('.header__header');
const newsletterModal = document.getElementById('newsletterModal');
const newsletterOpenBtn = document.querySelector('.ui__newsletter');
const newsletterCloseBtn = document.querySelector('.modal__newsletter__close');
const newsletterInput = document.querySelector('.modal__newsletter__input');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarToggle = document.querySelector('.sidebar__toggle');
const sidebarClose = document.querySelector('.sidebar__close');
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
