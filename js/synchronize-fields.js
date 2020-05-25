window.synchronizeFields = function (childs1, childs2, cb) {
  for (let i = 0; i < childs1.length; i++) {
    if (childs1[i].selected) {
      cb(childs2[i], i, childs2);
      break;
    }
  }
};
