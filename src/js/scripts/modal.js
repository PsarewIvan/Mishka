'use strict';

(function () {
  let modalLinks = document.querySelectorAll('.js-modal');
  let overlay = document.querySelector('.modal-overlay');
  let modal = document.querySelector('.modal-order');

  function toggleElements(...elements) {
    elements.forEach((el) => {
      el.classList.toggle('display-none');
    });
  }

  [].forEach.call(modalLinks, element => {
    element.addEventListener('click', (evt) => {
      evt.preventDefault();
      toggleElements(modal, overlay);
    })
  });

  overlay.addEventListener('click', () => {
    toggleElements(modal, overlay);
  });

  window.addEventListener('keydown', (evt) => {
    if (evt.keyCode === 27 && !modal.classList.contains('display-none')) {
      evt.preventDefault();
      toggleElements(modal, overlay);
    }
  });
})()