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
  let formDescription = window.map.noticeForm.querySelector(`.form__element #description`);
  let submitButton = window.map.noticeForm.querySelector(`.form__submit`);

  formTitle.minLength = `30`;
  formTitle.maxLength = `100`;
  formAddress.required = true;
  formAddress.readOnly = true;
  clearForm();

  formTitle.addEventListener(`focus`, onFormValidation);
  formTitle.addEventListener(`blur`, onFormValidation);
  formPricePerNight.addEventListener(`focus`, onFormValidation);
  formPricePerNight.addEventListener(`blur`, onFormValidation);

  formTypes.addEventListener(`change`, checkTypes);
  formRoomsNumber.addEventListener(`change`, syncGuests);
  formTimein.addEventListener(`change`, onTimeSelect);
  formTimeout.addEventListener(`change`, onTimeSelect);

  submitButton.addEventListener(`mousedown`, onFormValidation);
  window.map.noticeForm.addEventListener(`submit`, onSubmit);
  window.map.noticeForm.addEventListener(`reset`, clearForm);


  function onFormValidation(evt) {
    switch (evt.type) {
      case `focus`: evt.target.value.length > 0 ? evt.target.required = true : false; break;
      case `blur`: evt.target.value.length == 0 ? evt.target.required = false : false; break;
      case `mousedown`:
        formTitle.required = true;
        formPricePerNight.required = true;
    }
  }

  function checkTypes() {
    let minWorthes = [`0`, `1000`, `5000`, `10000`];
    let setMinWorth = (minValue) => formPricePerNight.min = minValue;
    window.synchronizeFields(formTypes, minWorthes, setMinWorth);
  }

  function onTimeSelect(evt) {
    let syncTimeInOut = (anotherChild) => anotherChild.selected = true;

    if (evt.target === formTimein) {
      window.synchronizeFields(formTimein.children, formTimeout.children, syncTimeInOut);
    } else if (evt.target === formTimeout) {
      window.synchronizeFields(formTimeout.children, formTimein.children, syncTimeInOut);
    }
  }

  function syncGuests() { // синхронизируем количество комнат и гостей
    formGuests.innerHTML = `
      <option value="1">для 1 гостя</option>
      <option value="2">для 2 гостей</option>
      <option value="3">для 3 гостей</option>
      <option value="0">не для гостей</option>
    `;
    window.synchronizeFields(formRoomsNumber.children, formGuests.children, delGuestsExcept);
  }

  function delGuestsExcept(theGuest, i, guestsArray) {
    theGuest.selected = true;

    if (theGuest.textContent === `не для гостей`) {
      formGuests.innerHTML = `<option value="0">не для гостей</option>`;
    } else {
      for (let k = i + 1; k < guestsArray.length; k++) {
        guestsArray[k].remove();
        k--;
      }
    }
  }

  function clearForm() {
    formTitle.value = ``;
    formPricePerNight.value = ``;
    formPricePerNight.min = `1000`;
    formPricePerNight.max = `1000000`;
    formTypes.children[1].selected = true;
    formRoomsNumber.children[0].selected = true;
    syncGuests();
    formDescription.value = ``;
  }

  function onSubmit(evt) {
    evt.preventDefault();
    if (formTitle.validity.valid && formPricePerNight.validity.valid) {
      window.upload(window.pin.errorHandler, new FormData(window.map.noticeForm), clearForm);
    }
  }
}());

