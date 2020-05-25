window.pin = {
  loadPinsOnMap(pins) { // добавить метки на карту закачанные через xhr
    let pinTemplate = window.map.template.querySelector(`.map__pin`);
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < pins.length; i++) {
      let newPin = pinTemplate.cloneNode(true);
      newPin.style.left = `${pins[i].location.x}px`;
      newPin.style.top = `${pins[i].location.y}px`;
      newPin.backendName = pins[i].offer.title;
      newPin.querySelector(`img`).src = pins[i].author.avatar;
      fragment.appendChild(newPin);
    }
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
    let target = evt.keyCode === window.ENTER_KEYCODE ? evt.target : evt.target.parentNode;

    if (target.classList.contains(`map__pin`) && !target.classList.contains(`map__pin--main`)) {

      if (window.map.currentPinActive) {
        window.map.currentPinActive.classList.remove(`map__pin--active`);
      }
      window.map.currentPinActive = target;
      target.classList.add(`map__pin--active`);

      let backendName = !(evt.keyCode === window.ENTER_KEYCODE)
        ? evt.target.parentNode.backendName
        : evt.backendName;

      let isRewrite = false;

      let lastChildClassList = window.map.mapSection.lastChild.classList;
      if (lastChildClassList && lastChildClassList.contains(`popup`)) {
        isRewrite = true;
      }

      for (let i = 0; i < window.data.loadedPins.length; i++) {
        if (window.data.loadedPins[i].offer.title.match(backendName)) {
          window.showCard(window.data.loadedPins[i], isRewrite);
          break;
        }
      }
    }
  }
};

(function () { // скачать пины через xhr
  let successXhrHandler = (pins) => window.data.loadedPins = pins;
  window.download(window.pin.errorHandler, successXhrHandler);
}());
