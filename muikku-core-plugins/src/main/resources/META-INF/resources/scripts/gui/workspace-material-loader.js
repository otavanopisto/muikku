onmessage = function (oEvent) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/rest/materials/html/' + oEvent.data.materialId, false);
  xhr.send();
  postMessage(xhr.responseText);
};