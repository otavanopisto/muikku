(function() {
  
  var uniqueIdCounter = 1;
  
  function createUniqueId() {
    uniqueIdCounter++;
    return 'uid-' + uniqueIdCounter;
  }
  
  function loadHtmlMaterial(pageElement, workspaceEntityId, workspaceMaterialId, materialId, placeholderId, parentIds) {
    var placeHolder = $('#' + placeholderId);
    placeHolder.html('Loading:' + materialId);
    
    var worker = new Worker("/scripts/gui/workspace-material-loader.js");
    
    worker.onmessage = function (response) {
      if ((response.data.statusCode != 200) && (response.data.statusCode != 304)) {
        $('.notification-queue').notificationQueue('notification', 'error', "Error occurred while loading html page: " + response.data.err + ' (' + response.data.statusCode + ')');
      } else {
        var material = $.parseJSON(response.data.html);
        var parsed = $('<div>').html(material.html);
        
        parsed.find('iframe[data-type="embedded-document"]').each(function (index, iframe) {
          var embededWorkspaceMaterialId = $(iframe).data('workspace-material-id');
          var embededMaterialId = $(iframe).data('material-id');
          var embededMaterialType = $(iframe).data('material-type');
          
          if (embededMaterialType == 'html') {
            var placeholder = $('<div>')
              .attr('id', createUniqueId())
              .text('Embedded document loading');
            
            $(iframe).replaceWith(placeholder);
            loadHtmlMaterial(pageElement, workspaceEntityId, embededWorkspaceMaterialId, embededMaterialId, placeholder.attr('id'), parentIds.concat(materialId));
          } else {
            $('.notification-queue').notificationQueue('notification', 'error', "Incorrect material type '" + materialType + "' for embedded document");
          }
        });
        
        var reply = $.parseJSON(response.data.reply);
        
        $(document).trigger('beforeHtmlMaterialRender', {
          pageElement: pageElement,
          parentIds: parentIds,
          workspaceMaterialId: workspaceMaterialId,
          materialId: materialId,
          element: parsed,
          reply: reply
        });
        
        $('#' + placeholderId).replaceWith(parsed);
        
        $(document).trigger('afterHtmlMaterialRender', {
          pageElement: pageElement,
          parentIds: parentIds,
          workspaceMaterialId: workspaceMaterialId,
          materialId: materialId,
          element: parsed,
          reply: reply
        });
      }
    };
    
    worker.postMessage({
      materialId: materialId, 
      workspaceEntityId: workspaceEntityId, 
      workspaceMaterialId: workspaceMaterialId 
    });
  }
  
  function queueHtmlMaterial(materialId, workspaceMaterialId, page) {
    $(page).append($('<div>')
      .attr({
        'data-page-type': 'queued-html',
        'data-material-id': materialId,
        'data-workspace-material-id': workspaceMaterialId
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
          queueHtmlMaterial(materialId, workspaceMaterialId, page);
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
      var workspaceEntityId = $('.workspaceEntityId').val();
      loadHtmlMaterial($(this).closest('.workspace-materials-reading-view-page'), workspaceEntityId, $(this).data('workspace-material-id'),$(this).data('material-id'), $(this).attr('id'), []);
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
  
  function createEmbedId(parentIds) {
    return (parentIds.length ? parentIds.join(':') : null);
  }
  
  $(document).on('taskFieldDiscovered', function (event, data) {
    var object = data.object;
    if ($(object).attr('type') == 'application/vnd.muikku.field.text') {
      var input = $('<input>')
        .addClass('muikku-text-field')
        .attr({
          'type': "text",
          'size':data.meta.columns,
          'placeholder': data.meta.help,
          'title': data.meta.hint,
          'name': data.name
        })
        .data({
          'material-id': data.materialId,
          'embed-id': data.embedId
        })
        .val(data.value)
        .muikkuField();   
      
      $(object).replaceWith(input);
    }
  });
  
  $(document).on('taskFieldDiscovered', function (event, data) {
    var object = data.object;
    if ($(object).attr('type') == 'application/vnd.muikku.field.memo') {
      
      $(object).replaceWith($('<textarea>')
          .addClass('muikku-memo-field')
          .attr({
            'cols':data.meta.columns,
            'rows':data.meta.rows,
            'placeholder': data.meta.help,
            'title': data.meta.hint,
            'name': data.name
          })
          .data({
            'material-id': data.materialId,
            'embed-id': data.embedId
          })
          .val(data.value)
          .muikkuField());
    }
  });
  
  $(document).on('taskFieldDiscovered', function (event, data) {
    var object = data.object;
    if ($(object).attr('type') == 'application/vnd.muikku.field.select') {
      var meta = data.meta;
      switch (meta.listType) {
        case 'list':
        case 'dropdown':
          var input = $('<select>')
            .addClass('muikku-select-field')
            .attr({
              name: data.name
            })
            .data({
              'material-id': data.materialId,
              'embed-id': data.embedId
            });
          
          if(meta.size != 'null') input.attr('size', meta.size);
          
          for(var i = 0, l = meta.options.length; i < l; i++){
            var option = $('<option>')
            .attr({
              'value': meta.options[i].name
            });
            option.text(meta.options[i].text);
            input.append(option);
          }      
          
          input
            .val(data.value)
            .muikkuField();
          
          $(object).replaceWith(input);
        break;
        case 'radio':
          //TODO add support for radio inputs
        break;
        case 'radio_horz':
          //TODO add support for horizontal radio inputs
        break;
      }
    }
  });
  
  $.widget("custom.muikkuField", {
    options : {
      answer: function () {
        return $(this.element).val();
      }
    },
    _create : function() {
      $(this.element).addClass('muikku-field');
    },
    
    answer: function () {
      return this.options.answer.call(this);
    }
  });
  
  $(document).on('taskFieldDiscovered', function (event, data) {
    var page = $(data.pageElement);
    if (!$(page).data('answer-button')) {
      $(page)
        .append($('<button>').addClass('muikku-save-page').text('Save'))
        .data('answer-button', 'true');
    }
  });
  
  $(document).on('beforeHtmlMaterialRender', function (event, data) {
    var reply = data.reply;
    var fieldAnswers = {};
    
    if (reply && reply.answers.length) {
      for (var i = 0, l = reply.answers.length; i < l; i++) {
        var answer = reply.answers[i];
        var answerKey = answer.materialId + '.' + answer.embedId + '.' + answer.fieldName;
        console.log("Akey:" + answerKey);
        fieldAnswers[answerKey] = answer.value;
      }
    }
    
    $(data.element).find('object[type*="vnd.muikku.field"]').each(function (index, object) {
      var meta = $.parseJSON($(object).find('param[name="content"]').attr('value'));
      var embedId = createEmbedId(data.parentIds);
      
      if (reply && reply.answers.length) {
        console.log("Wtf...");
        var fieldKey = data.materialId + '.' + embedId + '.' + meta.name;
        console.log("Fkey:" + fieldKey);
      }
      
      $(document).trigger('taskFieldDiscovered', {
        pageElement: data.pageElement,
        object: object,
        meta: meta,
        name: meta.name,
        embedId: embedId,
        materialId: data.materialId,
        value: fieldAnswers[data.materialId + '.' + embedId + '.' + meta.name]
      });
    });
  });
  
  $(document).on('click', '.muikku-save-page', function (event, data) {
    var page = $(this).closest('.workspace-materials-reading-view-page');
    var workspaceEntityId = $('.workspaceEntityId').val(); //  TODO: data?
    var workspaceMaterialId = $(page).data('workspace-material-id');
    var reply = [];
    
    page.find('.muikku-field').each(function (index, field) {
      var fieldName = $(field).attr('name');
      var value = $(field).muikkuField('answer');
      reply.push({
        value: value,
        embedId: $(field).data('embed-id'),
        materialId: $(field).data('material-id'),
        fieldName: fieldName
      });
    });
    
    mApi().workspace.workspaces.materials.replies.create(workspaceEntityId, workspaceMaterialId, {
      answers: reply
    })
    .callback(function (err) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', "Error occurred while saving field replies " + err);
      }
    });
  });

}).call(this);