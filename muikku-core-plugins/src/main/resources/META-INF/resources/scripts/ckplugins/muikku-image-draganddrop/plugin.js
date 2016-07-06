(function() {
  'use strict';

  CKEDITOR.plugins.add('muikku-image-draganddrop', {
    init: function(editor) {
            
      function handleError(err) {
        alert(err.data.error);
      }

      function handleDrop(e) {
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        uploadFile(file).then(createImage, handleError);
      }

      function uploadFile(file) {
        var settings = editor.config.dragAndDropConfig;
        return sendPostRequest(settings.uploadUrl, file, settings.headers);
      }

      function createImage(href) {
        var elem = editor.document.createElement('img', {
          attributes: {
            src: href
          }
        });
        editor.insertElement(elem);
      }

      function sendPostRequest(url, data, headers) {
        return new Promise(function(resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open('POST', url);
          for (var key in headers) {
            if (headers.hasOwnProperty(key)) {
              xhr.setRequestHeader(key, headers[key]);
            }
          }
          xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText).data.link);
              } else {
                reject(JSON.parse(xhr.responseText));
              }
            }
          };
          xhr.send(data);
        });
      }

      CKEDITOR.on('instanceReady', function() {
        var iframeBase = document.querySelector('iframe').contentDocument.querySelector('html');
        var iframeBody = iframeBase.querySelector('body');

        iframeBody.ondragover = function(e){}; //Do nothing
        iframeBody.ondrop = handleDrop;

        paddingToCenterBody = ((iframeBase.offsetWidth - iframeBody.offsetWidth) / 2) + 'px';
        iframeBase.style.height = '100%';
        iframeBase.style.width = '100%';
        iframeBase.style.overflowX = 'hidden';

        iframeBody.style.height = '100%';
        iframeBody.style.margin = '0';
        iframeBody.style.paddingLeft = paddingToCenterBody;
        iframeBody.style.paddingRight = paddingToCenterBody;
      });
    }
  });
})();