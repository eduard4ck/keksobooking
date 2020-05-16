window.pin = {
  addRandomPins() { // добавить рандомные метки на карту
    let pinTemplate = window.map.template.querySelector(`.map__pin`);
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < window.data.objects.length; i++) {
      let newPin = pinTemplate.cloneNode(true);
      newPin.style.left = `${window.data.objects[i].location.x}px`;
      newPin.style.top = `${window.data.objects[i].location.y}px`;
      newPin.querySelector(`img`).src = window.data.objects[i].author.avatar;
      fragment.appendChild(newPin);
    }
    window.map.pinList.appendChild(fragment);
  },

  onRandomPinClick(evt) { // при клике на метку, узнаем есть ли предыдущий попап
    let target = evt.keyCode === window.ENTER_KEYCODE ? evt.target : evt.target.parentNode;

    if (target.classList.contains(`map__pin`) && !target.classList.contains(`map__pin--main`)) {

      if (window.pin.currentPinActive) {
        window.pin.currentPinActive.classList.remove(`map__pin--active`);
      }
      window.pin.currentPinActive = evt.target.parentNode;
      evt.target.parentNode.classList.add(`map__pin--active`);

      let imgSrc = !(evt.keyCode === window.ENTER_KEYCODE) ? evt.target.src : evt.target.querySelector(`img`).src;
      imgSrc = imgSrc.substring(imgSrc.indexOf(`img/avatars/`));
      let isRewrite = false;

      for (let i = 0; i < window.map.mapSection.children.length; i++) {
        if (window.map.mapSection.children[i].classList.contains(`popup`)) {
          isRewrite = true;
        }
      }

      for (let i = 0; i < window.data.objects.length; i++) {
        if (window.data.objects[i].author.avatar.match(imgSrc)) {
          window.addLeftPopup(window.data.objects[i], isRewrite);
          break;
        }
      }
    }
  }
};
