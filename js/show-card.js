window.showCard = function (somePin, isRewrite) { // добавить попап слева на карте и слушатели на закрытие
  let popup = window.map.mapSection.querySelector(`.popup`);

  if (!isRewrite) {
    popup = window.map.template.querySelector(`.popup`).cloneNode(true);
  }

  popup.querySelector(`h3`).textContent = somePin.offer.title;
  popup.querySelector(`p:nth-of-type(1)`).querySelector(`small`).textContent = somePin.offer.address;
  popup.querySelector(`.popup__price`).innerHTML = somePin.offer.price + `&#x20bd;/ночь`;
  popup.querySelector(`h4`).textContent = somePin.offer.type;
  popup.querySelector(`p:nth-of-type(3)`).textContent = `${somePin.offer.rooms} комнаты для ${somePin.offer.guests} гостей`;
  popup.querySelector(`p:nth-of-type(4)`).textContent = `Заезд после ${somePin.offer.checkin}, выезд до ${somePin.offer.checkout}`;
  popup.querySelector(`p:nth-of-type(5)`).textContent = somePin.offer.description;
  popup.querySelector(`img`).src = somePin.author.avatar;

  let popupFeatures = popup.querySelector(`.popup__features`);
  popupFeatures.innerHTML = ``;

  for (let i = 0; i < somePin.offer.features.length; i++) {
    let li = document.createElement(`li`);
    let liClass = `feature--` + somePin.offer.features[i];
    li.classList.add(`feature`, liClass);
    // li.setAttribute(`title`, somePin.offer.features[i].title);
    popupFeatures.appendChild(li);
  }
  // eslint-disable-next-line no-unused-expressions
  !isRewrite ? window.map.mapSection.appendChild(popup) : false;

  let closeButton = popup.querySelector(`.popup__close`);
  closeButton.addEventListener(`click`, onCloseButtonClick);
  document.addEventListener(`keydown`, onPopupEscPress);
  closeButton.addEventListener(`keydown`, onEnterPress);

  function onCloseButtonClick() {
    popup.remove();
    window.map.currentPinActive.classList.remove(`map__pin--active`);
    closeButton.removeEventListener(`click`, onCloseButtonClick);
    document.removeEventListener(`keydown`, onPopupEscPress);
    closeButton.removeEventListener(`keydown`, onEnterPress);
  }
  function onPopupEscPress(evt) {
    if (evt.keyCode === window.ESC_KEYCODE) {
      onCloseButtonClick();
    }
  }
  function onEnterPress(evt) {
    if (evt.keyCode === window.ENTER_KEYCODE) {
      onCloseButtonClick();
    }
  }
};
