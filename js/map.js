const objects = [];

((quantity, emptyArray) => {
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
    let x = getRandomInt(0, 100) + +(Math.random()).toFixed(5);
    let y = getRandomInt(0, 100) + +(Math.random()).toFixed(5);
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
    let facilities = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
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
mapSection.classList.remove(`map--faded`);

let pinList = mapSection.querySelector(`.map__pins`);
let template = document.querySelector(`template`).content;

// добавить рандомные метки на карту
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

// добавить объявление слева на карте
let advertTemplate = template.querySelector(`.map__card`);
let firstAdvert = advertTemplate.cloneNode(true);
firstAdvert.querySelector(`h3`).textContent = objects[0].offer.title;
firstAdvert.querySelector(`p:nth-of-type(1)`).querySelector(`small`).textContent = objects[0].offer.address;
firstAdvert.querySelector(`.popup__price`).innerHTML = objects[0].offer.price + `&#x20bd;/ночь`;
firstAdvert.querySelector(`h4`).textContent = objects[0].offer.type;
firstAdvert.querySelector(`p:nth-of-type(3)`).textContent = `${objects[0].offer.rooms} комнаты для ${objects[0].offer.guests} гостей`;
firstAdvert.querySelector(`p:nth-of-type(4)`).textContent = `Заезд после ${objects[0].offer.checkin}, выезд до ${objects[0].offer.checkout}`;
// firstAdvert.querySelector('p:nth-of-type(5)').textContent = objects[0].offer.description;
firstAdvert.querySelector(`img`).src = objects[0].author.avatar;

let popupFeatures = firstAdvert.querySelector(`.popup__features`);
popupFeatures.innerHTML = ``;

for (let i = 0; i < objects[0].offer.features.length; i++) {
  let li = document.createElement(`li`);
  let liClass = `feature--` + objects[0].offer.features[i];
  li.classList.add(`feature`, liClass);
  popupFeatures.appendChild(li);
}
mapSection.appendChild(firstAdvert)
;
