window.data = {
  objects: []
};

((quantity, emptyArray) => { // создать рандомные 8 объектов и добавить их все в массив строкой выше

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
    let i = window.getRandomInt(0, titles.length);
    let randomTitle = titles[i];
    titles.splice(i, 1);
    return randomTitle;
  }

  function makeAdresses() {
    let x = window.getRandomInt(0, 100) + (Math.random()).toFixed(5);
    let y = window.getRandomInt(0, 100) + (Math.random()).toFixed(5);
    return (x + ` ` + y);

  }

  function makePrices() {
    let priceInt = window.getRandomInt(100, 10001).toLocaleString(`ru`);
    return priceInt;
  }

  function makeTypes() {
    let houseTypes = [`Квартира`, `Дом`, `Бунгало`];
    return houseTypes[window.getRandomInt(0, houseTypes.length)];
  }

  function makeRooms() {
    return window.getRandomInt(1, 6);
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
    let random = window.getRandomInt(1, facilities.length);

    for (let j = 0; j < random; j++) {
      let eachNumber = window.getRandomInt(0, facilities.length);
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
    let checkinInt = window.getRandomInt(1, times.length);

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
      x: window.getRandomInt(300, 901),
      y: window.getRandomInt(100, 501)
    };
    emptyArray.push(obj);
  }
})(8, window.data.objects);
