const gap = 'var(--gap)';
const paddingContainer = 1.5;
const paddingContainerRem = `${paddingContainer}rem`;
const containerWidth = `${76.25 + paddingContainer}rem`;
const movementSize = (index) => (`calc(0px - ((min(100vw, ${containerWidth}) - 2 * ${paddingContainerRem} + ${gap}) * ${index}))`);

const moveSlide = (navigationBlock, increment) => {
  const slider = navigationBlock.parentElement.parentElement.querySelector('.navigation__slider');

  let slideIndex = Number(navigationBlock.getAttribute('data-slide'));
  slideIndex += increment;
  navigationBlock.setAttribute('data-slide', slideIndex);

  slider.style.transform = `translateX(${movementSize(slideIndex)})`;

  const buttonPrev = navigationBlock.querySelector('.navigation__button-prev');
  const buttonNext = navigationBlock.querySelector('.navigation__button-next');
  buttonNext.disabled = false;
  buttonPrev.disabled = false;

  const firstSlideIsVisible = slideIndex === 0;
  if (firstSlideIsVisible) {
    buttonPrev.disabled = true;
  }

  const maxItems = Number(slider.getAttribute('data-slides-number'));
  const numberOfVisible = Number(getComputedStyle(slider).getPropertyValue('--number-of-visible')) || 1;
  const lastSlideIsVisible = slideIndex === maxItems / numberOfVisible - 1;

  if (lastSlideIsVisible) {
    buttonNext.disabled = true;
  }

  const number = navigationBlock.querySelector('.navigation__number');
  if (number) {
    number.setAttribute('data-slide', slideIndex + 1);
    number.setAttribute('max-slide', maxItems / numberOfVisible);
  }
};

const navigationButtons = document.querySelectorAll('.navigation__button');
navigationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const increment = Number(button.getAttribute('data-increment'));
    moveSlide(button.parentElement, increment);
  });
});

const navigationButtonsPrev = document.querySelectorAll('.navigation__button-prev');

const resetSlider = () => {
  navigationButtonsPrev.forEach((slider) => {
    const navBlock = slider.parentElement;
    const increment = 0 - (Number(navBlock.getAttribute('data-slide')));

    moveSlide(slider.parentElement, increment);
  });
};

const disabledButtonPrev = () => {
  navigationButtonsPrev.forEach((buttonPrev) => {
    buttonPrev.disabled = true;
  });
};

const events = ['resize', 'DOMContentLoaded'];
events.forEach((event) => {
  window.addEventListener(event, resetSlider);
});

window.addEventListener('DOMContentLoaded', () => {
  disabledButtonPrev();
});

const navigationDots = document.querySelectorAll('.navigation__dots');
navigationDots.forEach((dotList) => {
  const dotItems = dotList.querySelectorAll('.navigation__dots-item');
  dotItems.forEach((dotItem, index) => {
    dotItem.addEventListener('click', () => {
      const dotItemActive = dotList.querySelector('.navigation__dots-item.active');
      dotItemActive.classList.remove('active');
      dotItem.classList.add('active');

      const navBlock = dotItem.parentElement.parentElement;
      const increment = index - Number(navBlock.getAttribute('data-slide'));

      moveSlide(navBlock, increment);
    });
  });
});
