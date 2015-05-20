(function() {
  
  function createAddPageLink() {
    return $('<div>')
      .addClass('workspace-materials-management-addpage')
      .append($('<span>').addClass('workspace-materials-management-line-separator'))
      .append($('<a>').addClass('workspaces-materials-management-add-page icon-add').attr('href', 'javascript:void(null)').append($('<span>').html(getLocaleText("plugin.workspace.materialsManagement.addPage"))));
  }
  
  function createFileUploader() {
    return $('<div>')
      .addClass('workspaces-materials-management-insert-file')
      .append($('<input>').attr('type', 'file'));
  }
  
  function enableFileUploader(element, parentId, nextSiblingId) {
    $(element)
      .workspaceMaterialUpload({
        workspaceEntityId: $('.workspaceEntityId').val(),
        parentId: parentId,
        nextSiblingId: nextSiblingId
      })
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
        
        $(document).muikkuMaterialLoader('loadMaterial', newPage, true);
        
        var nextPage = $(newPage).next('.workspace-materials-view-page');
        
        var uploader = createFileUploader();
        nextPage.before(createAddPageLink());
        nextPage.before(uploader);
        enableFileUploader(uploader, nextPage.data('parent-id'), nextPage.data('workspace-material-id'));
      })
      .on('fileDiscarded', function (event, data) {
        $(this).workspaceMaterialUpload('reset');
      });
  }
  
  function editPage(node) {

    var materialType = $(node).data('material-type');
    var materialId = $(node).data('material-id');
    var materialTitle = $(node).data('material-title');
    var workspaceMaterialId = $(node).data('workspace-material-id');
    var editorName = 'workspaceMaterialEditor' + (materialType.substring(0, 1).toUpperCase() + materialType.substring(1));
    var pageElement = $('#page-' + workspaceMaterialId);
    var pageSection = $(pageElement).closest(".workspace-materials-view-page");
    
    pageSection.addClass("page-edit-mode");
    
    var editor = pageElement[editorName];
    if (editor) {
      $(pageElement).find('.page-content').remove();
      
      editor.call(pageElement, {
        materialId: materialId,
        materialTitle: materialTitle
      });
      
    } else {
      $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.workspace.materialsManagement.missingEditor", materialType));
    }
  }
  
  function isPageInEditMode(node) {
    return $(node).hasClass('page-edit-mode');
  }
  
  function closeEditor(node, loadContent) {
    var materialType = $(node).data('material-type');
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
        $(node).data('material-title', material.title);
        $(node).data('material-content', material.html);
        $(node).data('material-current-revision', material.currentRevision);
        $(node).data('material-published-revision', material.publishedRevision);
        $(document).muikkuMaterialLoader('loadMaterial', node, true);
        var tocElement = $("a[href*='#page-" + $(node).data('workspace-material-id') + "']");
        if (tocElement) {
          $(tocElement).text(material.title);
        }
      }, this);
      worker.postMessage({
        materialId: $(node).data('material-id'),
        workspaceMaterialId: $(node).data('workspace-material-id') 
      });
    }
  }
  
  function confirmPageDeletion(confirmCallback) {
    renderDustTemplate('workspace/materials-management-page-delete-corfirm.dust', { }, $.proxy(function (text) {
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
            $(this).dialog("close");
            confirmCallback();
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog("close");
          }
        }]
      });
    }, this));
  }
  
  function deletePage(workspaceMaterialId, materialId, workspaceId, removeAnswers, errorCallback) {
    mApi().workspace.workspaces.materials.del(workspaceId,workspaceMaterialId, {}, {removeAnswers: removeAnswers}).callback($.proxy(function (err, jqXHR){
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
              page.nextAll('.workspace-materials-management-addpage').first().remove();
              page.nextAll('.workspaces-materials-management-insert-file').first().remove();
              page.remove();
            }
          });
        // TOC
        var tocElement = $("a[href*='#page-" + workspaceMaterialId + "']");
        if (tocElement) {
          tocElement.remove();
        }
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
    var workspaceMaterialId = $(this).data('workspace-material-id');
    var materialId = $(this).data('material-id');
    var workspaceId = $('.workspaceEntityId').val();
    confirmPageDeletion($.proxy(function () {
      deletePage(workspaceMaterialId, materialId, workspaceId, false, function (err, jqXHR) {
        if (jqXHR.status == 409) {
          var response = $.parseJSON(jqXHR.responseText);
          if (response && response.reason == 'CONTAINS_ANSWERS') {
            confirmAnswerRemovalDelete(function () {
              deletePage(workspaceMaterialId, materialId, workspaceId, true, function (err, jqXHR) {
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
  });
  
  $.widget("custom.muikkuPageAttachments", {
    _create : function() {
      this._startLoading();
      
      this._workspaceUrl = null;
      
      mApi().materials.metakeys.read().callback($.proxy(function (metaErr, metaKeys) {
        if (metaErr) {
          $('.notification-queue').notificationQueue('notification', 'error', metaErr);
        } else {
          this._metaKeys = metaKeys;
          
          mApi().workspace.workspaces.read(this.options.workspaceEntityId).callback($.proxy(function (workspaceErr, workspaceEntity) {
            if (workspaceErr) {
              $('.notification-queue').notificationQueue('notification', 'error', workspaceErr);
            } else {
              this._workspaceUrl = CONTEXTPATH + '/workspace/' + workspaceEntity.urlName;
              
              mApi().workspace.workspaces.materials.read(this.options.workspaceEntityId, {
                parentId: this.options.parentId
              })
              .on('$', function (workspaceMaterial, callback) {
                mApi().materials.binary.read(workspaceMaterial.materialId).callback(function (binaryErr, binaryMaterial) {
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
            'class': 'remove-button',
            'click': function(event) {
              $(this).dialog("close");
              confirmCallback();
            }
          }, {
            'text': dialog.data('button-cancel-text'),
            'class': 'cancel-button',
            'click': function(event) {
              $(this).dialog("close");
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
      var contentType = data.files[0].type;
      
      mApi().materials.binary.create({
        title: fileName,
        contentType: contentType,
        fileId: fileId
      })
      .callback($.proxy(function (materialErr, materialResult) {
        if (materialErr) {
          $('.notification-queue').notificationQueue('notification', 'error', materialErr);
        } else {
          mApi().workspace.workspaces.materials.create(this.options.workspaceEntityId, {
            materialId: materialResult.id,
            parentId: this.options.parentId
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
          
          mApi().workspace.workspaces.materials.del(this.options.workspaceEntityId, workspaceMaterialId)
            .callback($.proxy(function (err) {
              if (err) {
                $('.notification-queue').notificationQueue('notification', 'error', err);
              } else {
                attachmentElement.remove();
              }
            }, this));
          
        }, this));
      }
    }
    
  });
  
  $(document).on('click', '.page-attachments', function (event, data) {
    var workspaceEntityId = $('.workspaceEntityId').val();
    var workspaceMaterialId = $(event.target).attr('data-workspace-material-id');
    $(event.target)
      .closest('section')
      .find('.workspace-materials-management-view-page-controls')
      .after($('<div>').muikkuPageAttachments({
        workspaceEntityId: workspaceEntityId,
        parentId: workspaceMaterialId
      }));
  });
  
  function toggleVisibility(node, hidden) {
    var _node = node;
    var _hidden = hidden;
    var workspaceId = $('.workspaceEntityId').val();
    var nextSibling = node.nextAll('.workspace-materials-view-page').first();
    var nextSiblingId = nextSibling.length > 0 ? nextSibling.data('workspace-material-id') : null;
    var workspaceMaterialId = node.data('workspace-material-id');
    mApi().workspace.workspaces.materials.update(workspaceId, node.data('workspace-material-id'), {
      id: node.data('workspace-material-id'),
      materialId: node.data('material-id'),
      parentId: node.data('parent-id'),
      nextSiblingId: nextSiblingId,
      hidden: hidden
    }).callback(
      function (err, html) {
        // TODO error handling
        if (!hidden) {
          node.removeClass('page-hidden');
          node.find('.hide-page').removeClass('icon-show').addClass('icon-hide');
          // TOC
          var tocElement = $("a[href*='#page-" + workspaceMaterialId + "']");
          if (tocElement) {
            tocElement.parent().removeClass('item-hidden');
          }
        }
        else {
          node.addClass('page-hidden');
          node.find('.hide-page').removeClass('icon-hide').addClass('icon-show');
          // TOC
          var tocElement = $("a[href*='#page-" + workspaceMaterialId + "']");
          if (tocElement) {
            tocElement.parent().addClass('item-hidden');
          }
        }
    });
  }
  
  function scrollToPage(workspaceMaterialId, animate) {
    var topOffset = 100;
    var scrollTop = $('#page-' + workspaceMaterialId).offset().top - topOffset;
    if (animate) {
      $(window).data('scrolling', true);
      
      $('html, body').stop().animate({
        scrollTop : scrollTop
      }, {
        duration : 500,
        easing : "easeInOutQuad",
        complete : function() {
          $('a.active').removeClass('active');
          $('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
          window.location.hash = 'p-' + workspaceMaterialId;
          $(window).data('scrolling', false);
        }
      });
    } else {
      $('html, body').stop().scrollTop(scrollTop);
      $('a.active').removeClass('active');
      $('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
      window.location.hash = 'p-' + workspaceMaterialId;
    }
  }
  
  $(document).on('click', '.workspace-materials-toc-item a', function (event) {
    event.preventDefault();
    scrollToPage($($(this).attr('href')).data('workspaceMaterialId'), true);
  });

  $(document).ready(function() {
    $(window).data('initializing', true);

    $(document).muikkuMaterialLoader({
      workspaceEntityId: $('.workspaceEntityId').val(),
      dustTemplate: 'workspace/materials-management-page.dust',
      renderMode: {
        "html": "dust"
      }
    })
    .muikkuMaterialLoader('loadMaterials', $('.workspace-materials-view-page'));

    $('.workspace-materials-view-page').waypoint(function(direction) {
      if ($(window).data('scrolling') !== true && $(window).data('initializing') !== true) {
        var workspaceMaterialId = $(this).data('workspace-material-id');
        $('a.active').removeClass('active');
        $('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
        window.location.hash = 'p-' + workspaceMaterialId;
      }
    }, {
      offset: '60%'
    });
    
    $('.workspaces-materials-management-insert-file').each(function(index, element) {
      var nextMaterial = $(element).next('.workspace-materials-view-page');
      var parentId = $(nextMaterial).data('parent-id');
      var nextSiblingId = $(nextMaterial).data('workspace-material-id');
      enableFileUploader(element, parentId, nextSiblingId);
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
    if (page.hasClass('page-hidden')) {
      page.removeClass('page-hidden');
      page.find('.hide-page').removeClass('icon-show').addClass('icon-hide');
    } 
    editPage($(this).closest('section'));
  });

  $(document).on('click', '.hide-page', function (event, data) {
    // TODO: Better way to toggle classes and observe hidden/visible states?
    var page = $(this).closest('.workspace-materials-view-page');
    var hidden = page.hasClass('page-hidden');
    toggleVisibility(page, !hidden);
  });
  
  function changeAssignmentType(workspaceId, workspaceMaterialId, assignmentType, callback) {
    mApi().workspace.workspaces.materials.read(workspaceId, workspaceMaterialId).callback(function (err, workspaceMaterial) {
      if (err) {
        callback(err);
      } else {
        mApi().workspace.workspaces.materials
          .update(workspaceId, workspaceMaterialId, $.extend(workspaceMaterial, { assignmentType: assignmentType }))
          .callback(function (err) {
            callback(err);
          });
      }
    });
  }
  
  $(document).on('click', '.change-assignment', function (event, data) {
    // TODO: Actually do something AND DO IT BETTER!
    var page = $(this).closest('.workspace-materials-view-page');
    var assignmentType = $(page).attr('data-assignment-type');
    var workspaceId = $('.workspaceEntityId').val();
    var workspaceMaterialId = $(page).attr('data-workspace-material-id');
    
    switch (assignmentType) {
      case "EXERCISE":
        changeAssignmentType(workspaceId, workspaceMaterialId, "EVALUATED", $.proxy(function (err) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            $(page).attr('data-assignment-type', 'EVALUATED');
          }
        }, this));
      break;
      case "EVALUATED":
        changeAssignmentType(workspaceId, workspaceMaterialId, null, $.proxy(function (err) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            $(page).removeAttr('data-assignment-type');
          }
        }, this));
      break;
      default:
        changeAssignmentType(workspaceId, workspaceMaterialId, "EXERCISE", $.proxy(function (err) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            $(page).attr('data-assignment-type', 'EXERCISE');
          }
        }, this));
      break;
    }
  });
  
  $(document).on('click', '.workspaces-materials-management-add-page', function (event, data) {
	  
    var nextMaterial = $(this).parent().nextAll('.workspace-materials-view-page').first();
    
    renderDustTemplate('workspace/materials-management-new-page.dust', { }, $.proxy(function (text) {
      var newPage = $(text);
      $(this).parent().after(newPage);
      var uploader = createFileUploader();
      $(newPage).before(uploader);
      enableFileUploader(uploader, nextMaterial.data('parent-id'), nextMaterial.data('workspace-material-id'));
      $(newPage).after(createAddPageLink());
      
      
      $(newPage).find('.workspace-materials-management-new-page-link').one('click', function (event) {
        event.preventDefault();
        var materialType = $(this).data('material-type');
        var parentId = $(nextMaterial).data('parent-id');
        var nextSiblingId = $(nextMaterial).data('workspace-material-id');
        var typeEndpoint = mApi().materials[materialType];
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
            
            mApi().workspace.workspaces.materials.create(workspaceEntityId, {
              materialId: materialResult.id,
              parentId: parentId,
              nextSiblingId: nextSiblingId
            })
            .callback($.proxy(function (workspaceMaterialErr, workspaceMaterialResult) {
              if (workspaceMaterialErr) {
                $('.notification-queue').notificationQueue('notification', 'error', workspaceMaterialErr);
                return;
              } else {
            	  
                newPage.removeClass('workspace-materials-management-new-page');
                newPage.attr({
                  'id': 'page-' + workspaceMaterialResult.id,
                  'data-material-title': materialResult.title,
                  'data-parent-id': workspaceMaterialResult.parentId,
                  'data-material-id': materialResult.id,
                  'data-material-type': materialType,
                  'data-workspace-material-id': workspaceMaterialResult.id
                });
                newPage.empty();
                $(document).muikkuMaterialLoader('loadMaterial', newPage, true);
                editPage(newPage);
              } 
            }, this));
          }, newPage));
        } else {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.workspace.materialsManagement.missingRestService", materialType));
        }
        
      });
    }, this));
  });
  
  $(document).on('htmlMaterialRevisionChanged', function (event, data) {
    $('.workspace-materials-view-page[data-material-id="' + data.materialId + '"]').each(function (index, page) {
      var workspaceMaterialId = $(page).data('workspace-material-id');
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
            $(this).dialog("close");
            confirmCallback();
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog("close");
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
            $(this).dialog("close");
            confirmCallback();
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog("close");
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
            $(this).dialog("close");
            confirmCallback();
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog("close");
          }
        }]
      });
    }, this));
  }
  
  function publishPage(workspaceMaterialId, materialId, publishedRevision, currentRevision, removeAnswers, errorCallback) {
    var loadNotification = $('.notification-queue').notificationQueue('notification', 'loading', getLocaleText("plugin.workspace.materialsManagement.publishingMessage"));
    mApi().materials.html.publish.create(materialId, {
      fromRevision: publishedRevision,
      toRevision: currentRevision,
      removeAnswers: removeAnswers
    }).callback($.proxy(function (err, jqXHR) {
      loadNotification.remove();
      if (err) {
        errorCallback(err, jqXHR);
      }
      else {
        setPagePublishedRevision(workspaceMaterialId, currentRevision);
        closeEditor($('#page-' + workspaceMaterialId), true);
        $('.notification-queue').notificationQueue('notification', 'info', getLocaleText("plugin.workspace.materialsManagement.publishedMessage"));
      }
    }, this));   
  }
  
  $(document).on('click', '.publish-page', function (event, data) {
    var page = $(this).closest('.workspace-materials-view-page');
    var workspaceMaterialId = $(page).data('workspace-material-id');
    var materialId = $(page).data('material-id');
    var currentRevision = getPageCurrentRevision(workspaceMaterialId);
    var publishedRevision = getPagePublishedRevision(workspaceMaterialId);
    
    if (currentRevision !== publishedRevision) {
      confirmPagePublication($.proxy(function () {
        publishPage(workspaceMaterialId, materialId, publishedRevision, currentRevision, false, function (err, jqXHR) {
          if (jqXHR.status == 409) {
            var response = $.parseJSON(jqXHR.responseText);
            if (response && response.reason == 'CONTAINS_ANSWERS') {
              confirmAnswerRemovalPublish(function () {
                publishPage(workspaceMaterialId, materialId, publishedRevision, currentRevision, true, function (err, jqXHR) {
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
            $(this).dialog("close");
            revertCallback();
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog("close");
          }
        }]
      });
    }, this));
  }
  
  $(document).on('click', '.revert-page', function (event, data) {
    var page = $(this).closest('.workspace-materials-view-page');
    var workspaceMaterialId = $(page).data('workspace-material-id');
    var materialId = $(page).data('material-id');
    var currentRevision = getPageCurrentRevision(workspaceMaterialId);
    var publishedRevision = getPagePublishedRevision(workspaceMaterialId);
    
    if (currentRevision !== publishedRevision) {
      confirmPageRevert($.proxy(function () {
        var loadNotification = $('.notification-queue').notificationQueue('notification', 'loading', getLocaleText("plugin.workspace.materialsManagement.revertingToPublishedMessage"));
        var editing = isPageInEditMode($('#page-' + workspaceMaterialId));
        
        if (editing) {
          closeEditor($('#page-' + workspaceMaterialId), false);
        }
        
        mApi().materials.html.revert.update(materialId, {
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
    var workspaceMaterialId = $(this).data('workspace-material-id');
    closeEditor($('#page-' + workspaceMaterialId), true);
  });
  
}).call(this);
