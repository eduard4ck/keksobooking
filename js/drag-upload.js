window.dragUpload = function () {

  let avatarInput = document.querySelector(`.notice__form #avatar`);
  let imagesInput = document.querySelector(`.notice__form #images`);
  let avatarDropZone = document.querySelector(`.notice__form label[for="avatar"]`);
  let imagesDropZone = document.querySelector(`.notice__form label[for="images"]`);
  let avatarPic = document.querySelector(`.notice__form .notice__preview`).children[0];
  let photoContainer = document.querySelector(`.notice__form .form__photo-container`).parentNode;
  let progressBar = document.querySelector(`.notice__form #progress-bar`);
  let progressBarSpan = progressBar.nextElementSibling;

  // Функция проверяет расширения, и загружает фото показывая прогресс бар.
  function appendImage(files, appendTo) {
    let sizes = [...files].reduce((acc, elem) => acc + elem.size, 0);
    let fullLoaded = 0;

    let picExtensions = [`jpg`, `jpeg`, `png`, `gif`];
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let fileName = file.name.toLowerCase();
      let matches = picExtensions.some((it) => fileName.endsWith(it));
      let lastLoaded = 0;

      if (!matches) {
        return -1;
      }

      let reader = new FileReader();
      reader.readAsDataURL(file);
      if (appendTo.htmlFor.toLowerCase() === `images`) {
        reader.onprogress = (evt) => {
          fullLoaded = fullLoaded - lastLoaded + evt.loaded;
          lastLoaded = evt.loaded;
          progressBar.value = fullLoaded / sizes * 100;
          progressBarSpan.innerHTML = `&#8195;${Math.floor(progressBar.value)} %`;
        };
      }

      reader.addEventListener(`load`, function () {
        if (appendTo.htmlFor.toLowerCase() === `avatar`) {
          avatarPic.src = reader.result;
        } else if (appendTo.htmlFor.toLowerCase() === `images`) {
          let before = window.map.noticeForm.querySelector(`.form__photo-container`);
          let img = document.createElement(`img`);
          img.classList.add(`drop-images`);
          img.src = reader.result;
          photoContainer.insertBefore(img, before);
        }
      });

    }
  }

  function dragenter(evt) { // слушатель на документ, проверка на дроп зону
    if (avatarDropZone.contains(evt.target)) {
      avatarDropZone.classList.add(`dragenter`);
    } else if (imagesDropZone.contains(evt.target)) {
      imagesDropZone.classList.add(`dragenter`);
    } else {
      avatarDropZone.classList.remove(`dragenter`);
      imagesDropZone.classList.remove(`dragenter`);
    }
  }

  function dragover(evt) { // меняет указатель курсора, если указатель зашел в дроп зону
    evt.preventDefault();
    evt.dataTransfer.dropEffect = `none`;
    if (avatarDropZone.contains(evt.target) || imagesDropZone.contains(evt.target)) {
      evt.dataTransfer.dropEffect = `copy`;
    }
  }

  function drop(evt) {
    evt.preventDefault();
    avatarDropZone.classList.remove(`dragenter`);
    imagesDropZone.classList.remove(`dragenter`);
    appendImage(evt.dataTransfer.files, this);
  }


  /*
  *   Listeners
  */
  avatarInput.addEventListener(`change`, () => appendImage(avatarInput.files, avatarDropZone));
  imagesInput.addEventListener(`change`, () => appendImage(imagesInput.files, imagesDropZone));

  document.addEventListener(`dragenter`, dragenter);
  document.addEventListener(`dragover`, dragover);
  avatarDropZone.addEventListener(`drop`, drop);
  imagesDropZone.addEventListener(`drop`, drop);

};
