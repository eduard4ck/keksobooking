window.ESC_KEYCODE = 27;
window.ENTER_KEYCODE = 13;


(function () {
  window.map = {
    mapSection: document.querySelector(`.map`),
    pinList: document.querySelector(`.map .map__pins`),
    template: document.querySelector(`template`).content,
    noticeForm: document.querySelector(`.notice__form`),
    currentPinActive: null
  };


  let mainPinButton = window.map.mapSection.querySelector(`.map__pin--main`);
  mainPinButton.addEventListener(`mouseover`, onMainPinMouseover);
  // сначала добавляю disabled потом убираем по событию
  let formSections = window.map.noticeForm.querySelectorAll(`fieldset`);
  formSections.forEach((fieldset) => fieldset.disabled = true);

  function onMainPinMouseover() { // убираем затемнение с карты, артибуты disabled, ставим слушатели на Enter
    window.map.mapSection.classList.remove(`map--faded`);
    window.map.noticeForm.classList.remove(`notice__form--disabled`);
    formSections.forEach((fieldset) => fieldset.disabled = false);

    window.pin.loadPinsOnMap(window.data.loadedPins); // Ставим скаченные пины на карту

    mainPinButton.removeEventListener(`mouseover`, onMainPinMouseover);
    window.map.pinList.addEventListener(`click`, window.pin.onRandomPinClick);
    for (let i = 0; i < window.map.pinList.children.length; i++) {
      window.map.pinList.children[i].addEventListener(`keydown`, window.pin.onRandomPinClick);
    }
  }

  // перемещение главного пина по карте (drag)
  mainPinButton.addEventListener(`mousedown`, function (evt) {
    let formAddress = window.map.noticeForm.querySelector(`.form__element #address`);
    let mapaCoords = window.map.mapSection.getBoundingClientRect();
    let mainPinCoords = mainPinButton.getBoundingClientRect();
    let cornerH = 16.5;

    let shift = { // смещение курсора относительно центра пина, когда хватаешь main pin
      x: (mainPinCoords.x + mainPinCoords.width / 2) - evt.clientX,
      y: (mainPinCoords.y + mainPinCoords.height / 2) - evt.clientY
    };

    formAddress.value = `X: ${Math.floor(evt.clientX - mapaCoords.x + shift.x)}   
        Y: ${Math.floor(evt.clientY - mapaCoords.y + shift.y + mainPinCoords.height / 2 + cornerH)}`;

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      mainPinButton.style.left = moveEvt.clientX - mapaCoords.x + shift.x + `px`;
      mainPinButton.style.top = moveEvt.clientY - mapaCoords.y + shift.y + `px`;

      // ограничить вылезания за края карты
      if ((moveEvt.clientX - mapaCoords.x + shift.x) <= 0) {
        mainPinButton.style.left = 0;
      }

      if ((moveEvt.clientX - mapaCoords.x + shift.x) >= mapaCoords.width) {
        mainPinButton.style.left = mapaCoords.width + `px`;
      }

      if ((moveEvt.clientY - mapaCoords.y + shift.y) <= mainPinCoords.height / 2 + cornerH) {
        // ставим высоту как от центра пина, к концу острого уголка
        mainPinButton.style.top = mainPinCoords.height / 2 + cornerH + `px`;
      }

      if ((moveEvt.clientY - mapaCoords.y + shift.y + (mainPinCoords.height / 2 + cornerH)) >= mapaCoords.height) {
        mainPinButton.style.top = mapaCoords.height - (mainPinCoords.height / 2 + cornerH) + `px`;
      }

      // вывести адрес по двум осям в поле формы
      let pinX = mainPinButton.style.left.substr(0, mainPinButton.style.left.length - 2);
      let pinY = +mainPinButton.style.top.substr(0, mainPinButton.style.top.length - 2);
      formAddress.value = `X: ${pinX}           Y: ${Math.floor(pinY + mainPinCoords.height / 2 + cornerH)}`;
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);
    }

    document.addEventListener(`mousemove`, onMouseMove);
    document.addEventListener(`mouseup`, onMouseUp);
  });

}());

