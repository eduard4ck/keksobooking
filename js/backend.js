(function () {
  let URL = `https://javascript.pages.academy/keksobooking`;
  window.upload = function (onError, data, onLoad) {
    let xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.addEventListener(`load`, function () {
      switch (xhr.status) {
        case 200: onLoad(); break;
        case 400: onError(`400 Неверный запрос`); break;
        case 401: onError(`401 Пользователь не авторизован`); break;
        case 404: onError(`404 Ничего не найдено`); break;
        default: onError(`Неизвестный статус ${xhr.status} ${xhr.statustext}`);
      }
    });

    xhr.addEventListener(`error`, function () {
      onError(`Произошла ошибка соединения`);
    });

    xhr.addEventListener(`timeout`, function () {
      onError(`Запрос не успел выполниться за ${xhr.timeout} мс`);
    });

    xhr.timeout = 1000;
    xhr.open(`POST`, URL);
    xhr.send(data);
  };
}());


(function () {
  let URL = `https://javascript.pages.academy/keksobooking/data`;
  window.download = function (onError, onLoad) {
    let xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.addEventListener(`load`, function () {
      switch (xhr.status) {
        case 200: onLoad(xhr.response); break;
        case 400: onError(`400 Неверный запрос`); break;
        case 401: onError(`401 Пользователь не авторизован`); break;
        case 404: onError(`404 Ничего не найдено`); break;
        default: onError(`Неизвестный статус ${xhr.status} ${xhr.statustext}`);
      }
    });

    xhr.addEventListener(`error`, function () {
      onError(`Произошла ошибка соединения`);
    });

    xhr.addEventListener(`timeout`, function () {
      onError(`Запрос не успел выполниться за ${xhr.timeout} мс`);
    });

    xhr.timeout = 1000;
    xhr.open(`GET`, URL);
    xhr.send();
  };
}());
