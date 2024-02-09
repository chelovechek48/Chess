const sliderGap = 'var(--gap)';
const wrapperPadding = '20px';
const wrapperMaxWidth = '1150px';
const wrapperWidth = `min(calc(100vw - ${wrapperPadding} * 2), ${wrapperMaxWidth})`;
const movementPerSwipe = (slideIndex, visibleSlides) => (
  `translateX(calc(0px - (${wrapperWidth} + ${sliderGap}) * ${slideIndex} / ${visibleSlides}))`
);
const moveSlide = (navigationBlock, increment) => {
  let slideIndex = Number(navigationBlock.getAttribute('data-slide'));
  slideIndex += increment;

  const isLoopSlider = Boolean(navigationBlock.getAttribute('data-slider-loop'));
  if (isLoopSlider) {
    const sliderCopies = navigationBlock.parentElement.querySelectorAll('.navigation__slider');
    const slider = sliderCopies[0];
    const visibleSlidesCount = Number(getComputedStyle(slider).getPropertyValue('--number-of-visible')) || 1;

    const replaceCopyToOriginal = (newSlideIndex) => {
      for (let i = 0; i < sliderCopies.length; i += 1) {
        sliderCopies[i].style.transform = movementPerSwipe(slideIndex, visibleSlidesCount);
        setTimeout(() => {
          sliderCopies[i].style.transition = '0s';
          sliderCopies[i].style.transform = movementPerSwipe(newSlideIndex, visibleSlidesCount);
          setTimeout(() => {
            sliderCopies[i].style.transition = '0.5s';
          }, 100);
        }, 500);
      }

      const sliderNavButtons = navigationBlock.querySelectorAll('.navigation__button');
      for (let i = 0; i < sliderNavButtons.length; i += 1) {
        sliderNavButtons[i].style.pointerEvents = 'none';
        setTimeout(() => {
          sliderNavButtons[i].style.pointerEvents = '';
        }, 600);
      }

      slideIndex = newSlideIndex;
    };

    const maxSlidesCount = Number(slider.getAttribute('data-slides-number'));
    const isFirstSlide = slideIndex === (0 - visibleSlidesCount);
    const isLastSlide = slideIndex === maxSlidesCount;

    if (isFirstSlide) {
      const newSlideIndex = (maxSlidesCount - visibleSlidesCount);
      replaceCopyToOriginal(newSlideIndex);
    } else if (isLastSlide) {
      const newSlideIndex = 0;
      replaceCopyToOriginal(newSlideIndex);
    } else {
      for (let i = 0; i < sliderCopies.length; i += 1) {
        sliderCopies[i].style.transform = movementPerSwipe(slideIndex, visibleSlidesCount);
      }
    }

    const number = navigationBlock.querySelector('.navigation__number');
    if (number) {
      const slide = ((slideIndex + maxSlidesCount) % maxSlidesCount) + 1;
      number.setAttribute('data-slide', slide);
      number.setAttribute('max-slide', maxSlidesCount);
    }
  } else {
    const slider = navigationBlock.parentElement.querySelector('.navigation__slider');
    const visibleSlidesCount = Number(getComputedStyle(slider).getPropertyValue('--number-of-visible')) || 1;
    const maxSlidesCount = Number(slider.getAttribute('data-slides-number'));
    const isFirstSlide = slideIndex === 0;
    const isLastSlide = slideIndex === maxSlidesCount - 1;

    slider.style.transform = movementPerSwipe(slideIndex, visibleSlidesCount);

    const navigationButtonPrev = slider.parentElement.querySelector('.navigation__button-prev');
    const navigationButtonNext = slider.parentElement.querySelector('.navigation__button-next');

    if (isFirstSlide) {
      navigationButtonPrev.disabled = true;
    } else {
      navigationButtonPrev.disabled = false;
    }

    if (isLastSlide) {
      navigationButtonNext.disabled = true;
    } else {
      navigationButtonNext.disabled = false;
    }
  }

  const hasDots = navigationBlock.querySelector('.navigation__dots');
  if (hasDots) {
    const dotItems = navigationBlock.querySelectorAll('.navigation__dots-item');
    const dotItemActive = navigationBlock.querySelector('.navigation__dots-item.active');
    if (dotItemActive) {
      dotItemActive.classList.remove('active');
      dotItems[slideIndex].classList.add('active');
    }
  }

  navigationBlock.setAttribute('data-slide', slideIndex);

  const isStage = Boolean(navigationBlock.parentElement.querySelector('.stages__list'));
  if (isStage) {
    const movementImage = (index) => (`calc((${wrapperWidth} + ${sliderGap}) * ${index})`);
    const image = document.querySelector('.stages__image-wrapper');
    image.style.transform = `translateX(${movementImage(slideIndex)})`;
  }
};

const loopSliders = document.querySelectorAll('[data-slider-loop="true"]');
loopSliders.forEach((navigation) => {
  const slider = navigation.parentElement.querySelector('.navigation__slider');
  const sliderWrapper = navigation.parentElement.querySelector('.navigation__slider-wrapper');
  const sliderInner = slider.outerHTML;
  sliderWrapper.innerHTML += (sliderInner + sliderInner);
});

const playersSlider = document.querySelector('.players__navigation');
const playerInterval = setInterval(() => {
  moveSlide(playersSlider, 1);
}, 2500);

const navigationButtons = document.querySelectorAll('.navigation__button');
for (let i = 0; i < navigationButtons.length; i += 1) {
  navigationButtons[i].addEventListener('click', () => {
    clearInterval(playerInterval);
    const direction = Number(navigationButtons[i].getAttribute('data-increment'));
    const navigationBlock = navigationButtons[i].parentElement;
    moveSlide(navigationBlock, direction);
  });

  const hasDisabled = Boolean(navigationButtons[i].getAttribute('data-disabled'));
  if (hasDisabled) {
    navigationButtons[i].disabled = true;
  }
}

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

const events = ['resize', 'DOMContentLoaded'];
events.forEach((event) => {
  window.addEventListener(event, () => {
    const navigationBlock = document.querySelectorAll('.navigation');
    for (let i = 0; i < navigationBlock.length; i += 1) {
      moveSlide(navigationBlock[i], 0);
    }
  });
});

const playersLinks = document.querySelectorAll('.players__item .button');
const playersNavigation = document.querySelector('.players__navigation');
for (let index = 0; index < playersLinks.length; index += 1) {
  playersLinks[index].addEventListener('focus', () => {
    clearInterval(playerInterval);

    const currentSlide = Number(playersNavigation.getAttribute('data-slide'));
    const increment = (index - currentSlide);
    moveSlide(playersNavigation, increment);

    const wrapper = document.querySelector('.players__list-wrapper');
    wrapper.scrollIntoView({ inline: 'end', behavior: 'instant' });

    const trueSlideIndex = (6 + index) % 6;
    const trueSlideLink = playersLinks[trueSlideIndex];
    trueSlideLink.focus();
  });
}
