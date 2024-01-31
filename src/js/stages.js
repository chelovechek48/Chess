const buttonPrev = document.querySelector('.stages__button-prev');
const buttonNext = document.querySelector('.stages__button-next');
const stagesList = document.querySelector('.stages__list');
const stagesDot = document.querySelectorAll('.stages__navigation-dots-item');

const paddingContainer = '1.5rem';
const maxSlide = 5;
const movementSize = (index) => (`calc((-100vw + ${paddingContainer}) * ${index})`);
let slideIndex = 0;

buttonPrev.disabled = true;
buttonPrev.addEventListener('click', () => {
  const isFirstSlice = slideIndex <= 0;
  if (!isFirstSlice) {
    stagesDot[slideIndex].classList.remove('active');
    slideIndex -= 1;
    stagesDot[slideIndex].classList.add('active');
    stagesList.style.transform = `translateX(${movementSize(slideIndex)})`;
  }

  const nextFirstSlice = slideIndex === 0;
  if (nextFirstSlice) {
    buttonPrev.disabled = true;
  }
  buttonNext.disabled = false;
});

buttonNext.addEventListener('click', () => {
  const isLastSlice = slideIndex >= maxSlide - 1;
  if (!isLastSlice) {
    stagesDot[slideIndex].classList.remove('active');
    slideIndex += 1;
    stagesDot[slideIndex].classList.add('active');
    stagesList.style.transform = `translateX(${movementSize(slideIndex)})`;
  }

  const nextLastSlice = slideIndex === maxSlide - 1;
  if (nextLastSlice) {
    buttonNext.disabled = true;
  }
  buttonPrev.disabled = false;
});

stagesDot.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    slideIndex = index;
    const stagesDotActive = document.querySelector('.stages__navigation-dots-item.active');
    stagesDotActive.classList.remove('active');
    stagesList.style.transform = `translateX(${movementSize(index)})`;
    stagesDot[index].classList.add('active');

    const isFirstSlice = index <= 0;
    const isLastSlice = index >= maxSlide - 1;
    if (isFirstSlice) {
      buttonPrev.disabled = true;
      buttonNext.disabled = false;
    } else if (isLastSlice) {
      buttonPrev.disabled = false;
      buttonNext.disabled = true;
    } else {
      buttonPrev.disabled = false;
      buttonNext.disabled = false;
    }
  });
});
