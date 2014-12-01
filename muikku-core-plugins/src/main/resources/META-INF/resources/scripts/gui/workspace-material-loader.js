function xhrRequest(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.send();
  callback(xhr.status, xhr.statusText, xhr.responseText);
}

onmessage = function (oEvent) {
  var materialId = oEvent.data.materialId;
  var workspaceEntityId = oEvent.data.workspaceEntityId;
  var workspaceMaterialId = oEvent.data.workspaceMaterialId;
  
  xhrRequest('/rest/materials/html/' + materialId, function (status, statusText, responseText) {
    if (status == 200 || status == 304) {
      postMessage({
        err: null,
        statusCode: status,
        html: responseText
      });
    } else {
      postMessage({
        err: statusText,
        statusCode: status,
        html: null
      });
    }
  });
};