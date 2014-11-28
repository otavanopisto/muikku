(function() {
  
  var uniqueIdCounter = 1;
  
  function createUniqueId() {
    uniqueIdCounter++;
    return 'uid-' + uniqueIdCounter;
  }
  
  function loadHtmlMaterial(pageElement, workspaceEntityId, workspaceMaterialId, materialId, placeholderId, parentIds, fieldAnswers) {
    var placeHolder = $('#' + placeholderId);
    placeHolder
      .addClass('workspace-material-loading');
    
    var worker = new Worker("/scripts/gui/workspace-material-loader.js");
    
    worker.onmessage = function (response) {
      if ((response.data.statusCode != 200) && (response.data.statusCode != 304)) {
        $('.notification-queue').notificationQueue('notification', 'error', "Error occurred while loading html page: " + response.data.err + ' (' + response.data.statusCode + ')');
      } else {
        try {
          var material = $.parseJSON(response.data.html);
          var parsed = $('<div>').html(material.html);
          
          parsed.find('iframe[data-type="embedded-document"]').each(function (index, iframe) {
            var embededWorkspaceMaterialId = $(iframe).data('workspace-material-id');
            var embededMaterialId = $(iframe).data('material-id');
            var embededMaterialType = $(iframe).data('material-type');
            
            if (embededMaterialType == 'html') {
              var placeholder = $('<div>')
                .attr('id', createUniqueId())
                .addClass('workspace-material-loading')
              
              $(iframe).replaceWith(placeholder);
              loadHtmlMaterial(pageElement, workspaceEntityId, embededWorkspaceMaterialId, embededMaterialId, placeholder.attr('id'), parentIds.concat(materialId), fieldAnswers);
            } else {
              $('.notification-queue').notificationQueue('notification', 'error', "Incorrect material type '" + materialType + "' for embedded document");
            }
          });
          
          $(document).trigger('beforeHtmlMaterialRender', {
            pageElement: pageElement,
            parentIds: parentIds,
            workspaceMaterialId: workspaceMaterialId,
            materialId: materialId,
            element: parsed,
            fieldAnswers: fieldAnswers
          });
          
          $('#' + placeholderId).replaceWith(parsed);
          
          $.waypoints('refresh');
          
          $(document).trigger('afterHtmlMaterialRender', {
            pageElement: pageElement,
            parentIds: parentIds,
            workspaceMaterialId: workspaceMaterialId,
            materialId: materialId,
            element: parsed,
            fieldAnswers: fieldAnswers
          });
        } catch (e) {
          $('.notification-queue').notificationQueue('notification', 'error', "Error occurred while reading html page: " + e);
        }
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
      .addClass('workspace-material-queued-html')
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
      $(this).removeClass('workspace-material-queued-html')
      var workspaceEntityId = $('.workspaceEntityId').val();
      var workspaceMaterialId = $(this).data('workspace-material-id');
            
      mApi().workspace.workspaces.materials.replies.read(workspaceEntityId, workspaceMaterialId)
        .callback($.proxy(function (err, reply) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', "Error occurred while loading answers " + err);
          } else {
            var fieldAnswers = {};
            
            if (reply && reply.answers.length) {
              for (var i = 0, l = reply.answers.length; i < l; i++) {
                var answer = reply.answers[i];
                var answerKey = [answer.materialId, answer.embedId, answer.fieldName].join('.');
                fieldAnswers[answerKey] = answer.value;
              }
            }
            
            loadHtmlMaterial($(this).closest('.workspace-materials-reading-view-page'), workspaceEntityId, workspaceMaterialId ,$(this).data('material-id'), $(this).attr('id'), [], fieldAnswers);
          }
        }, this));
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
        .val(data.value)
        .muikkuField({
          fieldName: data.name,
          materialId: data.materialId,
          embedId: data.embedId
        });   
      
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
          .val(data.value)
          .muikkuField({
            fieldName: data.name,
            materialId: data.materialId,
            embedId: data.embedId
          }));
    }
  });
  
  $(document).on('taskFieldDiscovered', function (event, data) {
    var object = data.object;
    if ($(object).attr('type') == 'application/vnd.muikku.field.connect') {
      
      function getExcelStyleLetterIndex(numericIndex) {   
        var ALPHABET_SIZE = 26;
        
        var result = "";
        do {
          var charIndex = Math.floor(numericIndex % ALPHABET_SIZE);
          numericIndex = Math.floor(numericIndex / ALPHABET_SIZE);
          numericIndex -= 1;
          result = String.fromCharCode(charIndex + 65) + result;
        } while (numericIndex > -1);
          
        return result;
      };
      
      var meta = data.meta;
      var values = $.parseJSON(data.value);
      var tBody = $('<tbody>');
      
      var field = $('<table>')
        .addClass('muikku-connect-field-table')
        .data({
          'field-name': meta.name,
          'material-id': data.materialId,
          'embed-id': data.embedId
        });
      
      var fieldsSize = meta.fields.length;
      var counterpartsSize = meta.counterparts.length;
      var rowCount = Math.max(fieldsSize, counterpartsSize);
      
      for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        var tdTermElement = $("<td>").addClass('muikku-connect-field-term-cell');
        var tdValueElement = $("<td>").addClass('muikku-connect-field-value-cell');
        var tdCounterpartElement = $("<td>").addClass("muikku-connect-field-counterpart-cell");
        var inputElement = $("<input>") 
          .addClass('muikku-connect-field-value') 
          .attr({
            'type': 'text'
          });
        
        var connectFieldTermMeta = rowIndex < fieldsSize ? meta.fields[rowIndex] : null;
        var connectFieldCounterpartMeta = rowIndex < counterpartsSize ? meta.counterparts[rowIndex] : null;
        
        if (connectFieldTermMeta != null) {
          inputElement
            .attr({
              'name': connectFieldTermMeta.name
            })
            .val(values[connectFieldTermMeta.name]);
          
          tdTermElement.text((rowIndex + 1) + " - " + connectFieldTermMeta.text);
          tdTermElement.data('muikku-connect-field-option-name', connectFieldTermMeta.name);
          tdValueElement.append(inputElement);
        }
        
        if (connectFieldCounterpartMeta != null) {
          tdCounterpartElement.text(getExcelStyleLetterIndex(rowIndex) + " - " + connectFieldCounterpartMeta.text);
          tdCounterpartElement.attr('data-muikku-connect-field-option-name', connectFieldCounterpartMeta.name);
        }
      
        tBody
          .append($('<tr>')
            .append(tdTermElement)
            .append(tdValueElement)
            .append(tdCounterpartElement));
      }
      
      field.append(tBody);
      
      $(object).replaceWith(field);
      
      // TODO: data.meta.help, data.meta.hint
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
            });
          
          if(meta.size != 'null') input.attr('size', meta.size);
          
          // Empty option to be able to clear an answer  
          if (meta.listType == 'dropdown') {
            input.append($('<option>'));
          }
          
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
            .muikkuField({
              fieldName: data.name,
              materialId: data.materialId,
              embedId: data.embedId
            });
          
          $(object).replaceWith(input);
        break;
        case 'radio':
        case 'radio_horz':
          var idPrefix = [data.materialId, data.embedId, data.name].join(':');
          // TODO proper css for container (?) to display radio buttons vertically or horizontally
          var container = $('<div>').addClass('muikku-select-field');
          for (var i = 0, l = meta.options.length; i < l; i++){
            var label = $('<label>')
              .attr({
                'for': [idPrefix, meta.options[i].name].join(':')
              });
            label.text(meta.options[i].text);
            var radio = $('<input>')
              .attr({
                id: [idPrefix, meta.options[i].name].join(':'),
                name: data.name,
                type: 'radio',
                value: meta.options[i].name
            });
            if (data.value == meta.options[i].name) {
              radio.attr({
                checked: 'checked'
              });
            }
            container.append(label);
            container.append(radio);
          }      
          container.muikkuField({
            fieldName: data.name,
            materialId: data.materialId,
            embedId: data.embedId,
            answer: function() {
              return $(this.element).find('input:checked').val();
            }
          });
          $(object).replaceWith(container);
        break;
      }
    }
  });

  $(document).on('taskFieldDiscovered', function (event, data) {
    var object = data.object;
    if ($(object).attr('type') == 'application/vnd.muikku.field.checklist') {

      var meta = data.meta;
      var idPrefix = [data.materialId, data.embedId, data.name].join(':');
      // TODO proper css for checkbox container
      var container = $('<div>').addClass('muikku-checkbox-field');
      for (var i = 0, l = meta.options.length; i < l; i++){
        var label = $('<label>')
          .attr({
            'for': [idPrefix, meta.options[i].name].join(':')
          });
        label.text(meta.options[i].text);
        var values = $.parseJSON(data.value);
        var checkbox = $('<input>')
          .attr({
            id: [idPrefix, meta.options[i].name].join(':'),
            name: data.name,
            type: 'checkbox',
            value: meta.options[i].name
        });
        if ($.inArray(meta.options[i].name, values) > -1) {
          checkbox.attr({
            checked: 'checked'
          });
        }
        container.append(label);
        container.append(checkbox);
      }      
      container.muikkuField({
        fieldName: data.name,
        materialId: data.materialId,
        embedId: data.embedId,
        answer: function() {
          var values = [];
          $(this.element).find('input:checked').each(function() {
            values.push($(this).val());
          });
          return JSON.stringify(values); 
        }
      });
      $(object).replaceWith(container);
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
      return this.options.answer.call(this)||'';
    },
    fieldName: function () {
      return this.options.fieldName;
    },
    materialId: function () {
      return this.options.materialId;
    },
    embedId: function () {
      return this.options.embedId||'';
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
   
    $(data.element).find('object[type*="vnd.muikku.field"]').each(function (index, object) {
      var meta = $.parseJSON($(object).find('param[name="content"]').attr('value'));
      var embedId = createEmbedId(data.parentIds);
      var materialId = data.materialId;
      var valueKey = [materialId, embedId, meta.name].join('.');
      var value = data.fieldAnswers[valueKey];
      
      $(document).trigger('taskFieldDiscovered', {
        pageElement: data.pageElement,
        object: object,
        meta: meta,
        name: meta.name,
        embedId: embedId,
        materialId: materialId,
        value: value
      });
    });
  });
  
  $(document).on('afterHtmlMaterialRender', function (event, data) {
    jsPlumb.ready(function() {
      $(data.element).find('.muikku-connect-field-table').each(function (index, field) {
        $(field).muikkuConnectField({
          fieldName: $(field).data('field-name'),
          embedId: $(field).data('embed-id'),
          materialId: $(field).data('material-id')
        });
      });
    }); 
    
    // TODO: Window resize & new material loading can mess up jsplumb handle positions
  });
  
  $(document).on('click', '.muikku-save-page', function (event, data) {
    var page = $(this).closest('.workspace-materials-reading-view-page');
    var workspaceEntityId = $('.workspaceEntityId').val(); //  TODO: data?
    var workspaceMaterialId = $(page).data('workspace-material-id');
    var reply = [];
    
    page.find('.muikku-field').each(function (index, field) {
      reply.push({
        value: $(field).muikkuField('answer'),
        embedId: $(field).muikkuField('embedId'),
        materialId: $(field).muikkuField('materialId'),
        fieldName: $(field).muikkuField('fieldName')
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
