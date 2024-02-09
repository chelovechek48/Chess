const gap = 'var(--gap)';
const wrapperMaxWidth = '1150px';
const wrapperPadding = '20px';
const wrapperWidth = `min(calc(100vw - ${wrapperPadding} * 2), ${wrapperMaxWidth})`;
const movementSize = (slideIndex) => (`calc(0px - (${wrapperWidth} + ${gap}) * ${slideIndex})`);

const moveSlide = (navigationBlock, increment) => {
  let slideIndex = Number(navigationBlock.getAttribute('data-slide'));
  slideIndex += increment;

  let slider;
  let sliders;
  const isSliderLoop = Boolean(navigationBlock.getAttribute('data-slider-loop'));
  if (isSliderLoop) {
    sliders = navigationBlock.parentElement.parentElement.querySelectorAll('.navigation__slider');
    slider = sliders[0];

    sliders.forEach((slider) => {
      slider.style.transform = `translateX(${movementSize(slideIndex)})`;
    });
  } else {
    slider = navigationBlock.parentElement.parentElement.querySelector('.navigation__slider');
    slider.style.transform = `translateX(${movementSize(slideIndex)})`;
  }

  const buttonPrev = navigationBlock.querySelector('.navigation__button-prev');
  const buttonNext = navigationBlock.querySelector('.navigation__button-next');
  buttonNext.disabled = false;
  buttonPrev.disabled = false;

  const firstSlideIsVisible = slideIndex === 0;
  if (firstSlideIsVisible && !isSliderLoop) {
    buttonPrev.disabled = true;
  }

  const maxItems = Number(slider.getAttribute('data-slides-number'));
  const numberOfVisible = Number(getComputedStyle(slider).getPropertyValue('--number-of-visible')) || 1;
  const lastSlideIsVisible = slideIndex === maxItems / numberOfVisible - 1;

  if (lastSlideIsVisible && !isSliderLoop) {
    buttonNext.disabled = true;
  }

  navigationBlock.setAttribute('data-slide', slideIndex);
  const isSliderBorder = (slideIndex === -1) || (slideIndex === maxItems / numberOfVisible);
  if (isSliderLoop && isSliderBorder) {
    const incrementt = (slideIndex === maxItems / numberOfVisible) ? 0 : numberOfVisible;
    setTimeout(() => {
      sliders.forEach((slider) => {
        slider.style.transition = '0s';
        if (!incrementt) {
          slider.style.transform = `translateX(${movementSize(incrementt)})`;
        } else {
          // slider.style.transform = `translateX(${movementSize(incrementt)})`;
        }
        setTimeout(() => {
          slider.style.transition = '';
        }, 1);
      });
      slideIndex = incrementt;
      navigationBlock.setAttribute('data-slide', slideIndex);
    }, 500);
  }

  const number = navigationBlock.querySelector('.navigation__number');
  if (number) {
    number.setAttribute('data-slide', slideIndex + 1);
    number.setAttribute('max-slide', maxItems / numberOfVisible);
  }

  const dotItems = slider.parentElement.querySelectorAll('.navigation__dots-item');
  const dotItemActive = slider.parentElement.querySelector('.navigation__dots-item.active');
  if (dotItemActive) {
    dotItemActive.classList.remove('active');
    dotItems[slideIndex].classList.add('active');
  }

  if (slider === document.querySelector('.stages__list')) {
    const movementImage = (index) => (`calc((${wrapperWidth} + ${gap}) * ${index})`);
    const plane = document.querySelector('.stages__image-wrapper');
    plane.style.transform = `translateX(${movementImage(slideIndex)})`;
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

// const disabledButtonPrev = () => {
//   navigationButtonsPrev.forEach((buttonPrev) => {
//     buttonPrev.disabled = true;
//   });
// };

const events = ['resize', 'DOMContentLoaded'];
events.forEach((event) => {
  window.addEventListener(event, resetSlider);
});

window.addEventListener('DOMContentLoaded', () => {
  // disabledButtonPrev();
});

const navigationDots = document.querySelectorAll('.navigation__dots');
navigationDots.forEach((dotList) => {
  const dotItems = dotList.querySelectorAll('.navigation__dots-item');
  dotItems.forEach((dotItem, index) => {
    dotItem.addEventListener('click', () => {
      const navBlock = dotItem.parentElement.parentElement;
      const increment = index - Number(navBlock.getAttribute('data-slide'));

      moveSlide(navBlock, increment);
    });
  });
});

const playersLinks = document.querySelectorAll('.players__item .button');
const playersNavigation = document.querySelector('.players__navigation');
const playersList = document.querySelector('.players__list');
playersLinks.forEach((link, index) => {
  link.addEventListener('focus', () => {
    const itemsInSlide = Number(getComputedStyle(playersList).getPropertyValue('--number-of-visible'));
    const currentSlide = Number(playersNavigation.getAttribute('data-slide'));
    const nextSlide = Math.floor((index) / itemsInSlide);

    const increment = nextSlide - currentSlide;
    moveSlide(playersNavigation, increment);

    const title = document.querySelector('.players__title');
    title.scrollIntoView({ inline: 'end', behavior: 'instant' });
  });
});

const playersListWrapper = document.querySelector('.players__list-wrapper');
playersListWrapper.innerHTML += playersListWrapper.innerHTML + playersListWrapper.innerHTML;
