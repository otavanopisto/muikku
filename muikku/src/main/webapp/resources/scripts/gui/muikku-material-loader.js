(function() {

  'use strict';
  
  $.widget("custom.muikkuMaterialLoader", {
    _create : function() {
      this._uniqueIdCounter = 1;
    },

    _createUniqueId: function() {
      this._uniqueIdCounter++;
      return 'uid-' + this._uniqueIdCounter;
    },

    _loadHtmlMaterial: function(pageElement, workspaceEntityId, workspaceMaterialId, materialId, placeholderId, parentIds, fieldAnswers) {
      var _this = this;
      var placeHolder = $('#' + placeholderId);
      placeHolder.addClass('workspace-material-loading');
      
      var worker = new Worker("/scripts/gui/workspace-material-loader.js");
      
      worker.onmessage = function (response) {
        if ((response.data.statusCode != 200) && (response.data.statusCode != 304)) {
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
                  .attr('id', _this._createUniqueId())
                  .addClass('workspace-material-loading')
                
                $(iframe).replaceWith(placeholder);
                _this._loadHtmlMaterial(pageElement, workspaceEntityId, embededWorkspaceMaterialId, embededMaterialId, placeholder.attr('id'), parentIds.concat(materialId), fieldAnswers);
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
            
            // TODO proper placement
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
    },
    
    /**
     * 
     */
    _queueHtmlMaterial: function(materialId, workspaceMaterialId, page) {
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
    },
    
    /**
     * 
     */
    loadMaterials: function(pageElements) {
      var _this = this;
      $(pageElements).each(function (index, page) {
        var workspaceMaterialId = $(page).data('workspace-material-id');
        var materialId = $(page).data('material-id');
        var materialType = $(page).data('material-type');
        
        switch (materialType) {
          case 'html':
            _this._queueHtmlMaterial(materialId, workspaceMaterialId, page);
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
        $(this).attr('id', _this._createUniqueId());
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
              
              _this._loadHtmlMaterial($(this).parentNode, workspaceEntityId, workspaceMaterialId ,$(this).data('material-id'), $(this).attr('id'), [], fieldAnswers);
            }
          }, this));
      }, {
        offset: function() {
          return $(window).height() + 200;
        }
      });

      // Smooth scrolling in workspace Material's View 
      var $sections = $(pageElements);

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

      $(pageElements).waypoint(function(direction) {
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
    }
  }); // material loader widget
  
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

    var object = data.object;
    if ($(object).attr('type') == 'application/vnd.muikku.field.connect') {
      var meta = data.meta;
      var values = data.value ? $.parseJSON(data.value) : {};
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
        var values = data.value ? $.parseJSON(data.value) : [];
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
  
  $(document).on('taskFieldDiscovered', function (event, data) {
    var object = data.object;
    if ($(object).attr('type') == 'application/vnd.muikku.field.file') {
      
      var input = $('<input>')
        .addClass('muikku-file-field')
        .attr({
          'type': "file",
          'placeholder': data.meta.help,
          'title': data.meta.hint,
          'name': data.name
        })
        .data({
          'field-name': data.name,
          'material-id': data.materialId,
          'embed-id': data.embedId
        });   
      
      var files = data.value ? $.parseJSON(data.value) : [];
      for (var i = 0, l = files.length; i < l; i++) {
        var file = files[i];
        $(input).data('file-' + i + '.file-id', file.originalId);
        $(input).data('file-' + i + '.filename', file.name);
        $(input).data('file-' + i + '.content-type', file.contentType);
      }
      
      $(input).data({
        'file-count': files.length
      });
      
      $(object).replaceWith(input);
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
  
  function createEmbedId(parentIds) {
    return (parentIds.length ? parentIds.join(':') : null);
  }

  function fixTables(node) {
    var $tables = node.find("table");
    
    $tables.each(function() {
      var $table = $(this);
      
      var padding = ($table.attr("cellpadding") !== undefined ? $table.attr("cellpadding") : 0);
      var margin = ($table.attr("cellspacing") !== undefined ? $table.attr("cellspacing") : 0);
      var border = ($table.attr("border") !== undefined ? $table.attr("border") : 0);
      var width = $table.attr("width") !== undefined ? $table.attr("width") + "px;" : "auto;";
      var bgcolor = $table.attr("bgcolor") !== undefined ? $table.attr("bgcolor") : "transparent;";
      
      if ($table.attr("style") !== undefined) {
        var origStyle = $table.attr("style");
        $table.attr("style", "width:" + width + "border:" + border + "px solid #000;" + "border-spacing:" + margin + "px; " + origStyle + "background-color:" + bgcolor);  
      } else {
        $table.attr("style", "width:" + width + "border:" + border + "px solid #000;" + "border-spacing:" + margin + "px; " + "background-color:" + bgcolor);  
      }
      
      $table.removeAttr("border");
      $table.removeAttr("width");
      $table.removeAttr("cellpadding");
      $table.removeAttr("cellspacing");
      $table.removeAttr("bgcolor");
       
      var $tds = $table.find("td");
      $tds.each(function(){
        var $td = $(this);
        var bgcolor = $td.attr("bgcolor") !== undefined ? $td.attr("bgcolor") : "transparent;";
        var width = $td.attr("width") !== undefined ? $td.attr("width") + "px; " : "auto;";
        $td.attr("style", "width:" + width + "padding:" + padding + "px;" + "border:" + border + "px solid #000;" + "background-color:" + bgcolor);
        
        $td.removeAttr("border");
        $td.removeAttr("width");
        $td.removeAttr("bgcolor");
      });
    });
  }
  
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
    fixTables(data.element);
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
      
      $('.muikku-connect-field').muikkuConnectField('refresh');
    }); 
    
    $(data.element).find('.muikku-file-field').each(function (index, field) {
      $(field)
        .muikkuFileField()
        .muikkuField({
          fieldName: $(field).data('field-name'),
          embedId: $(field).data('embed-id'),
          materialId: $(field).data('material-id'),
          answer: function () {
            return JSON.stringify($(this.element).muikkuFileField('files'));
          }
        });
    });
    
  });

}).call(this);
