(function () {

  let valueToBoolean = {
    'flat': (pin) => pin.offer.type === `flat`,
    'house': (pin) => pin.offer.type === `house`,
    'bungalo': (pin) => pin.offer.type === `bungalo`,
    'middle': (pin) => pin.offer.price >= 10000 && pin.offer.price <= 50000,
    'low': (pin) => pin.offer.price < 10000,
    'high': (pin) => pin.offer.price > 50000,
    '1r': (pin) => pin.offer.rooms === 1,
    '2r': (pin) => pin.offer.rooms === 2,
    '3r': (pin) => pin.offer.rooms === 3,
    '1g': (pin) => pin.offer.guests === 1,
    '2g': (pin) => pin.offer.guests === 2,
    'wifi': (pin) => pin.offer.features.some((fea) => fea === `wifi`),
    'dishwasher': (pin) => pin.offer.features.some((fea) => fea === `dishwasher`),
    'parking': (pin) => pin.offer.features.some((fea) => fea === `parking`),
    'washer': (pin) => pin.offer.features.some((fea) => fea === `washer`),
    'elevator': (pin) => pin.offer.features.some((fea) => fea === `elevator`),
    'conditioner': (pin) => pin.offer.features.some((fea) => fea === `conditioner`),
    'any': () => true,
  };

  function sortPins() {
    let f = { // filter values
      type: this.children[0].children[0].selectedOptions[0].value,
      price: this.children[0].children[1].selectedOptions[0].value,
      rooms: this.children[0].children[2].selectedOptions[0].value,
      guests: this.children[0].children[3].selectedOptions[0].value,
      wifi: this.children[0].children[4].children[0].checked ? `wifi` : `any`,
      dishwasher: this.children[0].children[4].children[2].checked ? `dishwasher` : `any`,
      parking: this.children[0].children[4].children[4].checked ? `parking` : `any`,
      washer: this.children[0].children[4].children[6].checked ? `washer` : `any`,
      elevator: this.children[0].children[4].children[8].checked ? `elevator` : `any`,
      conditioner: this.children[0].children[4].children[10].checked ? `conditioner` : `any`
    };

    let allowedPins = window.data.loadedPins.slice().filter((pin) => {
      return [ // отдает список нужных пинов
        valueToBoolean[f.type](pin),
        valueToBoolean[f.price](pin),
        valueToBoolean[f.rooms](pin),
        valueToBoolean[f.guests](pin),
        valueToBoolean[f.wifi](pin),
        valueToBoolean[f.dishwasher](pin),
        valueToBoolean[f.parking](pin),
        valueToBoolean[f.washer](pin),
        valueToBoolean[f.elevator](pin),
        valueToBoolean[f.conditioner](pin)
      ].every((boolean)=> boolean);
    });
    return allowedPins;
  }

  function onChangeFilter() {
    /*
    * Получаем список отсортированных пинов. Проходимся в цикле по списку всех пинов на карте,
    * тем пинам которых нет в списке отсортированных добавляем класс hidden.
    * Потом смотрим, если есть попап, но его пин исчез, то удаляем попап, иначе - оставляем.
    */
    let allowedPins = sortPins.call(this);
    for (let i = 0; i < window.map.pinList.children.length; i++) {
      let child = window.map.pinList.children[i];
      child.classList.remove(`hidden`);
      if (child.classList.contains(`map__pin`) && !child.classList.contains(`map__pin--main`)) {
        let isCoincidence = allowedPins.some((pin) => child.backendName === pin.offer.title);
        !isCoincidence ? child.classList.add(`hidden`) : false;
      }
    }

    let popup = document.querySelector(`.popup`);
    if (popup) {
      let some = allowedPins.some((pin)=> popup.children[2].textContent === pin.offer.title);
      !some ? popup.remove() : false;
    }
  }

  function debounce(cb, delay = 500) {
    let prevTimer;
    return function () {
      let self = this;
      clearTimeout(prevTimer);
      prevTimer = setTimeout(() => {
        cb.call(self);
      }, delay);
    };
  }


  /*
  * Слушатель на изменения фильтров, делает сортировку нужных пинов
  */
  window.map.filterContainer.addEventListener(`change`, debounce(onChangeFilter, 700));

}());

