// Валидация формы
(function () {

  let formTitle = window.map.noticeForm.querySelector(`.form__element #title`);
  let formAddress = window.map.noticeForm.querySelector(`.form__element #address`);
  let formTypes = window.map.noticeForm.querySelector(`.form__element #type`);
  let formPricePerNight = window.map.noticeForm.querySelector(`.form__element #price`);
  let formTimein = window.map.noticeForm.querySelector(`.form__element #timein`);
  let formTimeout = window.map.noticeForm.querySelector(`.form__element #timeout`);
  let formRoomsNumber = window.map.noticeForm.querySelector(`.form__element #room_number`);
  let formGuests = window.map.noticeForm.querySelector(`.form__element #capacity`);

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

  window.map.noticeForm.querySelector(`.form__submit`).addEventListener(`mousedown`, onFormValidation);

}());
