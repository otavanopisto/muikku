(function() {

  'use strict';
  
  $.widget("custom.muikkuMaterialLoader", {
    options : {
      workspaceEntityId: -1,
      loadAnswers: false,
      dustTemplate: 'workspace/materials-page.dust',
      renderMode: {
        "html": "raw"
      },
      defaultRenderMode: 'dust'
    },

    _getRenderMode: function(type) {
      return this.options.renderMode[type]||this.options.defaultRenderMode;
    },

    _loadHtmlMaterial: function(pageElement, fieldAnswers) {
      
      var workspaceMaterialId = $(pageElement).data('workspace-material-id');
      var materialId = $(pageElement).data('material-id');
      var parentIds = []; // TODO needed anymore?

      try {
        var material = {
          title: $(pageElement).data('material-title'),
          html: $(pageElement).data('material-content'),
          currentRevision: $(pageElement).data('material-current-revision'),
          publishedRevision: $(pageElement).data('material-published-revision')
        };
        $(pageElement).removeAttr('data-material-content');

        var parsed = $('<div>');
        if (material.title) {
          parsed.append($('h2').html(material.title));
        }
        if (material.html) {
          parsed.append(material.html);
        }
        
        $(document).trigger('beforeHtmlMaterialRender', {
          pageElement: pageElement,
          parentIds: parentIds,
          workspaceMaterialId: workspaceMaterialId,
          materialId: materialId,
          element: parsed,
          fieldAnswers: fieldAnswers
        });
        
        if (this._getRenderMode('html') == 'dust') {
          material.html = parsed.html();
          renderDustTemplate(this.options.dustTemplate, { id: materialId, materialId: materialId, workspaceMaterialId: workspaceMaterialId, type: 'html', data: material }, function (text) {
            $(pageElement).append(text);
            $(document).trigger('afterHtmlMaterialRender', {
              pageElement: pageElement,
              parentIds: parentIds,
              workspaceMaterialId: workspaceMaterialId,
              materialId: materialId,
              fieldAnswers: fieldAnswers
            });
            $.waypoints('refresh');
          });
        }
        else {
          $(pageElement).append(parsed);
          $(document).trigger('afterHtmlMaterialRender', {
            pageElement: pageElement,
            parentIds: parentIds,
            workspaceMaterialId: workspaceMaterialId,
            materialId: materialId,
            fieldAnswers: fieldAnswers
          });
        }

      } catch (e) {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.workspace.materialsLoader.htmlMaterialReadingFailed", e));
      }
    },
    
    loadMaterial: function(page, fieldAnswers) {
      var workspaceMaterialId = $(page).data('workspace-material-id');
      var materialId = $(page).data('material-id');
      var materialType = $(page).data('material-type');
      switch (materialType) {
        case 'html':
          this._loadHtmlMaterial($(page), fieldAnswers);
        break;
        case 'folder':
          renderDustTemplate(this.options.dustTemplate, { id: materialId, type: materialType, data: { title: $(page).data('material-title') } }, $.proxy(function (text) {
            $(this).html(text);
          }, page));
        break;
        default:
          var typeEndpoint = mApi().materials[materialType];
          if (typeEndpoint != null) {
            typeEndpoint.read(materialId).callback($.proxy(function (err, result) {
              renderDustTemplate(this.options.dustTemplate, { 
                workspaceMaterialId: workspaceMaterialId,
                materialId: materialId,
                id: materialId,
                type: materialType,
                data: result 
              }, $.proxy(function (text) {
                $(this).html(text);
              }, page));
            }, this));
          }
        break;
      }
    },
    
    loadMaterials: function(pageElements) {
      if (this.options.loadAnswers === true) {
        mApi().workspace.workspaces.materialreplies.read(this.options.workspaceEntityId).callback($.proxy(function (err, reply) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.workspace.materialsLoader.answerLoadingFailed", err));
          }
          else {
            // answers array
            var fieldAnswers = {};
            if (reply && reply.answers.length) {
              for (var i = 0, l = reply.answers.length; i < l; i++) {
                var answer = reply.answers[i];
                var answerKey = [answer.materialId, answer.embedId, answer.fieldName].join('.');
                fieldAnswers[answerKey] = answer.value;
              }
            }
          }
          // actual loading of pages
          $(pageElements).each($.proxy(function (index, page) {
            this.loadMaterial(page, fieldAnswers);
          }, this));
        }, this));
      }
      else {
        $(pageElements).each($.proxy(function (index, page) {
          this.loadMaterial(page, {});
        }, this));
      }
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
          embedId: data.embedId,
          meta: data.meta,
          hasExamples: function () {
            var meta = this.options.meta;
            if (meta.rightAnswers && meta.rightAnswers.length > 0) {
              for (var i = 0, l = meta.rightAnswers.length; i < l; i++) {
                if (meta.rightAnswers[i].correct === true) {
                  return false;
                }
              }
              
              return true;
            }
            
            return false;
          },
          getExamples: function () {
            var result = [];
            
            var meta = this.options.meta;
            if (meta.rightAnswers && meta.rightAnswers.length > 0) {
              for (var i = 0, l = meta.rightAnswers.length; i < l; i++) {
                result.push(meta.rightAnswers[i].text);
              }
            }
            
            return result;
          },
          canCheckAnswer: function() {
            var meta = this.options.meta;
            if (meta.rightAnswers) {
              for (var i = 0, l = meta.rightAnswers.length; i < l; i++) {
                if (meta.rightAnswers[i].correct === true) {
                  return true;
                }
              }
            }
            
            return false;
          },
          isCorrectAnswer: function() {
            var meta = this.options.meta;
            
            var meta = this.options.meta;
            if (meta.rightAnswers) {
              for (var i = 0, l = meta.rightAnswers.length; i < l; i++) {
                if (meta.rightAnswers[i].correct === true) {
                  var answer = this.answer()||'';
                  var text = meta.rightAnswers[i].text||'';
                  
                  if (!meta.rightAnswers[i].caseSensitive) {
                    answer = answer.toLowerCase();
                    text = text.toLowerCase();
                  }
                  
                  if (meta.rightAnswers[i].normalizeWhitespace) {
                    answer = answer.trim();
                    text = text.trim();
                  }
                  
                  if (text == answer) {
                    return true;
                  }
                }
              }
            }
            
            return false; 
          }
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
        })
      );
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
        .attr({
          'data-field-name': meta.name,
          'data-material-id': data.materialId,
          'data-embed-id': data.embedId,
          'data-meta': JSON.stringify(data.meta)
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
          
          // Empty option to be able to clear an answer (unless such exists in options already)
          if (meta.listType == 'dropdown') {
            var hasEmpty = false;
            for (var i = 0, l = meta.options.length; i < l; i++) {
              hasEmpty = (meta.options[i].text == '' || meta.options[i].text == '-');
              if (hasEmpty)
                break;
            }
            if (!hasEmpty)
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
              embedId: data.embedId,
              meta: meta,
              canCheckAnswer: function() {
                for (var i = 0, l = meta.options.length; i < l; i++) {
                  if (meta.options[i].correct == true) {
                    return true;
                  }
                }
                return false;
              },
              isCorrectAnswer: function() {
                var answer = this.answer();
                for (var i = 0, l = meta.options.length; i < l; i++) {
                  if (meta.options[i].correct == true && meta.options[i].name == answer) {
                    return true;
                  }
                }
                return false; 
              }
            });
          
          $(object).replaceWith(input);
        break;
        case 'radio-horizontal':
        case 'radio-vertical':
          var idPrefix = [data.materialId, data.embedId, data.name].join(':');
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
            var target = container;
            if (meta.listType == 'radio-vertical') {
              target = $('<div>');
              container.append(target);
            }
            target.append(radio);
            target.append(label);
          }      
          container.muikkuField({
            fieldName: data.name,
            materialId: data.materialId,
            embedId: data.embedId,
            meta: meta,
            answer: function() {
              return $(this.element).find('input:checked').val();
            },
            canCheckAnswer: function() {
              for (var i = 0, l = meta.options.length; i < l; i++) {
                if (meta.options[i].correct == true) {
                  return true;
                }
              }
              return false;
            },
            isCorrectAnswer: function() {
              var answer = this.answer();
              for (var i = 0, l = meta.options.length; i < l; i++) {
                if (meta.options[i].correct == true && meta.options[i].name == answer) {
                  return true;
                }
              }
              return false; 
            }
          });
          $(object).replaceWith(container);
        break;
      }
    }
  });

  $(document).on('taskFieldDiscovered', function (event, data) {
    var object = data.object;
    if ($(object).attr('type') == 'application/vnd.muikku.field.multiselect') {

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
        var target = container;
        if (meta.listType == 'checkbox-vertical') {
          target = $('<div>');
          container.append(target);
        }
        target.append(checkbox);
        target.append(label);
      }      
      container.muikkuField({
        fieldName: data.name,
        materialId: data.materialId,
        embedId: data.embedId,
        meta: meta,
        answer: function() {
          var values = [];
          $(this.element).find('input:checked').each(function() {
            values.push($(this).val());
          });
          return JSON.stringify(values); 
        },
        canCheckAnswer: function() {
          for (var i = 0, l = meta.options.length; i < l; i++) {
            if (meta.options[i].correct == true) {
              return true;
            }
          }
          return false;
        },
        isCorrectAnswer: function() {
          var selectedValues = [];
          $(this.element).find('input:checked').each(function() {
            selectedValues.push($(this).val());
          });
          var correctValues = [];
          for (var i = 0, l = meta.options.length; i < l; i++) {
            if (meta.options[i].correct == true) {
              correctValues.push(meta.options[i].name);
            }
          }
          if (selectedValues.length != correctValues.length) {
            return false;
          }
          for (var i = 0; i < selectedValues.length; i++) {
            if (correctValues.indexOf(selectedValues[i]) == -1)
              return false;
          }
          return true;
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
      },
      canCheckAnswer: function () {
        return false;
      },
      isCorrectAnswer: function () {
        return false;
      },
      hasExamples: function () {
        return false;
      },
      getExamples: function () {
        return [];
      }
    },
    _create : function() {
      $(this.element).addClass('muikku-field');
    },
    answer: function () {
      return this.options.answer.call(this)||'';
    },
    hasExamples: function () {
      return this.options.hasExamples.call(this);
    },
    getExamples: function () {
      return this.options.getExamples.call(this);
    },
    canCheckAnswer: function() {
      return this.options.canCheckAnswer.call(this)||false;
    },
    isCorrectAnswer: function() {
      return this.options.isCorrectAnswer.call(this)||false;
    },
    fieldName: function () {
      return this.options.fieldName;
    },
    materialId: function () {
      return this.options.materialId;
    },
    embedId: function () {
      return this.options.embedId||'';
    },
    meta: function () {
      return this.options.meta;
    }
  });
  
  $(document).on('taskFieldDiscovered', function (event, data) {
    var page = $(data.pageElement);
    if (!$(page).data('answer-button')) {
      var buttonText = $(page).data('workspace-material-assigment-type') == "EXERCISE" 
          ? getLocaleText("plugin.workspace.materialsLoader.saveExerciseButton")
          : getLocaleText("plugin.workspace.materialsLoader.saveAssignmentButton");
      
      var saveButtonWrapper = $('<div>');
          
      $(page)
        .append(saveButtonWrapper
            .addClass('muikku-save-page-wrapper'))
        .data('answer-button', 'true');

      $(saveButtonWrapper)
          .append($('<button>')
             .addClass('muikku-save-page')
             .text(buttonText)
             .data('unsaved-text', buttonText));
      
    }
  });
  
  function createEmbedId(parentIds) {
    return (parentIds.length ? parentIds.join(':') : null);
  }

  function fixTables(node) {
    var $tables = $(node).find("table");
    
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
      $(data.pageElement).find('.muikku-connect-field-table').each(function (index, field) {
        var meta = $.parseJSON($(field).attr('data-meta'));
        $(field).muikkuConnectField({
          fieldName: $(field).data('field-name'),
          embedId: $(field).data('embed-id'),
          materialId: $(field).data('material-id'),
          meta: meta
        });
      });
      $('.muikku-connect-field').muikkuConnectField('refresh');
      $(data.pageElement).find('img').lazyload();
      $(data.pageElement).find('.js-lazyyt').lazyYT(); 
    }); 
    
    $(data.pageElement).find('.muikku-file-field').each(function (index, field) {
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
