'use strict';

(function () {
  if (document.querySelector('#ymap')) {
    let init = function () {
      let myMap = new ymaps.Map('ymap', {
        center: [59.938631, 30.3230554],
        zoom: 17
      });

      let placemark = new ymaps.Placemark([59.938631, 30.3230554], {
        balloonContentHeader: 'Mishka',
        balloonContentBody: 'ул. Большая <br>Конюшенная, д. 19/8 <br>Санкт-Петербург',
        hintContent: 'Мы находимся здесь'
      }, {
        iconLayout: 'default#image',
        iconImageHref: 'img/icon/icon-map-pin.svg',
        iconImageSize: [70, 95],
        iconImageOffset: [-37, -101]
      });

      myMap.geoObjects.add(placemark);
      myMap.behaviors.disable(['scrollZoom']);
    }
    ymaps.ready(init);
  }
})()
