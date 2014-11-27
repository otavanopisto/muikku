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
  
  xhrRequest('/rest/materials/html/' + materialId, function (materialStatus, materialStatusText, materialResponseText) {
    if (materialStatus == 200 || materialStatus == 304) {
      xhrRequest('/rest/workspace/workspaces/' + workspaceEntityId + '/materials/' + workspaceMaterialId + '/replies', function (repliesStatus, repliesStatusText, repliesResponseText) {
        if (repliesStatus == 200 || repliesStatus == 304) {
          postMessage({
            err: null,
            statusCode: repliesStatus,
            html: materialResponseText,
            reply: repliesResponseText
          });
        } else {
          postMessage({
            err: repliesStatusText,
            statusCode: repliesStatus,
            html: materialResponseText,
            reply: null
          });
        }
      });
    } else {
      postMessage({
        err: materialStatusText,
        statusCode: materialStatus,
        html: null,
        reply: null
      });
    }
  });
};