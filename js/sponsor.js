const COLORS = [
    '#2d2f32', '#385aa9', '#09823b', '#3b82f6',
    '#7134a8', '#a5490b'
];

const ANIMATIONS = [
    'digit-anim-spin',
    'digit-anim-bounce',
    'digit-anim-shake',
    'digit-anim-pop',
    'digit-anim-flip',
    'digit-anim-wobble'
];

document.querySelectorAll('.error-page__digit').forEach((digit) => {
    digit.dataset.colorIndex = 0;

    digit.addEventListener('click', () => {
        const nextIndex = (parseInt(digit.dataset.colorIndex) + 1) % COLORS.length;
        digit.dataset.colorIndex = nextIndex;
        digit.style.color = COLORS[nextIndex];

        digit.classList.remove(...ANIMATIONS);
        void digit.offsetWidth;
        const anim = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];
        digit.classList.add(anim);

        digit.addEventListener('animationend', () => digit.classList.remove(anim), { once: true });
    });
});