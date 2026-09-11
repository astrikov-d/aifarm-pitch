const slides = [...document.querySelectorAll('.slide')];
const currentSlide = document.querySelector('#currentSlide');
const progressBar = document.querySelector('#progressBar');
const prevButton = document.querySelector('#prevButton');
const nextButton = document.querySelector('#nextButton');
const fullscreenButton = document.querySelector('#fullscreenButton');

let activeIndex = 0;
const initialIndex = Number(location.hash.replace('#slide-', '')) - 1;
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

function pad(value) {
  return String(value).padStart(2, '0');
}

function updateUi(index) {
  activeIndex = Math.max(0, Math.min(index, slides.length - 1));
  currentSlide.textContent = pad(activeIndex + 1);
  progressBar.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
  history.replaceState(null, '', `#slide-${activeIndex + 1}`);
}

function goTo(index) {
  const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
  slides[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) updateUi(slides.indexOf(visible.target));
  },
  { threshold: [0.55, 0.8] },
);

slides.forEach((slide) => observer.observe(slide));
prevButton.addEventListener('click', () => goTo(activeIndex - 1));
nextButton.addEventListener('click', () => goTo(activeIndex + 1));

document.addEventListener('keydown', (event) => {
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    goTo(activeIndex + 1);
  }
  if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    goTo(activeIndex - 1);
  }
  if (event.key === 'Home') goTo(0);
  if (event.key === 'End') goTo(slides.length - 1);
});

fullscreenButton.addEventListener('click', async () => {
  if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
  else await document.exitFullscreen();
});

window.addEventListener('hashchange', () => {
  const index = Number(location.hash.replace('#slide-', '')) - 1;
  if (Number.isInteger(index) && index >= 0 && index < slides.length) goTo(index);
});

if (Number.isInteger(initialIndex) && initialIndex >= 0) {
  const positionInitialSlide = () => {
    slides[initialIndex].scrollIntoView({ behavior: 'auto', block: 'start' });
    updateUi(initialIndex);
  };
  positionInitialSlide();
  window.addEventListener('load', () => requestAnimationFrame(positionInitialSlide), { once: true });
} else {
  updateUi(0);
}
