window.pin = {
  loadPinsOnMap(pins) { // добавить метки на карту закачанные через xhr
    let pinTemplate = window.map.template.querySelector(`.map__pin`);
    let fragment = document.createDocumentFragment();
    pins.forEach((pin) => {
      let newPin = pinTemplate.cloneNode(true);
      newPin.style.left = `${pin.location.x}px`;
      newPin.style.top = `${pin.location.y}px`;
      newPin.backendName = pin.offer.title;
      newPin.querySelector(`img`).src = pin.author.avatar;
      fragment.appendChild(newPin);
    });
    window.map.pinList.appendChild(fragment);
  },

  errorHandler(errMessage) { // cb на ошибку при xhr
    let errDiv = document.createElement(`div`);
    errDiv.style.height = `100 px`;
    errDiv.style.width = `100%`;
    errDiv.style.backgroundColor = `tomato`;
    errDiv.style.textAlign = `center`;
    errDiv.style.position = `absolute`;
    errDiv.style.left = 0;
    errDiv.style.top = 0;
    errDiv.textContent = errMessage;
    document.body.appendChild(errDiv);
  },

  onRandomPinClick(evt) { // при клике на метку, узнаем есть ли предыдущий попап
    let target = evt.keyCode === Keyboard.ENTER_KEYCODE ? evt.target : evt.target.parentNode;

    if (target.classList.contains(`map__pin`) && !target.classList.contains(`map__pin--main`)) {

      if (window.map.currentPinActive) {
        window.map.currentPinActive.classList.remove(`map__pin--active`);
      }
      window.map.currentPinActive = target;
      target.classList.add(`map__pin--active`);

      let backendName = target.backendName;
      let activePin = window.data.loadedPins.find((pin) => pin.offer.title.match(backendName));
      window.showCard(activePin);
    }
  }
};

(function () { // скачать пины через xhr
  let successXhrHandler = (pins) => window.data.loadedPins = pins;
  window.download(window.pin.errorHandler, successXhrHandler);
}());
