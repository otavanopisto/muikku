(function() {
  
  var uniqueIdCounter = 1;
  
  function createUniqueId() {
    uniqueIdCounter++;
    return 'uid-' + uniqueIdCounter;
  }
  
  function loadHtmlMaterial(materialId, placeholderId) {
    $('#' + placeholderId).html('Loading:' + materialId);
    
    var worker = new Worker("/scripts/gui/workspace-material-loader.js");
    
    worker.onmessage = function (response) {
      var material = $.parseJSON(response.data);
      var parsed = $('<div>').html(material.html);
      
      parsed.find('iframe[data-type="embedded-document"]').each(function (index, iframe) {
        var materialId = $(iframe).data('material-id');
        var materialType = $(iframe).data('material-type');
        
        if (materialType == 'html') {
          var placeholder = $('<div>')
            .attr('id', createUniqueId())
            .text('Embedded document loading');
          
          $(iframe).replaceWith(placeholder);
          loadHtmlMaterial(materialId, placeholder.attr('id'));
        } else {
          $('.notification-queue').notificationQueue('notification', 'error', "Incorrect material type '" + materialType + "' for embedded document");
        }
      });
      
      $(document).trigger('beforeHtmlMaterialRender', {
        element: parsed
      });
      
      $('#' + placeholderId).replaceWith(parsed);
      
      $(document).trigger('afterHtmlMaterialRender');
    };
    
    worker.postMessage({materialId: materialId});
  }
  
  function queueHtmlMaterial(materialId, page) {
    $(page).append($('<div>')
      .attr({
        'data-page-type': 'queued-html',
        'data-material-id': materialId
      })
      .css({
        height: '500px'
      }));
  }

  $(document).ready(function() {
    $('.workspace-materials-reading-view-page').each(function (index, page) {
      var workspaceMaterialId = $(page).data('workspace-material-id');
      var materialId = $(page).data('material-id');
      var materialType = $(page).data('material-type');
      
      switch (materialType) {
        case 'html':
          queueHtmlMaterial(materialId, page);
        break;
        case 'folder':
          renderDustTemplate('workspace/materials-page.dust', { id: materialId, type: materialType }, $.proxy(function (text) {
            $(this).html(text);
          }, page));
        break;
        default:
          var typeEndpoint = mApi().materials[materialType];
          if (typeEndpoint != null) {
            typeEndpoint.read(materialId).callback($.proxy(function (err, result) {
              renderDustTemplate('workspace/materials-page.dust', { 
                workspaceMaterialId: workspaceMaterialId,
                materialId: materialId,
                id: materialId,
                type: materialType,
                data: result 
              }, $.proxy(function (text) {
                $(this).html(text);
              }, page));
            }));
          }
        break;
      }
    });
    
    $('div[data-page-type="queued-html"]').waypoint(function(){
      $(this).attr('id', createUniqueId());
      loadHtmlMaterial($(this).data('material-id'), $(this).attr('id'));
    }, {
      offset: function() {
        return $(window).height() + 200;
      }
    });

    // Smooth scrolling in workspace Material's View 
    var $sections = $('.workspace-materials-reading-view-page');

    $sections.each(function() {
      var $section = $(this);
      var hash = '#' + this.id;

      $('a[href="' + hash + '"]').click(function(event) {
        $('html, body').stop().animate({
          scrollTop : $section.offset().top - 100
        }, {
          duration : 500,
          easing : "easeInOutQuad",
          complete : function() {
            window.location.hash = hash;
          }
        });
        event.preventDefault();
      });
    });

    // Highlighting toc item at appropriate time when we scroll to the
    // corresponding section

    $('.workspace-materials-reading-view-page').waypoint(function(direction) {
      var $links = $('a[href="#' + this.id + '"]');
      $links.toggleClass('active', direction === 'down');
    }, {
      offset : '60%'
    }).waypoint(function(direction) {
      var $links = $('a[href="#' + this.id + '"]');
      $links.toggleClass('active', direction === 'up');
    }, {
      offset : function() {
        return -$(this).height() + 250;
      }
    });

  });
  
  $(document).on('beforeHtmlMaterialRender', function (event, data) {
    $(data.element).find('object[type="application/vnd.muikku.field.text"]').each(function (index, object) {
      var meta = $.parseJSON($(object).find('param[name="content"]').attr('value'));
      
      var input = $('<input>')
        .addClass('muikku-text-field')
        .attr({
          type: "text",
          size: meta.columns,
          placeholder: meta.help,
          title: meta.hint
        });
      
      $(object).replaceWith(input);
    });
  });

}).call(this);