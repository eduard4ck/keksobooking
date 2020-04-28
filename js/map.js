const ESC_KEYCODE = 27;
const ENTER_KEYCODE = 13;
const objects = [];

((quantity, emptyArray) => { // создать рандомные 8 объектов и добавить их все в массив строкой выше
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  let titles = [
    `Большая уютная квартира`,
    `Маленькая неуютная квартира`,
    `Огромный прекрасный дворец`,
    `Маленький ужасный дворец`,
    `Красивый гостевой домик`,
    `Некрасивый негостеприимный домик`,
    `Уютное бунгало далеко от моря`,
    `Неуютное бунгало по колено в воде`
  ];

  let times = [`11:00`, `12:00`, `13:00`, `14:00`];

  function getTitle() {
    let i = getRandomInt(0, titles.length);
    let randomTitle = titles[i];
    titles.splice(i, 1);
    return randomTitle;
  }

  function makeAdresses() {
    let x = getRandomInt(0, 100) + (Math.random()).toFixed(5);
    let y = getRandomInt(0, 100) + (Math.random()).toFixed(5);
    return (x + ` ` + y);

  }

  function makePrices() {
    let priceInt = getRandomInt(100, 10001).toLocaleString(`ru`);
    return priceInt;
  }

  function makeTypes() {
    let houseTypes = [`Квартира`, `Дом`, `Бунгало`];
    return houseTypes[getRandomInt(0, houseTypes.length)];
  }

  function makeRooms() {
    return getRandomInt(1, 6);
  }

  function makeFeatures() {
    let facilities = [
      {
        "name": `wifi`,
        "title": `WiFi`
      },
      {
        "name": `dishwasher`,
        "title": `Посудомоечная машина`
      },
      {
        "name": `parking`,
        "title": `Парковка`
      },
      {
        "name": `washer`,
        "title": `Стиральная машина`
      },
      {
        "name": `elevator`,
        "title": `Лифт`
      },
      {
        "name": `conditioner`,
        "title": `Кондиционер`
      }
    ];
    let featuresArr = [];
    let random = getRandomInt(1, facilities.length);

    for (let j = 0; j < random; j++) {
      let eachNumber = getRandomInt(0, facilities.length);
      featuresArr.push(facilities[eachNumber]);
      facilities.splice(eachNumber, 1);
    }
    return featuresArr;
  }

  for (let i = 0; i < quantity; i++) {
    let obj = {};

    obj.author = {
      avatar: `img/avatars/user0${i + 1}.png`
    };

    let roomsExample = makeRooms();
    let checkinInt = getRandomInt(1, times.length);

    obj.offer = {
      title: getTitle(),
      address: makeAdresses(),
      price: makePrices(),
      type: makeTypes(),
      rooms: roomsExample,
      guests: roomsExample * 2,
      checkin: times[checkinInt],
      checkout: times[checkinInt - 1],
      features: makeFeatures(),
      description: ``,
      photos: [],
    };
    obj.location = {
      x: getRandomInt(300, 901),
      y: getRandomInt(100, 501)
    };
    emptyArray.push(obj);
  }
})(8, objects);


let mapSection = document.querySelector(`.map`);
let pinList = mapSection.querySelector(`.map__pins`);
let template = document.querySelector(`template`).content;

function addRandomPins() { // добавить рандомные метки на карту
  let pinTemplate = template.querySelector(`.map__pin`);
  let fragment = document.createDocumentFragment();
  for (let i = 0; i < objects.length; i++) {
    let newPin = pinTemplate.cloneNode(true);
    newPin.style.left = `${objects[i].location.x}px`;
    newPin.style.top = `${objects[i].location.y}px`;
    newPin.querySelector(`img`).src = objects[i].author.avatar;
    fragment.appendChild(newPin);
  }
  pinList.appendChild(fragment);
}

function addLeftPopup(somePin, isRewrite) { // добавить объявление (попап) слева на карте и слушатели на закрытие
  let popup = mapSection.querySelector(`.popup`);

  if (!isRewrite) {
    let popupTemplate = template.querySelector(`.popup`);
    popup = popupTemplate.cloneNode(true);
  }

  popup.querySelector(`h3`).textContent = somePin.offer.title;
  popup.querySelector(`p:nth-of-type(1)`).querySelector(`small`).textContent = somePin.offer.address;
  popup.querySelector(`.popup__price`).innerHTML = somePin.offer.price + `&#x20bd;/ночь`;
  popup.querySelector(`h4`).textContent = somePin.offer.type;
  popup.querySelector(`p:nth-of-type(3)`).textContent = `${somePin.offer.rooms} комнаты для ${somePin.offer.guests} гостей`;
  popup.querySelector(`p:nth-of-type(4)`).textContent = `Заезд после ${somePin.offer.checkin}, выезд до ${somePin.offer.checkout}`;
  // popup.querySelector('p:nth-of-type(5)').textContent = somePin.offer.description;
  popup.querySelector(`img`).src = somePin.author.avatar;

  let popupFeatures = popup.querySelector(`.popup__features`);
  popupFeatures.innerHTML = ``;

  for (let i = 0; i < somePin.offer.features.length; i++) {
    let li = document.createElement(`li`);
    let liClass = `feature--` + somePin.offer.features[i].name;
    li.classList.add(`feature`, liClass);
    li.setAttribute(`title`, somePin.offer.features[i].title);
    popupFeatures.appendChild(li);
  }
  // eslint-disable-next-line no-unused-expressions
  !isRewrite ? mapSection.appendChild(popup) : false;

  function onCloseButtonClick() {
    popup.remove();
    currentPinActive.classList.remove(`map__pin--active`);
    closeButton.removeEventListener(`click`, onCloseButtonClick);
    document.removeEventListener(`keydown`, onPopupEscPress);
    closeButton.removeEventListener(`keydown`, onEnterPress);
  }
  function onPopupEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      onCloseButtonClick();
    }
  }
  function onEnterPress(evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      onCloseButtonClick();
    }
  }
  let closeButton = popup.querySelector(`.popup__close`);
  closeButton.addEventListener(`click`, onCloseButtonClick);
  document.addEventListener(`keydown`, onPopupEscPress);
  closeButton.addEventListener(`keydown`, onEnterPress);
}


// слушатели на метки
let noticeForm = document.querySelector(`.notice__form`);
let formSections = noticeForm.querySelectorAll(`fieldset`);
formSections.forEach((fieldset) => { // сначала добавил disabled потом убираем по событию
  fieldset.disabled = true;
});
let mainPinButton = mapSection.querySelector(`.map__pin--main`);
mainPinButton.addEventListener(`mouseover`, onMainPinMouseover);

let currentPinActive = null;
pinList.addEventListener(`click`, onRandomPinClick);


function onMainPinMouseover() { // убираем затемнение с карты, артибуты disabled, ставим слушатели на Enter
  mapSection.classList.remove(`map--faded`);
  noticeForm.classList.remove(`notice__form--disabled`);
  formSections.forEach((fieldset) => {
    fieldset.disabled = false;
  });
  addRandomPins();
  mainPinButton.removeEventListener(`mouseover`, onMainPinMouseover);

  for (let i = 0; i < pinList.children.length; i++) {
    pinList.children[i].addEventListener(`keydown`, onRandomPinClick);
  }
}

function onRandomPinClick(evt) { // при клике на метку, узнаем есть ли предыдущий попап
  let target = evt.keyCode === ENTER_KEYCODE ? evt.target : evt.target.parentNode;

  if (target.classList.contains(`map__pin`) && !target.classList.contains(`map__pin--main`)) {

    if (currentPinActive) {
      currentPinActive.classList.remove(`map__pin--active`);
    }
    currentPinActive = evt.target.parentNode;
    evt.target.parentNode.classList.add(`map__pin--active`);

    let imgSrc = !(evt.keyCode === ENTER_KEYCODE) ? evt.target.src : evt.target.querySelector(`img`).src;
    imgSrc = imgSrc.substring(imgSrc.indexOf(`img/avatars/`));
    let isRewrite = false;

    for (let i = 0; i < mapSection.children.length; i++) {
      if (mapSection.children[i].classList.contains(`popup`)) {
        isRewrite = true;
      }
    }

    for (let i = 0; i < objects.length; i++) {
      if (objects[i].author.avatar.match(imgSrc)) {
        addLeftPopup(objects[i], isRewrite);
        break;
      }
    }
  }
}


// Валидация формы

let formTitle = noticeForm.querySelector(`.form__element #title`);
let formAddress = noticeForm.querySelector(`.form__element #address`);
let formTypes = noticeForm.querySelector(`.form__element #type`);
let formPricePerNight = noticeForm.querySelector(`.form__element #price`);
let formTimein = noticeForm.querySelector(`.form__element #timein`);
let formTimeout = noticeForm.querySelector(`.form__element #timeout`);
let formRoomsNumber = noticeForm.querySelector(`.form__element #room_number`);
let formGuests = noticeForm.querySelector(`.form__element #capacity`);

(function () {
  formTitle.minLength = `30`;
  formTitle.maxLength = `100`;
  formAddress.required = true;
  formAddress.readOnly = true;

  formTitle.addEventListener(`focus`, onFormValidation);
  formTitle.addEventListener(`blur`, onFormValidation);
  formPricePerNight.addEventListener(`focus`, onFormValidation);
  formPricePerNight.addEventListener(`blur`, onFormValidation);

  function onFormValidation(evt) {
    switch (evt.type) {
      case `focus`: evt.target.value.length > 0 ? evt.target.required = true : false; break;
      case `blur`: evt.target.value.length == 0 ? evt.target.required = false : false; break;
      case `mousedown`:
        formTitle.required = true;
        formPricePerNight.required = true;
    }
  }


  formPricePerNight.min = `1000`;
  formPricePerNight.max = `1000000`;
  formTypes.addEventListener(`change`, checkTypes);
  function checkTypes() {
    for (let i = 0; i < formTypes.children.length; i++) {
      if (formTypes[i].selected) {
        if (formTypes.children[i].textContent.match(`Лачуга`)) {
          formPricePerNight.min = `0`;
        } else if (formTypes.children[i].textContent.match(`Квартира`)) {
          formPricePerNight.min = `1000`;
        } else if (formTypes.children[i].textContent.match(`Дом`)) {
          formPricePerNight.min = `5000`;
        } else if (formTypes.children[i].textContent.match(`Дворец`)) {
          formPricePerNight.min = `10000`;
        }
      }
    }
  }

  let formTimeinChildren = formTimein.children;
  let formTimeoutChildren = formTimeout.children;
  formTimein.addEventListener(`change`, syncTime);
  formTimeout.addEventListener(`change`, syncTime);
  function syncTime(evt) {

    if (evt.target === formTimein) {
      toSync(formTimeinChildren, formTimeoutChildren);
    } else if (evt.target === formTimeout) {
      toSync(formTimeoutChildren, formTimeinChildren);
    }

    function toSync(childrens, anotherChilds) {
      for (let i = 0; i < childrens.length; i++) {
        if (childrens[i].selected) {
          anotherChilds[i].selected = true;
          break;
        }
      }
    }
  }

  syncGuests();
  formRoomsNumber.addEventListener(`change`, syncGuests);
  function syncGuests() { // синхронизируем количество комнат и гостей
    formGuests.innerHTML = `
  <option value="3">для 3 гостей</option>
  <option value="2">для 2 гостей</option>
  <option value="1">для 1 гостя</option>
  <option value="0">не для гостей</option>
  `;

    for (let i = 0; i < formRoomsNumber.children.length; i++) {
      if (formRoomsNumber.children[i].selected) {
        switch (formRoomsNumber.children[i].textContent) {
          case `1 комната`: deleteOtherGuestsExcept(`для 1 гостя`); break;
          case `2 комнаты`: deleteOtherGuestsExcept(`для 1 гостя`, `для 2 гостей`); break;
          case `3 комнаты`: deleteOtherGuestsExcept(`для 1 гостя`, `для 2 гостей`, `для 3 гостей`); break;
          case `100 комнат`: deleteOtherGuestsExcept(`не для гостей`); break;
        }
        break;
      }
    }

    function deleteOtherGuestsExcept(except1, except2, except3) {
      for (let i = 0; i < formGuests.children.length; i++) {
        let currentGuest = formGuests.children[i].textContent;
        if (currentGuest !== except1 && currentGuest !== except2 && currentGuest !== except3) {
          formGuests.children[i].remove();
          i--;
        }
      }

      formGuests.children[0].selected = true;
    }
  }

  noticeForm.querySelector(`.form__submit`).addEventListener(`mousedown`, onFormValidation);

}());
