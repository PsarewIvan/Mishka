'use strict';
{
  const comments = document.querySelectorAll('.reviews__li');

  function toggleHide(item) {
    item.classList.toggle('display-none');
  }

  function hideSpareComment(array) {
    for(let i = 1; i < array.length; i++) {
      toggleHide(array[i]);
    }
  }

  hideSpareComment(comments);
}
