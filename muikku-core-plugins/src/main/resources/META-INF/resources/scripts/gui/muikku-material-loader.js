(function() {

  'use strict';
  
  $.widget("custom.muikkuMaterialLoader", {
    options : {
      workspaceEntityId: -1,
      loadAnswers: false,
      readOnlyFields: false,
      dustTemplate: 'workspace/materials-page.dust',
      prependTitle : true,
      renderMode: {
        "html": "raw"
      },
      defaultRenderMode: 'dust'
    },
    
    _create : function() {
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
        if (material.title && this.options.prependTitle) {
          parsed.append('<h2>' + material.title + '</h2>');
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
          fieldAnswers: fieldAnswers,
          readOnlyFields: this.options.readOnlyFields
        });
        
        if (this._getRenderMode('html') == 'dust') {
          material.html = parsed.html();
          renderDustTemplate(this.options.dustTemplate, { id: materialId, materialId: materialId, workspaceMaterialId: workspaceMaterialId, type: 'html', data: material, hidden: pageElement.hasClass('item-hidden') }, $.proxy(function (text) {
            $(pageElement).append(text);
            $(document).trigger('afterHtmlMaterialRender', {
              pageElement: pageElement,
              parentIds: parentIds,
              workspaceMaterialId: workspaceMaterialId,
              materialId: materialId,
              fieldAnswers: fieldAnswers,
              readOnlyFields: this.options.readOnlyFields
            });
            $.waypoints('refresh');
          }, this));
        }
        else {
          $(pageElement).append(parsed);
          $(document).trigger('afterHtmlMaterialRender', {
            pageElement: pageElement,
            parentIds: parentIds,
            workspaceMaterialId: workspaceMaterialId,
            materialId: materialId,
            fieldAnswers: fieldAnswers,
            readOnlyFields: this.options.readOnlyFields
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
      var materialTitle = $(page).data('material-title');
      switch (materialType) {
        case 'html':
          this._loadHtmlMaterial($(page), fieldAnswers);
        break;
        case 'folder':
          renderDustTemplate(this.options.dustTemplate, { id: workspaceMaterialId, workspaceMaterialId: workspaceMaterialId, type: materialType, hidden: $(page).hasClass('item-hidden'), data: { title: $(page).data('material-title') } }, $.proxy(function (text) {
            $(this).html(text);
            $.waypoints('refresh');
          }, page));
        break;
        default:
          var typeEndpoint = mApi({async: false}).materials[materialType];
          if (typeEndpoint != null) {
            typeEndpoint.read(materialId).callback($.proxy(function (err, result) {
              var binaryType = 'unknown';
              if (materialType == 'binary') {
                if (result.contentType.indexOf('image/') != -1) {
                  binaryType = 'image';  
                } else {
                  switch (result.contentType) {
                    case "application/pdf":
                    case "application/x-pdf":
                    case "application/vnd.pdf":
                    case "text/pdf":
                      binaryType = 'pdf';  
                    break;
                    case "application/x-shockwave-flash":
                      binaryType = 'flash';  
                    break;
                  }
                }
              }

              renderDustTemplate(this.options.dustTemplate, { 
                workspaceMaterialId: workspaceMaterialId,
                materialId: materialId,
                id: materialId,
                title: materialTitle,
                type: materialType,
                binaryType: binaryType,
                data: result
              }, $.proxy(function (text) {
                $(this).html(text);
                // PDF and SWF lazy loading 
                $(this).find('.lazyPdf').lazyPdf();
                $(this).find('.lazySwf').lazySwf();
                $.waypoints('refresh');
              }, page));
            }, this));
          }
        break;
      }
    },
    
    loadMaterials: function(pageElements, fieldAnswers) {
      if (this.options.loadAnswers === true) {
        mApi({async: false}).workspace.workspaces.compositeReplies.read(this.options.workspaceEntityId).callback($.proxy(function (err, replies) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.workspace.materialsLoader.answerLoadingFailed", err));
          } else {
            // answers array
            var fieldAnswers = {};
            
            $.each(replies||[], $.proxy(function (index, reply) {
              if (reply && reply.answers.length) {
                for (var i = 0, l = reply.answers.length; i < l; i++) {
                  var answer = reply.answers[i];
                  var answerKey = [answer.materialId, answer.embedId, answer.fieldName].join('.');
                  fieldAnswers[answerKey] = answer.value;
                }
                
                if (reply.state || reply.workspaceMaterialReplyId) {
                  var page = $(pageElements).filter('*[data-workspace-material-id="' + reply.workspaceMaterialId + '"]');
                  
                  if (reply.state) { 
                    page.attr('data-workspace-material-state', reply.state);
                  }

                  if (reply.workspaceMaterialReplyId) { 
                    page.attr('data-workspace-reply-id', reply.workspaceMaterialReplyId);
                  }
                }
              }
            }, this));

            // actual loading of pages
            $(pageElements).each($.proxy(function (index, page) {
              this.loadMaterial(page, fieldAnswers);
              $(page).muikkuMaterialPage({
                workspaceEntityId: this.options.workspaceEntityId
              });
            }, this));
          }       
        }, this));
      }
      else {
        $(pageElements).each($.proxy(function (index, page) {
          this.loadMaterial(page, fieldAnswers||{});
        }, this));
      }
    }
  }); // material loader widget
  
  $(document).on('taskFieldDiscovered', function (event, data) {
    var object = data.object;
    if ($(object).attr('type') == 'application/vnd.muikku.field.text') {
      var taskfieldWrapper = $('<div>')
        .addClass('textfield-wrapper');
      var input = $('<input>')
        .addClass('muikku-text-field')
        .attr({
          'type': "text",
          'size':data.meta.columns,
          'placeholder': data.meta.hint,
          'name': data.name
        })
        .val(data.value)
        .muikkuField({
          fieldName: data.name,
          materialId: data.materialId,
          embedId: data.embedId,
          meta: data.meta,
          readonly: data.readOnlyFields||false,
          trackChange: false,
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
          getCorrectAnswers: function() {
            var result = [];
            var meta = this.options.meta;
            if (meta.rightAnswers && meta.rightAnswers.length > 0) {
              for (var i = 0, l = meta.rightAnswers.length; i < l; i++) {
                if (meta.rightAnswers[i].correct) {
                  result.push(meta.rightAnswers[i].text);
                }
              }
            }
            return result;
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
          hasDisplayableAnswers: function() {
            return this.options.meta.rightAnswers && this.options.meta.rightAnswers.length > 0; 
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
      
      taskfieldWrapper.append(input);
      
      if (data.meta.hint != '') {
        taskfieldWrapper.append($('<span class="muikku-text-field-hint">' + data.meta.hint + '</span>'));  
        
        $(input).on("focus", function() {
          $(taskfieldWrapper).children('.muikku-text-field-hint')
            .css({
              visibility:"visible",
              top: input.outerHeight() + 4 + 'px'
            })
            .animate({
              opacity:1
              
            }, 300, function() {
            
            })
        });
        
        $(input).on("blur", function() {
          $(taskfieldWrapper).children('.muikku-text-field-hint')
            .css({
              visibility:"hidden"  
            })
            .animate({
              opacity:0
              
            }, 150, function() {
            
            })
        });
      }
      $(object).replaceWith(taskfieldWrapper);      
    }
  });
  
  $(document).on('taskFieldDiscovered', function (event, data) {
    var object = data.object;
    if ($(object).attr('type') == 'application/vnd.muikku.field.memo') {
      var field = $('<textarea>')
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
          meta: data.meta,
          fieldName: data.name,
          materialId: data.materialId,
          embedId: data.embedId,
          readonly: data.readOnlyFields||false,
          trackChange: false,
          canCheckAnswer: function() {
            return false;
          },
          hasDisplayableAnswers: function() {
            return this.hasExamples();
          },
          hasExamples: function () {
            var meta = this.options.meta;
            return meta.example && meta.example != '';
          },
          getCorrectAnswers: function() {
            return [];
          },
          getExamples: function () {
            var meta = this.options.meta;
            if (meta.example) {
              return [meta.example];
            } else {
              return [];
            }
          }
        });
      $(object).replaceWith(field);
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
              readonly: data.readOnlyFields||false,
              hasDisplayableAnswers: function() {
                return this.canCheckAnswer(); 
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
              },
              getCorrectAnswers: function() {
                var result = [];
                for (var i = 0, l = meta.options.length; i < l; i++) {
                  if (meta.options[i].correct == true) {
                    result.push(meta.options[i].text);
                  }
                }
                return result;
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
            readonly: data.readOnlyFields||false,
            answer: function(val) {
              if (val) {
                $(this.element).find('input').prop('checked', false);
                $(this.element).find('input[value="' + val + '"]').prop('checked', true);
              } else {
                return $(this.element).find('input:checked').val();
              }
            },
            hasDisplayableAnswers: function() {
              return this.canCheckAnswer(); 
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
            },
            getCorrectAnswers: function() {
              var result = [];
              for (var i = 0, l = meta.options.length; i < l; i++) {
                if (meta.options[i].correct == true) {
                  result.push(meta.options[i].text);
                }
              }
              return result;
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
        readonly: data.readOnlyFields||false,
        answer: function(val) {
          if (val) {
            $(this.element).find('input').prop('checked', false);
            $.each($.isArray(val) ? val : $.parseJSON(val), $.proxy(function (index, value) {
              $(this.element).find('input[value="' + value + '"]').prop('checked', true);
            }, this));
            
          } else {
            var values = [];
            $(this.element).find('input:checked').each(function() {
              values.push($(this).val());
            });

            return JSON.stringify(values); 
          }
        },
        hasDisplayableAnswers: function() {
          return this.canCheckAnswer(); 
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
        },
        getCorrectAnswers: function() {
          var result = [];
          for (var i = 0, l = meta.options.length; i < l; i++) {
            if (meta.options[i].correct == true) {
              result.push(meta.options[i].text);
            }
          }
          return result;
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
  
  function createEmbedId(parentIds) {
    return (parentIds.length ? parentIds.join(':') : null);
  }
  
  $(document).on('beforeHtmlMaterialRender', function (event, data) {
    $(data.element).find('object[type*="vnd.muikku.field"]').each(function (index, object) {
      var meta = $.parseJSON($(object).find('param[name="content"]').attr('value'));
      var embedId = createEmbedId(data.parentIds);
      var materialId = data.materialId;
      var valueKey = [materialId, embedId, meta.name].join('.');
      var value = data.fieldAnswers ? data.fieldAnswers[valueKey] : '';
      
      $(document).trigger('taskFieldDiscovered', {
        pageElement: data.pageElement,
        object: object,
        meta: meta,
        name: meta.name,
        embedId: embedId,
        materialId: materialId,
        value: value,
        readOnlyFields: data.readOnlyFields
      });
    });
  });
  
  $(document).on('afterHtmlMaterialRender', function (event, data) {
    
    /* If last element inside article is floating this prevents mentioned element from overlapping its parent container */
    $(data.pageElement)
      .append($('<div>').addClass('clear'));
    
    // Connect field support
    jsPlumb.ready(function() {
      $(data.pageElement).find('.muikku-connect-field-table').each(function (index, field) {
        var meta = $.parseJSON($(field).attr('data-meta'));
        $(field).muikkuConnectField({
          fieldName: $(field).data('field-name'),
          embedId: $(field).data('embed-id'),
          materialId: $(field).data('material-id'),
          meta: meta,
          readonly: data.readOnlyFields||false
        });
      });
    });
    
    // Lazy loading
    $(data.pageElement).find('img.lazy').lazyload();
    $(data.pageElement).find('.js-lazyyt').lazyYT();
    
    var maxFileSize = null;
    if ($("input[name='max-file-size']").length) {
      maxFileSize = Number($("input[name='max-file-size']").val());
    }
    
    // File field support
    $(data.pageElement).find('.muikku-file-field').each(function (index, field) {
      $(field)
        .muikkuFileField({
          maxFileSize: maxFileSize
        })
        .muikkuField({
          fieldName: $(field).data('field-name'),
          embedId: $(field).data('embed-id'),
          materialId: $(field).data('material-id'),
          readonly: data.readOnlyFields||false,
          answer: function (val) {
            // TODO: Support setter for files
            return JSON.stringify($(this.element).muikkuFileField('files'));
          },
          isReadonly: function () {
            return $(this.element).muikkuFileField("isReadonly");
          },
          setReadonly: function (readonly) {
            $(this.element).muikkuFileField("setReadonly", readonly);
          }
        });
    });
  });

}).call(this);
