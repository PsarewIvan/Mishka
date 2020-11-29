'use strict';

(function () {
  const mainNav = document.querySelector('.js--main-nav');
  const mainNavButton = document.querySelector('.js--main-header__nav-btn');

  if (matchMedia) {
    let mqNav = window.matchMedia('(min-width: 768px)');
    mqNav.addListener(WidthChangeNav);
    WidthChangeNav(mqNav);
  }

  mainNavButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    mainNav.classList.toggle('display-none');
    mainNavButton.classList.toggle('main-header__nav-btn--close');
  });

  function WidthChangeNav(mq) {
    if (!mq.matches) {
      mainNav.classList.add('display-none');
      mainNavButton.classList.remove('display-none');
      mainNavButton.classList.remove('main-header__nav-btn--close');
    } else {
      mainNav.classList.remove('display-none');
      mainNavButton.classList.add('display-none');
    }
  }
})()