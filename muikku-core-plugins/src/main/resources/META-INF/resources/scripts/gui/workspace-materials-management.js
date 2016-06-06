(function() {
  
  function createAddPageSectionLink() {
    return $('<div>')
      .addClass('workspace-materials-management-add')
      .append($('<span>').addClass('workspace-materials-management-line-separator'))
      .append($('<a>').addClass('workspaces-materials-management-add icon-add').attr('href', 'javascript:void(null)').append($('<span>').html(getLocaleText("plugin.workspace.materialsManagement.addNew"))));
  }
  
  function createFileUploader() {
    return $('<div>')
      .addClass('workspaces-materials-management-insert-file')
      .append($('<input>').attr('type', 'file'));
  }
  
  function enableFileUploader(element) {
    
    var maxFileSize = null;
    if ($("input[name='max-file-size']").length) {
      maxFileSize = Number($("input[name='max-file-size']").val());
    }
    
    $(element)
      .workspaceMaterialUpload({maxFileSize: maxFileSize})
      .on('fileUploaded', function (event, data) {
        var newPage = $('<section>')
          .addClass('workspace-materials-view-page material-management-view')
          .attr({
            'id': 'page-' + data.workspaceMaterialId,
            'data-material-title': data.title,
            'data-parent-id': data.parentId,
            'data-material-id': data.materialId,
            'data-material-type': 'binary',
            'data-workspace-material-id': data.workspaceMaterialId
          });
        $(element).after(newPage);
        $(element).workspaceMaterialUpload('reset');
        // Page
        $(document).muikkuMaterialLoader('loadMaterial', newPage);
        // TOC
        var tocItem = $('<li class="workspace-materials-toc-item " data-workspace-node-id="' + data.workspaceMaterialId + '" />');
        tocItem.append('<a href="#page-' + data.workspaceMaterialId + '">' + data.title + '</a>');
        tocItem.append('<span class="workspace-materials-toc-itemDragHandle icon-move ui-sortable-handle" />');
        if (data.nextSiblingId) {
          var nextSibling = $('li[data-workspace-node-id="' + data.nextSiblingId + '"]');
          if (nextSibling) {
            nextSibling.before(tocItem);
          }
        }
        else {
          var parent = $('ul[data-workspace-node-id="' + data.parentId + '"]');
          if (parent) {
            parent.append(tocItem);
          }
        } 
        // Add sections
        var uploader = createFileUploader();
        newPage.after(uploader);
        newPage.after(createAddPageSectionLink());
        enableFileUploader(uploader);
      })
      .on('fileDiscarded', function (event, data) {
        $(this).workspaceMaterialUpload('reset');
      });
  }
  
  function editPage(node) {
    var materialType = $(node).attr('data-material-type');
    var workspaceMaterialId = $(node).attr('data-workspace-material-id');
    if (materialType == 'folder') {
      // folder
      $(node).addClass("page-edit-mode");
      var pageContent = $(node).find('.page-content');
      var editor = $('<div>').addClass('workspace-material-folder-editor-title-wrapper');
      var textfield = $("<input>").attr('type', 'text').addClass('workspace-material-folder-editor-title').val($(pageContent).text());
      editor.append(textfield);
      $(pageContent).replaceWith(editor);
      textfield.focus();
      textfield.select();
      $(textfield).on('keydown', function (event, data) {
        if (event.keyCode == 13) {
          closeEditor($('#page-' + workspaceMaterialId));
        }
      });
    }
    else if (materialType == 'binary') {
      // binary
      $(node).addClass("page-edit-mode");
      var pageContent = $(node).find('.page-content');
      var editor = $('<div>').addClass('workspace-material-binary-editor-title-wrapper');
      var textfield = $("<input>").attr('type', 'text').addClass('workspace-material-binary-editor-title').val($(node).attr('data-material-title'));
      editor.append(textfield);
      $(pageContent).replaceWith(editor);
      textfield.focus();
      textfield.select();
      $(textfield).on('keydown', function (event, data) {
        if (event.keyCode == 13) {
          closeEditor($('#page-' + workspaceMaterialId));
        }
      });
    }
    else if (materialType == 'html') {
      // html
      var materialId = $(node).attr('data-material-id');
      var materialTitle = $(node).attr('data-material-title');
      var path = $(node).attr('data-path');
      var workspaceMaterialId = $(node).attr('data-workspace-material-id');
      var editorName = 'workspaceMaterialEditor' + (materialType.substring(0, 1).toUpperCase() + materialType.substring(1));
      var pageElement = $('#page-' + workspaceMaterialId);
      var pageSection = $(pageElement).closest(".workspace-materials-view-page");
      var materialPath = $('.materialsBaseUrl').val() + '/' + path;
      
      mApi().materials.material.workspaceMaterials
        .read(materialId)
        .callback(function (err, workspaceMaterials) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            var workspaceMaterialCount = workspaceMaterials ? workspaceMaterials.length : 0;
            
            if (workspaceMaterialCount > 1) {
              $('.notification-queue').notificationQueue('notification', 'warn', getLocaleText("plugin.workspace.materialsManagement.linkedMaterialCountMessage", workspaceMaterialCount));
            }
          }
        });
      
      pageSection.addClass("page-edit-mode");
      
      var editor = pageElement[editorName];
      if (editor) {
        $(pageElement).find('.page-content').remove();
        
        editor.call(pageElement, {
          materialId: materialId,
          materialTitle: materialTitle,
          materialPath: materialPath
        });
        
      } else {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.workspace.materialsManagement.missingEditor", materialType));
      }
    }
  }

  function isPageInEditMode(node) {
    return $(node).hasClass('page-edit-mode');
  }
  
  function closeEditor(node, loadContent) {
    var materialType = $(node).attr('data-material-type');
    if (materialType == 'folder') {
      // folder
      var title = node.find('.workspace-material-folder-editor-title').val();
      var nextSibling = node.nextAll('.folder').first();
      var nextSiblingId = nextSibling.length > 0 ? nextSibling.attr('data-workspace-material-id') : null;
      var workspaceId = $('.workspaceEntityId').val();
      var hidden = node.hasClass('item-hidden');
      node.removeClass("page-edit-mode");

      mApi({async: false}).workspace.workspaces.folders.read(workspaceId, node.attr('data-workspace-material-id')).callback(function (err, folder) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          folder.title = title;
          mApi({async: false}).workspace.workspaces.folders.update(workspaceId, node.attr('data-workspace-material-id'), folder).callback(function (err, updatedFolder) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              var pageElement = $('<div>').attr('class', 'page-content').text(title);
              var textfield = node.find('.workspace-material-folder-editor-title');
              textfield.off();
              var editor = node.find('.workspace-material-folder-editor-title-wrapper');
              editor.replaceWith(pageElement);
              // #1272 folder path
              $(node).attr('data-path', updatedFolder.path);
              $(node).attr('data-material-title', updatedFolder.title);
              // #1272 folder children paths
              var childMaterials = $(node).nextAll('section[data-parent-id=' + $(node).attr('data-workspace-material-id') + ']');
              for (var i = 0; i < childMaterials.length; i++) {
                var newPath = $(childMaterials[i]).attr('data-path'); 
                newPath = updatedFolder.path + '/' + newPath.split('/')[1];
                $(childMaterials[i]).attr('data-path', newPath);
              }
              // TOC
              var tocElement = $("a[href*='#page-" + $(node).attr('data-workspace-material-id') + "']");
              if (tocElement) {
                $(tocElement).text(title);
              }
            }
          });
        }
      });
    }
    else if (materialType == 'binary') {
      // binary
      var title = node.find('.workspace-material-binary-editor-title').val();
      var nextSibling = node.nextAll('.folder').first();
      var nextSiblingId = nextSibling.length > 0 ? nextSibling.attr('data-workspace-material-id') : null;
      var workspaceId = $('.workspaceEntityId').val();
      var hidden = node.hasClass('item-hidden');
      node.removeClass("page-edit-mode");

      mApi({async: false}).workspace.workspaces.materials.read(workspaceId, node.attr('data-workspace-material-id')).callback(function (err, binary) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          binary.title = title;
          mApi({async: false}).workspace.workspaces.materials.update(workspaceId, node.attr('data-workspace-material-id'), binary).callback(function (err, html) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              var textfield = node.find('.workspace-material-binary-editor-title');
              textfield.off();
              node.attr('data-material-title', title);
              node.empty();
              $(document).muikkuMaterialLoader('loadMaterial', node);
              // TOC
              var tocElement = $("a[href*='#page-" + $(node).attr('data-workspace-material-id') + "']");
              if (tocElement) {
                $(tocElement).text(title);
              }
            }
          });
        }
      });
    }
    else { 
      // html
      var editorName = 'workspaceMaterialEditor' + (materialType.substring(0, 1).toUpperCase() + materialType.substring(1));
      var editor = node[editorName];
      if (editor) {
        editor.call(node, 'destroy');
        node.removeClass("page-edit-mode");
      }
      if (loadContent !== false) {
        var worker = new Worker("/scripts/gui/workspace-material-loader.js");
        worker.onmessage = $.proxy(function(response) {
          var material = $.parseJSON(response.data.html);
          $(node).attr('data-material-content', material.html);
          $(node).attr('data-material-current-revision', material.currentRevision);
          $(node).attr('data-material-published-revision', material.publishedRevision);
          node.empty();
          $(document).muikkuMaterialLoader('loadMaterial', node);
        }, this);
        worker.postMessage({
          materialId: $(node).attr('data-material-id'),
          workspaceMaterialId: $(node).attr('data-workspace-material-id') 
        });
      }
    }
  }
  
  function confirmSectionDeletion(confirmCallback) {
    renderDustTemplate('workspace/materials-management-section-delete-confirm.dust', { }, $.proxy(function (text) {
      var dialog = $(text);
      $(text).dialog({
        modal: true, 
        resizable: false,
        width: 360,
        dialogClass: "workspace-materials-management-dialog",
        buttons: [{
          'text': dialog.data('button-delete-text'),
          'class': 'delete-button',
          'click': function(event) {
            $(this).dialog().remove();
            confirmCallback();
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog().remove();
          }
        }]
      });
    }, this));
  }

  function confirmPageDeletion(confirmCallback) {
    renderDustTemplate('workspace/materials-management-page-delete-confirm.dust', { }, $.proxy(function (text) {
      var dialog = $(text);
      $(text).dialog({
        modal: true, 
        resizable: false,
        width: 360,
        dialogClass: "workspace-materials-management-dialog",
        buttons: [{
          'text': dialog.data('button-delete-text'),
          'class': 'delete-button',
          'click': function(event) {
            $(this).dialog().remove();
            confirmCallback();
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog().remove();
          }
        }]
      });
    }, this));
  }
  
  function deletePage(workspaceMaterialId, workspaceId, removeAnswers, errorCallback) {
    mApi({async: false}).workspace.workspaces.materials.del(workspaceId,workspaceMaterialId, {}, {removeAnswers: removeAnswers}).callback($.proxy(function (err, jqXHR){
      if (err) {
        errorCallback(err, jqXHR);
      } else {
        // TODO: animation won't work
        var page = $('#page-' + workspaceMaterialId);
        $(page)
          .animate({
            height:0,
            opacity: 0
          }, {
            duration : 500,
            easing : "easeInOutQuint",
            complete: function() {
              page.nextAll('.workspace-materials-management-add').first().remove();
              page.nextAll('.workspaces-materials-management-insert-file').first().remove();
              page.remove();
            }
          });
        // TOC
        var tocElement = $("a[href*='#page-" + workspaceMaterialId + "']");
        if (tocElement) {
          var tocSection = tocElement.closest('.workspace-materials-toc-section');
          tocElement.remove();
          if (tocSection) {
            tocSection.sortable('refresh');
          }
        }
      }
    }, this));
  }

  function deleteFolder(workspaceMaterialId, workspaceId, removeAnswers, errorCallback) {
    mApi({async: false}).workspace.workspaces.folders.del(workspaceId,workspaceMaterialId).callback($.proxy(function (err, jqXHR){
      if (err) {
        errorCallback(err, jqXHR);
      } else {
        // TODO: animation won't work
        var page = $('#page-' + workspaceMaterialId);
        $(page)
          .animate({
            height:0,
            opacity: 0
          }, {
            duration : 500,
            easing : "easeInOutQuint",
            complete: function() {
              page.nextAll('.workspace-materials-management-add').first().remove();
              page.nextAll('.workspaces-materials-management-insert-file').first().remove();
              page.remove();
            }
          });
        // TOC
        var tocElement = $('ul[data-workspace-node-id="' + workspaceMaterialId + '"]');
        if (tocElement) {
          tocElement.remove();
        }
        $('.workspace-materials-toc-root').sortable('refresh');
      }
    }, this));
  }
  
  function getPagePublishedRevision(workspaceMaterialId) {
    return parseInt($('.workspace-materials-view-page[data-workspace-material-id="' + workspaceMaterialId + '"] input[name="published-revision"]').val()||'0');
  }
  
  function setPagePublishedRevision(workspaceMaterialId, revision) {
    var page = $('.workspace-materials-view-page[data-workspace-material-id="' + workspaceMaterialId + '"]');
    page.find('input[name="published-revision"]').val(revision);
    
    if (getPageCurrentRevision(workspaceMaterialId) != getPagePublishedRevision(workspaceMaterialId)) {
      page.find('a.publish-page').removeClass('disabled');
      page.find('a.revert-page').removeClass('disabled');
    } else {
      page.find('a.publish-page').addClass('disabled');
      page.find('a.revert-page').addClass('disabled');
    }
  }
  
  function getPageCurrentRevision(workspaceMaterialId) {
    return parseInt($('.workspace-materials-view-page[data-workspace-material-id="' + workspaceMaterialId + '"] input[name="current-revision"]').val()||'0');
  }
  
  function setPageCurrentRevision(workspaceMaterialId, revision) {
    var page = $('.workspace-materials-view-page[data-workspace-material-id="' + workspaceMaterialId + '"]');
    page.find('input[name="current-revision"]').val(revision);

    if (getPageCurrentRevision(workspaceMaterialId) != getPagePublishedRevision(workspaceMaterialId)) {
      page.find('a.publish-page').removeClass('disabled');
      page.find('a.revert-page').removeClass('disabled');
    } else {
      page.find('a.publish-page').addClass('disabled');
      page.find('a.revert-page').addClass('disabled');
    }
  }
  
  $(document).on('click', '.delete-page', function (event, data) {
    var workspaceMaterialId = $(this).attr('data-workspace-material-id');
    var workspaceId = $('.workspaceEntityId').val();
    if ($(this).attr('data-material-type') === 'folder') {
      if($('section[data-parent-id="'+workspaceMaterialId+'"]').length > 0){
        //TODO: create proper error dialog
        alert(getLocaleText('plugin.workspace.materialsManagement.sectionDeleteNotEmptyMessage')); 
      }
      else {
        confirmSectionDeletion($.proxy(function () {
          deleteFolder(workspaceMaterialId, workspaceId, false, function (err, jqXHR) {
          });
        }, this));
      }
    }
    else {
      confirmPageDeletion($.proxy(function () {
        deletePage(workspaceMaterialId, workspaceId, false, function (err, jqXHR) {
          if (jqXHR.status == 409) {
            var response = $.parseJSON(jqXHR.responseText);
            if (response && response.reason == 'CONTAINS_ANSWERS') {
              confirmAnswerRemovalDelete(function () {
                deletePage(workspaceMaterialId, workspaceId, true, function (err, jqXHR) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                });
              });
            } else {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
          } else {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }    
        });
      }, this));
    }
  });
  
  $.widget("custom.muikkuPageLicense", {
    _create : function() {
      this.element.addClass('materials-management-page-license-widget');
      this._load($.proxy(function () {
        this.element.find('input[name="license"]').licenseSelector({
          locale: getLocale() == 'fi' ? 'fi' : 'en',
          types: {
            'ogl': false
          },
          locales: {
            en: { 
              noneLabel: getLocaleText('plugin.workspace.materialsManagement.inheritedLicenseLabel')
            },
            fi: { 
              noneLabel: getLocaleText('plugin.workspace.materialsManagement.inheritedLicenseLabel')
            }
          }
        });
      }, this));
    },
    
    _load: function (callback) {
      var data = {};
      renderDustTemplate("workspace/materials-management-page-license.dust", data, $.proxy(function (html) {
        this.element.html(html);
        callback();
      }, this));
    }
  });  
  
  $.widget("custom.muikkuPageAttachments", {
    _create : function() {
      this.element.addClass('materials-management-page-attachment-widget');
      
      this._startLoading();
      
      this._workspaceUrl = null;
      
      mApi({async: false}).materials.metakeys.read().callback($.proxy(function (metaErr, metaKeys) {
        if (metaErr) {
          $('.notification-queue').notificationQueue('notification', 'error', metaErr);
        } else {
          this._metaKeys = metaKeys;
          
          mApi({async: false}).workspace.workspaces.read(this.options.workspaceEntityId).callback($.proxy(function (workspaceErr, workspaceEntity) {
            if (workspaceErr) {
              $('.notification-queue').notificationQueue('notification', 'error', workspaceErr);
            } else {
              this._workspaceUrl = CONTEXTPATH + '/workspace/' + workspaceEntity.urlName;
              
              mApi({async: false}).workspace.workspaces.materials.read(this.options.workspaceEntityId, {
                parentId: this.options.parentId
              })
              .on('$', function (workspaceMaterial, callback) {
                mApi({async: false}).materials.binary.read(workspaceMaterial.materialId).callback(function (binaryErr, binaryMaterial) {
                  if (binaryErr) {
                    $('.notification-queue').notificationQueue('notification', 'error', binaryErr);
                  } else {
                    workspaceMaterial.material = binaryMaterial;
                    callback();
                  }
                });   
              })
              .callback($.proxy(function (err, workspaceMaterials) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                } else {
                  
                  var data = {
                    attachments: $.map(workspaceMaterials||[], $.proxy(function (workspaceMaterial) {
                      return {
                        workspaceMaterialId: workspaceMaterial.id,
                        materialId: workspaceMaterial.material.id,
                        title: workspaceMaterial.material.title,
                        contentType: workspaceMaterial.material.contentType,
                        url: this._workspaceUrl + '/materials/' + workspaceMaterial.path,
                        upload: false,
                        metaKeys: this._metaKeys
                      };
                    }, this))
                  };
        
                  renderDustTemplate('workspace/materials-management-page-attachments.dust', data, $.proxy(function (text) {
                    this.element.html(text);
                    
                    this._uploadContainer = this.element.find('.materials-management-page-attachments-upload-container');
                    this._attachmentsContainer = this.element.find('.materials-management-page-attachments-container');
                    
                    var fileInput = this.element.find('input[type="file"]');
                    fileInput.fileupload({
                      url : CONTEXTPATH + '/tempFileUploadServlet',
                      dropZone: fileInput.closest('.materials-management-page-attachments-upload-container'),
                      autoUpload : true,
                      add : $.proxy(this._onFileUploadAdd, this),
                      done : $.proxy(this._onFileUploadDone, this),
                      progress : $.proxy(this._onFileUploadProgress, this)
                    });

                    this.element.on('click', '.materials-management-page-attachment-action-download', $.proxy(this._onAttachmentDownloadClick, this));
                    this.element.on('click', '.materials-management-page-attachment-action-delete', $.proxy(this._onAttachmentDeleteClick, this));
                    this.element.on("click", '.materials-management-page-attachment', $.proxy(this._onAttchmentClick, this));
                    this.element.on("focus", '.materials-management-page-attachment-meta input', $.proxy(this._onMetaFocus, this));
                    this.element.on("blur", '.materials-management-page-attachment-meta input', $.proxy(this._onMetaBlur, this));
                    
                    this._stopLoading();
                  }, this));
                }
              }, this));
            }
          }, this));
        }
      }, this));
    },
    
    _startLoading: function () {
      // TODO: start loading animation
    },

    _stopLoading: function () {
      // TODO: end loading animation
    },
    
    _confirmRemoval: function (materialTitle, confirmCallback) {
      renderDustTemplate('workspace/materials-management-page-attachment-remove-confirm.dust', { 
        materialTitle: materialTitle
      }, $.proxy(function (text) {
        var dialog = $(text);
        $(text).dialog({
          modal: true, 
          resizable: false,
          width: 360,
          dialogClass: "workspace-materials-management-dialog",
          buttons: [{
            'text': dialog.data('button-remove-text'),
            'class': 'delete-button',
            'click': function(event) {
              $(this).dialog().remove();
              confirmCallback();
            }
          }, {
            'text': dialog.data('button-cancel-text'),
            'class': 'cancel-button',
            'click': function(event) {
              $(this).dialog().remove();
            }
          }]
        });
      }, this));
    },

    _onFileUploadAdd : function(e, data) {
      renderDustTemplate('workspace/materials-management-page-attachment.dust', {
        workspaceMaterialId: 'UPLOADING',
        materialId: 'UPLOADING',
        title: data.files[0].name,
        contentType: data.files[0].type,
        url: getLocaleText('plugin.workspace.materialsManagement.uploadingFileName'),
        upload: true,
        metaKeys: this._metaKeys
      }, $.proxy(function (text) {
        data.context = $(text);
        data.context  
          .find('.muikku-page-attachments-upload-progress')
          .progressbar({
            value: 0
          });
        
        $('.materials-management-page-attachments-container').append(data.context);
        data.submit();
      }, this));
    },
    
    _onFileUploadDone: function(e, data) {
      data.context.find('.muikku-page-attachments-upload-progress').progressbar("value", 100);
      
      var fileId = data._response.result.fileId;
      var fileName = data.files[0].name;
      var contentType = data.files[0].type||'application/octet-stream';
      
      mApi({async: false}).materials.binary.create({
        title: fileName,
        contentType: contentType,
        fileId: fileId
      })
      .callback($.proxy(function (materialErr, materialResult) {
        if (materialErr) {
          $('.notification-queue').notificationQueue('notification', 'error', materialErr);
        } else {
          mApi({async: false}).workspace.workspaces.materials.create(this.options.workspaceEntityId, {
            materialId: materialResult.id,
            parentId: this.options.parentId
          }, {
            updateLinkedMaterials: true
          })
          .callback($.proxy(function (workspaceMaterialErr, workspaceMaterialResult) {
            if (workspaceMaterialErr) {
              $('.notification-queue').notificationQueue('notification', 'error', workspaceMaterialErr);
            } else {
              data.context.attr('data-workspace-material-id', workspaceMaterialResult.id);
              data.context.attr('data-material-id', materialResult.id);
              data.context.find('.muikku-page-attachments-upload-progress').remove();
              data.context.find('.materials-management-page-attachment-url').text(this._workspaceUrl + '/materials/' + workspaceMaterialResult.path);
            }
          }, this));
        }
      }, this));
    },
    
    _onFileUploadProgress: function(e, data) {
      var progress = parseInt(data.loaded / data.total * 100, 10);
      data.context.find('.muikku-page-attachments-upload-progress').progressbar("value", progress);
    },

    _onAttachmentDownloadClick: function (event) {
      var materialId = $(event.target).closest('.materials-management-page-attachment').attr('data-material-id');
      if (materialId) {
        window.location.href = '/rest/materials/binary/' + materialId + '/download';
      }
    },
    
    _onAttachmentDeleteClick: function (event) {
      var attachmentElement = $(event.target).closest('.materials-management-page-attachment');
      var workspaceMaterialId = attachmentElement.attr('data-workspace-material-id');
      var materialTitle = attachmentElement.find('.materials-management-page-attachment-title').text();
      if (workspaceMaterialId) {
        this._confirmRemoval(materialTitle, $.proxy(function () {
          
          mApi({async: false}).workspace.workspaces.materials.del(this.options.workspaceEntityId, workspaceMaterialId, {}, {
            updateLinkedMaterials: true 
          })
          .callback($.proxy(function (err) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              attachmentElement.remove();
            }
          }, this));
          
        }, this));
      }
    },
    
    _onAttchmentClick: function (event) {
      var selectedAttachment = $(event.target).closest('.materials-management-page-attachment');
      if (!selectedAttachment.hasClass('materials-management-page-attachment-selected')) {
        this.element.find('.materials-management-page-attachment').removeClass('materials-management-page-attachment-selected');
        var materialId = selectedAttachment.attr('data-material-id');
        
        var materialId = selectedAttachment.attr('data-material-id');
        if (materialId) {
          mApi({async: false}).materials.materials.meta.read(materialId).callback($.proxy(function (err, metas) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              metas = metas||[];
              for (var i = 0, l = metas.length; i < l; i++) {
                selectedAttachment
                  .find('input[name="' + metas[i].key + '"]')
                  .attr('data-exists', 'true')
                  .val(metas[i].value);
              }
            }
          }, this));
        }
        
        selectedAttachment.addClass('materials-management-page-attachment-selected');
      }
    },

    _onMetaFocus: function (event) {
      $(event.target)
        .removeClass('materials-management-page-attachment-meta-saved')
        .addClass('materials-management-page-attachment-meta-unsaved');
    },
    
    _onMetaBlur: function (event) {
      $(event.target)
        .addClass('materials-management-page-attachment-meta-saved')
        .removeClass('materials-management-page-attachment-meta-unsaved');
      
      var attachmentElement = $('.materials-management-page-attachment');
  
      var fieldElement = $(event.target);
      var value = fieldElement.val();
      var key = fieldElement.attr('name');
      var exists = fieldElement.attr('data-exists') == 'true';
      var workspaceMaterialId = $(attachmentElement).attr('data-workspace-material-id');
      var materialId = $(attachmentElement).attr('data-material-id');
      
      if (!exists) {
        mApi({async: false}).materials.materials.meta.create(materialId, {
          'materialId': materialId,
          'key': key,
          'value': value
        })
        .callback($.proxy(function (err, meta) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            fieldElement.attr('data-exists', 'true');
          }
        }, this));
      } else {
        mApi({async: false}).materials.materials.meta.update(materialId, key, {
          'materialId': materialId,
          'key': key,
          'value': value
        })
        .callback($.proxy(function (err, meta) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
        }, this));
      }
    }
    
  });
  
  $(document).on('click', '.page-attachments', function (event, data) {
    var workspaceEntityId = $('.workspaceEntityId').val();
    var workspaceMaterialId = $(event.target).attr('data-workspace-material-id');
    var section = $(event.target)
      .closest('section');
    
    section.addClass('workspace-materials-management-editing-attachments');
    
    section.find('.workspace-materials-management-view-page-controls')
      .after($('<div>').muikkuPageAttachments({
        workspaceEntityId: workspaceEntityId,
        parentId: workspaceMaterialId
      }));
  });
  
  $(document).on('click', '.page-license', function (event, data) {
    var workspaceEntityId = $('.workspaceEntityId').val();
    var workspaceMaterialId = $(event.target).attr('data-workspace-material-id');
    var section = $(event.target).closest('section');
    
    section.addClass('workspace-materials-management-editing-license');
    
    section.find('.workspace-materials-management-view-page-controls')
      .after($('<div>').muikkuPageLicense({
        workspaceEntityId: workspaceEntityId,
        parentId: workspaceMaterialId
      }));
  });
  
  $(document).on('click', '.close-attachments-editor', function (event, data) {
    var section = $(event.target)
      .closest('section');
    
    section.find('.materials-management-page-attachment-widget')
      .remove();
    
    section.removeClass('workspace-materials-management-editing-attachments');
  });
  
  function toggleVisibility(node, hidden) {
    var _node = node;
    var _hidden = hidden;
    var workspaceId = $('.workspaceEntityId').val();
    var nextSibling = node.nextAll('.workspace-materials-view-page').first();
    var nextSiblingId = nextSibling.length > 0 ? nextSibling.attr('data-workspace-material-id') : null;
    var workspaceMaterialId = node.attr('data-workspace-material-id');
    var materialType = node.attr('data-material-type');
    if (materialType == 'folder') {
      mApi({async: false}).workspace.workspaces.folders.read(workspaceId, node.attr('data-workspace-material-id')).callback(function (err, folder) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          folder.hidden = hidden;
          mApi({async: false}).workspace.workspaces.folders.update(workspaceId, node.attr('data-workspace-material-id'), folder).callback(function (err, html) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              toggleNodeVisibilityUi(node, hidden);
            }
          });
        }
      });
    }
    else {
      mApi({async: false}).workspace.workspaces.materials.read(workspaceId, node.attr('data-workspace-material-id')).callback(function (err, material) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          material.hidden = hidden;
          mApi({async: false}).workspace.workspaces.materials.update(workspaceId, node.attr('data-workspace-material-id'), material).callback(function (err, html) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              toggleNodeVisibilityUi(node, hidden);
            }
          });
        }
      });
    }
  }
  
  function toggleNodeVisibilityUi(node, hidden) {
    var materialType = node.attr('data-material-type');
    var workspaceMaterialId = node.attr('data-workspace-material-id');
    if (hidden) {
      // Node itself
      node.addClass('item-hidden');
      // Node toolbar
      var hideIcon = node.find('.hide-page')
      hideIcon.removeClass('icon-hide').addClass('icon-show');
      hideIcon.attr('title', getLocaleText('plugin.workspace.materialsManagement.materialShowTooltip'));
      hideIcon.find('span').text(getLocaleText('plugin.workspace.materialsManagement.materialShowTooltip'));
      // TOC
      var tocElement = $("a[href*='#page-" + workspaceMaterialId + "']");
      tocElement.parent().addClass('item-hidden');
      // Folder children
      if (materialType == 'folder') {
        node.nextUntil('.folder').filter('section').addClass('parent-hidden');
        var section = tocElement.closest('.workspace-materials-toc-section');
        section.find('.workspace-materials-toc-item').addClass('parent-hidden');
      }
    }
    else {
      // Node itself
      node.removeClass('item-hidden');
      // Node toolbar
      var hideIcon = node.find('.hide-page')
      hideIcon.removeClass('icon-show').addClass('icon-hide');
      hideIcon.attr('title', getLocaleText('plugin.workspace.materialsManagement.materialHideTooltip'));
      hideIcon.find('span').text(getLocaleText('plugin.workspace.materialsManagement.materialHideTooltip'));
      // TOC
      var tocElement = $("a[href*='#page-" + workspaceMaterialId + "']");
      tocElement.parent().removeClass('item-hidden');
      // Folder children
      if (materialType == 'folder') {
        node.nextUntil('.folder').filter('section').removeClass('parent-hidden');
        var section = tocElement.closest('.workspace-materials-toc-section');
        section.find('.workspace-materials-toc-item').removeClass('parent-hidden');
      }
    }
  }
  
  function scrollToPage(workspaceMaterialId, animate) {
    var topOffset = 30;
    var scrollTop = $('#page-' + workspaceMaterialId).offset().top - topOffset;
    if (animate) {
      $(window).data('scrolling', true);
      
      $('html, body').stop().animate({
        scrollTop : scrollTop
      }, {
        duration : 500,
        easing : "easeInOutQuad",
        complete : function() {
          $('li.active').removeClass('active');
          $('a[href="#page-' + workspaceMaterialId + '"]').parent().addClass('active');
          window.location.hash = 'p-' + workspaceMaterialId;
          $(window).data('scrolling', false);
        }
      });
    } else {
      $('html, body').stop().scrollTop(scrollTop);
      $('li.active').removeClass('active');
      $('a[href="#page-' + workspaceMaterialId + '"]').parent().addClass('active');
      window.location.hash = 'p-' + workspaceMaterialId;
    }
  }
  
  $(document).on('click', '.workspace-materials-toc-item a', function (event) {
    event.preventDefault();
    scrollToPage($($(this).attr('href')).data('workspaceMaterialId'), true);
  });
  
  $(document).on('click', '.workspace-materials-toc-subtitle a', function (event) {
    event.preventDefault();
    scrollToPage($($(this).attr('href')).data('workspaceMaterialId'), true);
  });
  
  function moveWorkspaceMaterial(parentId, workspaceNodeId, nextSiblingId) {
    if (isNaN(parentId)) {
      return;
    }
    if (isNaN(nextSiblingId)) {
      nextSiblingId = null;
    }
    var workspaceId = $('.workspaceEntityId').val();
    mApi({async: false}).workspace.workspaces.materials.read(workspaceId, workspaceNodeId).callback(function(err, material) {
      material.parentId = parentId;
      material.nextSiblingId = nextSiblingId;
      mApi({async: false}).workspace.workspaces.materials.update(workspaceId, workspaceNodeId, material).callback(function (err, html) {
        if (!err) {
          // Move the "add page" boxes (2) first
          $("#page-" + workspaceNodeId).prev().insertBefore("#page-" + nextSiblingId);
          $("#page-" + workspaceNodeId).prev().insertBefore("#page-" + nextSiblingId);
          $("#page-" + workspaceNodeId).insertBefore($("#page-" + nextSiblingId).prev().prev());
        }
        else {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
      });
    });
  }

  function moveWorkspaceFolder(workspaceNodeId, nextSiblingId) {
    var workspaceId = $('.workspaceEntityId').val();
    mApi({async: false}).workspace.workspaces.folders.read(workspaceId, workspaceNodeId).callback(function(err, folder) {
      
        if (isNaN(nextSiblingId)) {
          nextSiblingId = null;
        }
       
        folder.nextSiblingId = nextSiblingId;
      
        mApi({async: false}).workspace.workspaces.folders.update(workspaceId, workspaceNodeId, folder).callback(function (err, html) {
          
          if (!err) {
              location.reload(); //TODO: move all child nodes without reloading
          } else {
              $('.notification-queue').notificationQueue('notification', 'error', err);
          }
        });
    });
  }

  $(document).ready(function() {
    
    $("#materialsScrollableTOC").perfectScrollbar({
      wheelSpeed:3,
      swipePropagation:false
    });
    
    $(window).data('initializing', true);
    
    // TOC sorting - DOES NOT SUPPORT NESTING, only dragging items from section to section. 
    // If nesting is needed we have to use some other plug-in instead of JQeury.UI sortable
    
    $('.workspace-materials-toc-root').sortable({
      axis: "y",
      items: ">ul.workspace-materials-toc-section",
      cursor: "crosshair",
      handle: "span.workspace-materials-toc-sectionDragHandle",
      containment: ".workspace-materials-toc-root",
      connectWith: ".workspace-materials-toc-root",
      opacity: 0.35,
      revert: 500,
      placeholder: "sortable-section-placeholder",
      forcePlaceholderSize: true,
      stop: function(event, ui) {
        var workspaceNodeId = parseInt($(ui.item).attr('data-workspace-node-id'), 10);
        var nextSiblingId = parseInt($(ui.item).next('.workspace-materials-toc-section').attr('data-workspace-node-id'), 10);
        
        moveWorkspaceFolder(workspaceNodeId, nextSiblingId);

        if (!$(ui.item).hasClass("active")) {
          $(ui.item)
          .addClass("no-hover")
          .animate({
            backgroundColor: "#edeea2",
            color: "#000"
          },{
            duration:1500,
            easing: "easeInOutQuint",
            complete: function() {

              $(this).animate({
                backgroundColor: "transparent",
                color: "#000"
              }, {
                duration:1500,
                easing: "easeInOutQuint",
                complete: function() {
                  $(this).css({
                    backgroundColor: "",
                  })
                  .removeClass("no-hover");
                  $(this).removeAttr("style");
                }
              });
            }
          });
        }
      }
    });
    
    $('.workspace-materials-toc-section').each(function(index, node) {
      setupSortableSection(node);
    });

    $(document).muikkuMaterialLoader({
      workspaceEntityId: $('.workspaceEntityId').val(),
      baseUrl: $('.materialsBaseUrl').val(),
      dustTemplate: 'workspace/materials-management-page.dust',
      renderMode: {
        "html": "dust"
      }
    })
    .muikkuMaterialLoader('loadMaterials', $('.workspace-materials-view-page'));

    $('.workspace-materials-view-page').waypoint(function(direction) {
      if ($(window).data('scrolling') !== true && $(window).data('initializing') !== true) {
        var workspaceMaterialId = $(this).data('workspace-material-id');
        $('li.active').removeClass('active');
        $('a[href="#page-' + workspaceMaterialId + '"]').parent().addClass('active');
        window.location.hash = 'p-' + workspaceMaterialId;
      }
    }, {
      offset: '60%'
    });
    
    $('.workspaces-materials-management-insert-file').each(function(index, element) {
      enableFileUploader(element);
    });
    
    $(window).data('initializing', false);
  });
  
  $(window).load(function() {
    if (window.location.hash && (window.location.hash.indexOf('p-') > 0)) {
      scrollToPage(window.location.hash.substring(3), false);
    }    
    
    // Workspace's Materials's TOC
    if ($('#workspaceMaterialsManagementTOCWrapper').length > 0) {
      
      var height = $(window).height();
      var tocWrapper = $('#workspaceMaterialsManagementTOCContainer');
      var navWrapper = $('#workspaceMaterialsManagementNav');
      var tocOpenCloseButton = $('.wi-workspace-materials-full-screen-navi-button-toc > .icon-navicon');
      var contentPageContainer = $('#contentWorkspaceMaterialsManagement');
      
      var contentOffset;
      var windowMinWidth;
      var tocWrapperWidth = tocWrapper.width();
      var navWrapperWidth = navWrapper.width();
      var tocWrapperLeftMargin = "-" + (tocWrapperWidth - navWrapperWidth) + "px";
      var contentMinLeftOffset = tocWrapperWidth + navWrapperWidth + 20;
      var contentPageContainerRightPadding = 20;

      if (tocWrapper.length > 0) {
        tocWrapper
        .css({
          height: height,
          "margin-left" : navWrapperWidth
        });
        
        contentPageContainer.css({
          paddingLeft: contentMinLeftOffset,
          paddingRight: contentPageContainerRightPadding
        });
      }
      
      $(window).resize(function(){
        height = $(window).height();
        tocWrapper.height(height);
        contentOffset = contentPageContainer.offset();
        windowMinWidth = contentPageContainer.width() + contentMinLeftOffset*2;
        
        // Lets prevent page content to slide under TOC when browser window is been resized
        if ($('#workspaceMaterialsManagementTOCContainer:visible').length !== 0) {
          
          if (contentOffset.left < contentMinLeftOffset) {
            contentPageContainer.css({
              paddingLeft: contentMinLeftOffset,
              paddingRight: contentPageContainerRightPadding
            });
          } 
        } else {
          contentPageContainer.css({
            paddingLeft: navWrapperWidth + 20,
            paddingRight: contentPageContainerRightPadding
          });
        }
        
      });

      // Prevent icon-navicon link from working normally
      $(tocOpenCloseButton).bind('click', function(e) {
        e.stopPropagation();
      });

      $(tocOpenCloseButton).click(function() {
        // If tocWrapper is visible
        if ($('#workspaceMaterialsManagementTOCContainer:visible').length !== 0) {
          contentPageContainer
          .animate({
            paddingLeft: navWrapperWidth,
            paddingRight: contentPageContainerRightPadding
          },{
            duration:500,
            easing: "easeInOutQuint"
          });
          
          tocWrapper
          .clearQueue()
          .stop()
          .animate({
            "margin-left" : tocWrapperLeftMargin,
          }, {
            duration:500,
            easing: "easeInOutQuint",
            complete: function () {
              $(this).hide();
            }
          });
        // If tocWrapper is not visible  
        } else {
          contentPageContainer
          .animate({
            paddingLeft: contentMinLeftOffset,
            paddingRight: contentPageContainerRightPadding
          },{
            duration:500,
            easing: "easeInOutQuint"
          });
          tocWrapper
          .show()
          .clearQueue()
          .stop()
          .animate({
            "margin-left" : navWrapperWidth,
          }, {
            duration:500,
            easing: "easeInOutQuint",
            complete: function () {
            }
          });
        }
      });
      
      // Prevent page scroll happening if TOC scroll reaches bottom
      $('.workspace-materials-toc-content-inner').on('DOMMouseScroll mousewheel', function(ev) {
        var $this = $(this),
          scrollTop = this.scrollTop,
          scrollHeight = this.scrollHeight,
          height = $this.height(),
          delta = (ev.type == 'DOMMouseScroll' ?
            ev.originalEvent.detail * -40 :
            ev.originalEvent.wheelDelta),
          up = delta > 0;

        var prevent = function() {
          ev.stopPropagation();
          ev.preventDefault();
          ev.returnValue = false;
          return false;
        }

        if (!up && -delta > scrollHeight - height - scrollTop) {
          // Scrolling down, but this will take us past the bottom.
          $this.scrollTop(scrollHeight);

          return prevent();
        } else if (up && delta > scrollTop) {
          // Scrolling up, but this will take us past the top.
          $this.scrollTop(0);
          return prevent();
        }
      });

    }
  });
  
  $(document).on('click', '.edit-page', function (event, data) {
    // TODO: Better way to toggle classes and observe hidden/visible states?
    var page = $(this).closest('.workspace-materials-view-page');
    if (page.hasClass('item-hidden')) {
      page.removeClass('item-hidden');
      page.find('.hide-page').removeClass('icon-show').addClass('icon-hide');
    } 
    editPage(page);
  });

  $(document).on('click', '.hide-page', function (event, data) {
    // TODO: Better way to toggle classes and observe hidden/visible states?
    var page = $(this).closest('.workspace-materials-view-page');
    var hidden = page.hasClass('item-hidden');
    toggleVisibility(page, !hidden);
  });
  
  function changeAssignmentType(workspaceId, workspaceMaterialId, assignmentType, callback) {
    mApi({async: false}).workspace.workspaces.materials.read(workspaceId, workspaceMaterialId).callback(function (err, workspaceMaterial) {
      if (err) {
        callback(err);
      } else {
        mApi({async: false}).workspace.workspaces.materials
          .update(workspaceId, workspaceMaterialId, $.extend(workspaceMaterial, { assignmentType: assignmentType }))
          .callback(function (err) {
            callback(err);
          });
      }
    });
  }

  function changeCorrectAnswers(workspaceId, workspaceMaterialId, correctAnswers, callback) {
    mApi({async: false}).workspace.workspaces.materials.read(workspaceId, workspaceMaterialId).callback(function (err, workspaceMaterial) {
      if (err) {
        callback(err);
      } else {
        mApi({async: false}).workspace.workspaces.materials
          .update(workspaceId, workspaceMaterialId, $.extend(workspaceMaterial, { correctAnswers: correctAnswers }))
          .callback(function (err) {
            callback(err);
          });
      }
    });
  }
  
  function setupSortableSection(node) {
    $(node).sortable({
      axis: "y",
      items: ">li",
      cursor: "crosshair",
      handle: "span.workspace-materials-toc-itemDragHandle",
      containment: ".workspace-materials-toc-root",
      connectWith: ".workspace-materials-toc-section",
      opacity: 0.35,
      revert: 200,
      placeholder: "sortable-placeholder",
      forcePlaceholderSize: true,
      stop: function(event, ui) {
        var parentId = parseInt($(ui.item).parent().attr('data-workspace-node-id'), 10);
        var workspaceNodeId = parseInt($(ui.item).attr('data-workspace-node-id'), 10);
        var nextSiblingId = parseInt($(ui.item).next('.workspace-materials-toc-item').attr('data-workspace-node-id'), 10);
        moveWorkspaceMaterial(parentId, workspaceNodeId, nextSiblingId);
        /* Lets not animate already active element */
        if (!$(ui.item).hasClass("active")) {
          $(ui.item)
          .addClass("no-hover")
          .animate({
            backgroundColor: "#edeea2",
            color: "#000"
          },{
            duration:1500,
            easing: "easeInOutQuint",
            complete: function() {
              $(this).animate({
                backgroundColor: "transparent",
                color: "#000"
              }, {
                duration:1500,
                easing: "easeInOutQuint",
                complete: function() {
                  $(this).css({
                    backgroundColor: "",
                  })
                  .removeClass("no-hover");
                  $(this).removeAttr("style");
                }
              });
            }
          });
        }
      }
    });
  }
  
  $(document).on('click', '.correct-answers', function (event, data) {
    var page = $(this).closest('.workspace-materials-view-page');
    var correctAnswers = $(page).attr('data-correct-answers');
    var workspaceId = $('.workspaceEntityId').val();
    var workspaceMaterialId = $(page).attr('data-workspace-material-id');
    switch (correctAnswers) {
      case "ALWAYS":
        correctAnswers = "ON_REQUEST";
        $(this)
        .attr('title', getLocaleText("plugin.workspace.materialsManagement.materialShowOnRequestCorrectAnswersTooltip"))
        .find("span")
        .text(getLocaleText("plugin.workspace.materialsManagement.materialShowOnRequestCorrectAnswersTooltip"));
        break;
      case "ON_REQUEST":
        correctAnswers = "NEVER";
        $(this)
        .attr('title', getLocaleText("plugin.workspace.materialsManagement.materialShowNeverCorrectAnswersTooltip"))
        .find("span")
        .text(getLocaleText("plugin.workspace.materialsManagement.materialShowNeverCorrectAnswersTooltip"));
        break;
      default:
        correctAnswers = "ALWAYS";
        $(this)
        .attr('title', getLocaleText("plugin.workspace.materialsManagement.materialShowAlwaysCorrectAnswersTooltip"))
        .find("span")
        .text(getLocaleText("plugin.workspace.materialsManagement.materialShowAlwaysCorrectAnswersTooltip"));
        break;
    }
    changeCorrectAnswers(workspaceId, workspaceMaterialId, correctAnswers, $.proxy(function (err) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', err);
      }
      else {
        $(page).attr('data-correct-answers', correctAnswers);
      }
    }, this));
  });
  
  $(document).on('click', '.change-assignment', function (event, data) {
    var page = $(this).closest('.workspace-materials-view-page');
    var assignmentType = $(page).attr('data-assignment-type');
    var workspaceId = $('.workspaceEntityId').val();
    var workspaceMaterialId = $(page).attr('data-workspace-material-id');
    var correctAnswers = $(page).attr('data-correct-answers');
    switch (assignmentType) {
      case "EXERCISE":
        changeAssignmentType(workspaceId, workspaceMaterialId, "EVALUATED", $.proxy(function (err) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            $(page).attr('data-assignment-type', 'EVALUATED');
            if (!correctAnswers) {
              changeCorrectAnswers(workspaceId, workspaceMaterialId, 'ALWAYS', $.proxy(function (err) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                }
                else {
                  $(page).attr('data-correct-answers', 'ALWAYS');
                }
              }, this));
            }
            $(page).find('.correct-answers-settings').addClass('hidden');
          }
        }, this));
      break;
      case "EVALUATED":
        changeAssignmentType(workspaceId, workspaceMaterialId, null, $.proxy(function (err) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            $(page).removeAttr('data-assignment-type');
            $(page).find('.correct-answers-settings').addClass('hidden');
          }
        }, this));
      break;
      default:
        changeAssignmentType(workspaceId, workspaceMaterialId, "EXERCISE", $.proxy(function (err) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            $(page).attr('data-assignment-type', 'EXERCISE');
            if (!correctAnswers) {
              changeCorrectAnswers(workspaceId, workspaceMaterialId, 'ALWAYS', $.proxy(function (err) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                }
                else {
                  $(page).attr('data-correct-answers', 'ALWAYS');
                }
              }, this));
            }
            $(page).find('.correct-answers-settings').removeClass('hidden');
          }
        }, this));
      break;
    }
  });
  
  $(document).on('click', '.workspaces-materials-management-add', function (event, data) {
	  
    var parentId = undefined;
    var nextSiblingId = undefined;
    var previousMaterial = $(this).parent().prevAll('.workspace-materials-view-page').first();
    var nextMaterial = $(this).parent().nextAll('.workspace-materials-view-page').first();
    
    renderDustTemplate('workspace/materials-management-new.dust', { }, $.proxy(function (text) {
      var newPage = $(text);
      $(this).parent().after(newPage);
      var uploader = createFileUploader();
      $(newPage).before(uploader);
      enableFileUploader(uploader, parentId, nextSiblingId);
      $(newPage).after(createAddPageSectionLink());
      
      // Documents cannot be created at root
      if (!$(previousMaterial).length) {
        $(newPage).find(".workspace-materials-management-new-page-link").remove();
      }
      
      // Sections can only be created last or above other sections 
      if ($(nextMaterial).length && !nextMaterial.hasClass('folder')) {
        $(newPage).find(".workspace-materials-management-new-section-link").remove();
      }
      
      $(newPage).find('.workspace-materials-management-new-page-link').one('click', function (event) {
        event.preventDefault();

        if (!$(nextMaterial).length) {
          if (!$(previousMaterial).length) {
            parentId = $('.workspaceRootFolderId').val();  
          }
          else if ($(previousMaterial).attr('data-material-type') == 'folder') {
            parentId = $(previousMaterial).attr('data-workspace-material-id');
          }
          else {
            parentId = $(previousMaterial).attr('data-parent-id');
          }
        }
        else {
          if ($(nextMaterial).attr('data-material-type') == 'folder') {
            if ($(previousMaterial).attr('data-material-type') == 'folder') {
              parentId = $(previousMaterial).attr('data-workspace-material-id');
            }
            else {
              parentId = $(previousMaterial).attr('data-parent-id');
            }
          }
          else {
            parentId = $(nextMaterial).attr('data-parent-id');
            nextSiblingId = $(nextMaterial).attr('data-workspace-material-id');
          }
        }
        
        var materialType = $(this).attr('data-material-type');
        var typeEndpoint = mApi({async: false}).materials[materialType];
        if (typeEndpoint != null) {
          typeEndpoint.create({
            title: getLocaleText("plugin.workspace.materialsManagement.newPageTitle"),
            contentType: 'text/html;editor=CKEditor'
          })
          .callback($.proxy(function (materialErr, materialResult) {
            if (materialErr) {
              $('.notification-queue').notificationQueue('notification', 'error', materialErr);
              return;
            }
            
            var workspaceEntityId = $('.workspaceEntityId').val();
            
            mApi({async: false}).workspace.workspaces.materials.create(workspaceEntityId, {
              materialId: materialResult.id,
              parentId: parentId,
              nextSiblingId: nextSiblingId
            })
            .callback($.proxy(function (workspaceMaterialErr, workspaceMaterialResult) {
              if (workspaceMaterialErr) {
                $('.notification-queue').notificationQueue('notification', 'error', workspaceMaterialErr);
                return;
              }
              else {
            	  
                newPage.removeClass('workspace-materials-management-new');
                newPage.attr({
                  'id': 'page-' + workspaceMaterialResult.id,
                  'data-path': workspaceMaterialResult.path,
                  'data-material-title': materialResult.title,
                  'data-parent-id': workspaceMaterialResult.parentId,
                  'data-material-id': materialResult.id,
                  'data-material-type': materialType,
                  'data-workspace-material-id': workspaceMaterialResult.id
                });

                var newPageTocItem = $('<li class="workspace-materials-toc-item " data-workspace-node-id="' + workspaceMaterialResult.id + '" />');
                newPageTocItem.append('<a href="#page-' + workspaceMaterialResult.id + '">' + materialResult.title + '</a>');
                newPageTocItem.append('<span class="workspace-materials-toc-itemDragHandle icon-move ui-sortable-handle" />');
                
                if (nextSiblingId) {
                  newPageTocItem.insertBefore('li.workspace-materials-toc-item[data-workspace-node-id="'+nextSiblingId+'"]');
                }
                else {
                  var section = $('ul[data-workspace-node-id="' + parentId + '"]');
                  section.append(newPageTocItem);
                }
                var tocSection = newPageTocItem.closest('.workspace-materials-toc-section');
                if (tocSection) {
                  tocSection.sortable('refresh');
                }
                newPage.empty();
                $(document).muikkuMaterialLoader('loadMaterial', newPage);
                // TODO Concurrency? Has the material been loaded before edit?
                //editPage(newPage);
              } 
            }, this));
          }, newPage));
        } else {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.workspace.materialsManagement.missingRestService", materialType));
        }
      });
      
      
      $(newPage).find('.workspace-materials-management-new-section-link').one('click', function (event) {
        event.preventDefault();
        var workspaceEntityId = $('.workspaceEntityId').val();

        parentId = $('.workspaceRootFolderId').val();
        if ($(nextMaterial).attr('data-material-type') == 'folder') {
          nextSiblingId = $(nextMaterial).attr('data-workspace-material-id');
        }
        
        mApi({async: false}).workspace.workspaces.folders.create(workspaceEntityId, {
          nextSiblingId: nextSiblingId
        })
        .callback($.proxy(function (workspaceFolderErr, workspaceFolderResult) {
          if (workspaceFolderErr) {
            $('.notification-queue').notificationQueue('notification', 'error', workspaceFolderErr);
            return;
          }
          else {
            newPage.removeClass('workspace-materials-management-new').addClass("folder");
            newPage.attr({
              'id': 'page-' + workspaceFolderResult.id,
              'data-material-title': workspaceFolderResult.title,
              'data-parent-id': workspaceFolderResult.parentId,
              'data-material-type': 'folder',
              'data-workspace-material-id': workspaceFolderResult.id
            });
            var newSectionTocItem = $('<ul class="workspace-materials-toc-section" data-workspace-node-id="'+workspaceFolderResult.id+'" />');
            var newPageTocItem = $('<li class="workspace-materials-toc-subtitle " />');
            newPageTocItem.append('<a href="#page-'+workspaceFolderResult.id+'">'+workspaceFolderResult.title+'</a>');
            newPageTocItem.append('<span class="workspace-materials-toc-sectionDragHandle icon-move" />');
            newSectionTocItem.append(newPageTocItem);

            if (typeof(nextSiblingId) === 'undefined') {
              $('.workspace-materials-toc-root').append(newSectionTocItem);
            } else {
              newSectionTocItem.insertBefore('ul.workspace-materials-toc-section[data-workspace-node-id="'+nextSiblingId+'"]');
            }

            $('.workspace-materials-toc-root').sortable('refresh');
            setupSortableSection(newSectionTocItem);
            
            newPage.empty();
            $(document).muikkuMaterialLoader('loadMaterial', newPage);
            // TODO Concurrency? Has the material been loaded before edit?
            //editPage(newPage);
          } 
        }, this));
      });
      
    }, this));
  });
  
  $(document).on('htmlMaterialRevisionChanged', function (event, data) {
    $('.workspace-materials-view-page[data-material-id="' + data.materialId + '"]').each(function (index, page) {
      var workspaceMaterialId = $(page).attr('data-workspace-material-id');
      setPageCurrentRevision(workspaceMaterialId, data.revisionNumber);
    });
  });
  
  function confirmPagePublication(confirmCallback) {
    renderDustTemplate('workspace/materials-management-page-publish-confirm.dust', { }, $.proxy(function (text) {
      var dialog = $(text);
      $(text).dialog({
        modal: true, 
        resizable: false,
        width: 360,
        dialogClass: "workspace-materials-management-dialog",
        buttons: [{
          'text': dialog.data('button-publish-text'),
          'class': 'publish-button',
          'click': function(event) {
            $(this).dialog().remove();
            confirmCallback();
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog().remove();
          }
        }]
      });
    }, this));
  }

  function confirmAnswerRemovalPublish(confirmCallback) {
    renderDustTemplate('workspace/materials-management-page-confirm-answer-removal-publish.dust', { }, $.proxy(function (text) {
      var dialog = $(text);
      $(text).dialog({
        modal: true, 
        resizable: false,
        width: 500,
        dialogClass: "workspace-materials-management-dialog",
        buttons: [{
          'text': dialog.data('button-confirm-text'),
          'class': 'confirm-button',
          'click': function(event) {
            $(this).dialog().remove();
            confirmCallback();
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog().remove();
          }
        }]
      });
    }, this));
  }
  
  function confirmAnswerRemovalDelete(confirmCallback) {
    renderDustTemplate('workspace/materials-management-page-confirm-answer-removal-delete.dust', { }, $.proxy(function (text) {
      var dialog = $(text);
      $(text).dialog({
        modal: true, 
        resizable: false,
        width: 500,
        dialogClass: "workspace-materials-management-dialog",
        buttons: [{
          'text': dialog.data('button-confirm-text'),
          'class': 'confirm-button',
          'click': function(event) {
            $(this).dialog().remove();
            confirmCallback();
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog().remove();
          }
        }]
      });
    }, this));
  }
  
  function publishPage(workspaceMaterialId, materialId, publishedRevision, currentRevision, title, removeAnswers, errorCallback) {
    var loadNotification = $('.notification-queue').notificationQueue('notification', 'loading', getLocaleText("plugin.workspace.materialsManagement.publishingMessage"));
    mApi({async: false}).materials.html.publish.create(materialId, {
      fromRevision: publishedRevision,
      toRevision: currentRevision,
      removeAnswers: removeAnswers
    }).callback($.proxy(function (err, jqXHR) {
      loadNotification.remove();
      if (err) {
        errorCallback(err, jqXHR);
      }
      else {
        // Revision update
        setPagePublishedRevision(workspaceMaterialId, currentRevision);
        // Workspace material title update
        var workspaceId = $('.workspaceEntityId').val();
        mApi({async: false}).workspace.workspaces.materials.read(workspaceId, workspaceMaterialId).callback($.proxy(function(err, workspaceMaterial) {
          workspaceMaterial.title = title;
          mApi({async: false}).workspace.workspaces.materials.update(workspaceId, workspaceMaterialId, workspaceMaterial).callback($.proxy(function (err, updatedMaterial) {
            if (err) {
              errorCallback(err, jqXHR);
            }
            else {
              var page = $('#page-' + workspaceMaterialId);
              $(page).attr('data-material-title', updatedMaterial.title);
              $(page).attr('data-path', updatedMaterial.path);
              var tocElement = $("a[href*='#page-" + $(page).attr('data-workspace-material-id') + "']");
              if (tocElement) {
                $(tocElement).text(title);
              }
              closeEditor(page, true);
              $('.notification-queue').notificationQueue('notification', 'info', getLocaleText("plugin.workspace.materialsManagement.publishedMessage"));
            }
          }), this);
        }), this);
      }
    }, this));   
  }
  
  $(document).on('click', '.publish-page', function (event, data) {
    var page = $(this).closest('.workspace-materials-view-page');
    var workspaceMaterialId = $(page).attr('data-workspace-material-id');
    var materialId = $(page).attr('data-material-id');
    var title = $(page).find('.workspace-material-html-editor-title').val();
    var currentRevision = getPageCurrentRevision(workspaceMaterialId);
    var publishedRevision = getPagePublishedRevision(workspaceMaterialId);
    
    if (currentRevision !== publishedRevision) {
      confirmPagePublication($.proxy(function () {
        publishPage(workspaceMaterialId, materialId, publishedRevision, currentRevision, title, false, function (err, jqXHR) {
          if (jqXHR.status == 409) {
            var response = $.parseJSON(jqXHR.responseText);
            if (response && response.reason == 'CONTAINS_ANSWERS') {
              confirmAnswerRemovalPublish(function () {
                publishPage(workspaceMaterialId, materialId, publishedRevision, currentRevision, title, true, function (err, jqXHR) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                });
              });
            } else {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
          } else {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }    
        });
      }, this));
    }
  });
  
  function confirmPageRevert(revertCallback) {
    renderDustTemplate('workspace/materials-management-page-revert-confirm.dust', { }, $.proxy(function (text) {
      var dialog = $(text);
      $(text).dialog({
        modal: true, 
        resizable: false,
        width: 360,
        dialogClass: "workspace-materials-management-dialog",
        buttons: [{
          'text': dialog.data('button-revert-text'),
          'class': 'revert-button',
          'click': function(event) {
            $(this).dialog().remove();
            revertCallback();
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog().remove();
          }
        }]
      });
    }, this));
  }
  
  $(document).on('click', '.revert-page', function (event, data) {
    var page = $(this).closest('.workspace-materials-view-page');
    var workspaceMaterialId = $(page).attr('data-workspace-material-id');
    var materialId = $(page).attr('data-material-id');
    var currentRevision = getPageCurrentRevision(workspaceMaterialId);
    var publishedRevision = getPagePublishedRevision(workspaceMaterialId);
    
    if (currentRevision !== publishedRevision) {
      confirmPageRevert($.proxy(function () {
        var loadNotification = $('.notification-queue').notificationQueue('notification', 'loading', getLocaleText("plugin.workspace.materialsManagement.revertingToPublishedMessage"));
        var editing = isPageInEditMode($('#page-' + workspaceMaterialId));
        
        if (editing) {
          closeEditor($('#page-' + workspaceMaterialId), false);
        }
        
        mApi({async: false}).materials.html.revert.update(materialId, {
          fromRevision: currentRevision,
          toRevision: publishedRevision
        }).callback($.proxy(function (err) {
          loadNotification.remove();
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            setPageCurrentRevision(workspaceMaterialId, publishedRevision);
            
            if (editing) {
              editPage($('#page-' + workspaceMaterialId));
            }

            $('.notification-queue').notificationQueue('notification', 'info', getLocaleText("plugin.workspace.materialsManagement.revertedToPublishedMessage"));
          }
        }, this));
      }, this));
    }
  });
  
  $(document).on('click', '.close-page-editor', function (event, data) {
    var workspaceMaterialId = $(this).attr('data-workspace-material-id');
    closeEditor($('#page-' + workspaceMaterialId), true);
  });

  $(document).on('afterHtmlMaterialRender', function (event, data) {
    var node = $(data.pageElement);
    if ($(node).attr('data-assignment-type') == 'EXERCISE') {
      $(node).find('.correct-answers-settings').removeClass('hidden');
      var correctAnswersElem = $(node).find('.correct-answers');
      if ($(node).attr('data-correct-answers') == 'ALWAYS') {
        $(correctAnswersElem)
        .attr('title', getLocaleText("plugin.workspace.materialsManagement.materialShowAlwaysCorrectAnswersTooltip"))
        .find("span")
        .text(getLocaleText("plugin.workspace.materialsManagement.materialShowAlwaysCorrectAnswersTooltip"));
      } else if ($(node).attr('data-correct-answers') == 'ON_REQUEST') {
        $(correctAnswersElem)
        .attr('title', getLocaleText("plugin.workspace.materialsManagement.materialShowOnRequestCorrectAnswersTooltip"))
        .find("span")
        .text(getLocaleText("plugin.workspace.materialsManagement.materialShowOnRequestCorrectAnswersTooltip"));
      } else if ($(node).attr('data-correct-answers') == 'NEVER') {
        $(correctAnswersElem)
        .attr('title', getLocaleText("plugin.workspace.materialsManagement.materialShowNeverCorrectAnswersTooltip"))
        .find("span")
        .text(getLocaleText("plugin.workspace.materialsManagement.materialShowNeverCorrectAnswersTooltip"));
      } else {
        $(correctAnswersElem)
        .attr('title', getLocaleText("plugin.workspace.materialsManagement.materialShowAlwaysCorrectAnswersTooltip"))
        .find("span")
        .text(getLocaleText("plugin.workspace.materialsManagement.materialShowAlwaysCorrectAnswersTooltip"));
      }
    }
  });
  
}).call(this);
