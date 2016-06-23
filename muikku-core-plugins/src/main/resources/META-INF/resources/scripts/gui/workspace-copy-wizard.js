(function() {
  'use strict';
  
  $.widget("custom.workspaceCopyWizard", {
    options: {
      workspaceEntityId: null,
      steps: {
        'copy-workspace': function (callback) {
          var name = this._getPage('name').find('input[name="workspace-name"]').val();
          var nameExtension = this._getPage('name').find('input[name="workspace-name-extension"]').val();
          var description = CKEDITOR.instances['workspace-description'].getData();
          
          var payload = {
            name: name,
            nameExtension: nameExtension,
            description: description
          };
          
          mApi().workspace.workspaces
            .create(payload, { sourceWorkspaceEntityId: this.options.workspaceEntityId })
            .callback($.proxy(function (err, result) {
              if (err) {
                callback(err);
              } else {
                this._setCreatedWorkspace(result);
                callback(null, result);
              }
            }, this));
        },
        'copy-discussions-areas': function (callback) {
          var payload = {};
          
          mApi().workspace.workspaces.forumAreas
            .create(this._createdWorkspace.id, payload, { sourceWorkspaceEntityId: this.options.workspaceEntityId })
            .callback(callback);
        },
        'copy-materials': function (callback) {
          var cloneMaterials = this._getPage('materials').find('input[name="material-copy-style"]:checked').val() == 'copy';
          var payload = {};
          
          mApi().workspace.workspaces.materials
            .create(this._createdWorkspace.id, payload, { 
              sourceWorkspaceEntityId: this.options.workspaceEntityId, 
              targetWorkspaceEntityId: this._createdWorkspace.id, 
              copyOnlyChildren: true,
              cloneMaterials: cloneMaterials
            })
            .callback($.proxy(function (err, result) {
              if (err) {
                callback(err);
              } else {
                callback(null, result);
              }
            }, this));
        },
        "change-dates": function (callback) {
          var beginDate = $('input[name="beginDate"]')
            .datepicker('getDate');
          
          var endDate = $('input[name="endDate"]')
            .datepicker('getDate');
          
          mApi().workspace.workspaces.details
            .read(this._createdWorkspace.id)
            .callback($.proxy(function (loadErr, workspaceDetails) {
              if (loadErr) {
                callback(loadErr);
              } else {
                var beginTime = beginDate ? beginDate.getTime() : null;
                var endTime = endDate ? endDate.getTime() : null;
                
                workspaceDetails.beginDate = beginTime;
                workspaceDetails.endDate = endTime;
                
                mApi().workspace.workspaces.details
                  .update(this._createdWorkspace.id, workspaceDetails)
                  .callback($.proxy(function (saveErr) {
                    callback(saveErr);
                  }, this));
              }
            }, this));
        }
      },
      ckeditor: {
        height : '200px',
        entities: false,
        entities_latin: false,
        entities_greek: false,
        toolbar: [
          { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
          { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'Undo', 'Redo' ] },
          { name: 'links', items: [ 'Link' ] },
          { name: 'insert', items: [ 'Image', 'Table', 'Smiley', 'SpecialChar' ] },
          { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
          { name: 'styles', items: [ 'Format' ] },
          { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
          { name: 'tools', items: [ 'Maximize' ] }
        ]
      }
    },
    
    _create : function() {
      this.element.addClass('wizard workspace-copy-wizard flex-grid');
      this._createdWorkspace = null;
      this.element.addClass('loading');
      
      this._load($.proxy(function (html) {
        this.element.removeClass('loading');
        this.element.html(html);
        this.element
          .find('.wizard-page')
          .first()
          .addClass('wizard-page-active');
        
        this.element.find('.ckeditor-field').each($.proxy(function (index, ckField) {
          CKEDITOR.replace(ckField, this.options.ckeditor);
        }, this));
        
        this.element.find('.date-field').each(function (index, dateField) {
          var value = parseInt($(dateField).val());
          $(dateField).val('');
          
          $(dateField).datepicker({
            "dateFormat": getLocaleText('datePattern')
          });
          
          if (!isNaN(value)) {
            $(dateField).datepicker('setDate', new Date(value));
          }
        });
        
        this.element.on('click', 'input[name="copy-materials"]', $.proxy(function (event) {
          if ($(event.target).prop('checked')) {
            this._showPage('materials');
          } else {
            this._hidePage('materials');
          }
        }, this));
        
        this.element.on("pageChange", $.proxy(this._onPageChange, this));

        this.element.find('.wizard-page').each($.proxy(function (index, page) {
          var pageId = $(page)
            .attr('data-page-id');
          
          var progressPage = $('<li>')
            .attr({
              'data-page-id': pageId
            })
            .text(pageId);
          
          this.element.find('.progress-pages')
            .append(progressPage);
          
          if ($(page).hasClass('wizard-page-visible')) {
            progressPage.show();
          } else {
            progressPage.hide();
          }
          
        }, this));

        this.element.on('click', '.prev', $.proxy(this._onPrevClick, this));
        this.element.on('click', '.next', $.proxy(this._onNextClick, this));
        this.element.on('click', '.copy', $.proxy(this._onCopyClick, this));
        this.element.on('click', '.close', $.proxy(this._onCloseClick, this));
        this.element.on('click', '.close-wizard', $.proxy(this._onCloseWizardClick, this));
        
        this._updateButtons();
        this._updatePageNumbers();
      }, this));
    },
    
    _onPrevClick: function (event) {
      this._prevPage();
    },
    
    _onNextClick: function (event) {
      this._nextPage();
    },
    
    _onCopyClick: function (event) {
      var steps = $.map(this.element.find('.summary li'), function (li) {
        return $(li).attr('data-id');
      });
      
      this.element 
        .find('.copy,.prev,.next,.progress').hide();
      
      this._doCopy(steps);
    },
    
    _onCloseClick: function (event) {
      this._closeWizard();
    },
    
    _onCloseWizardClick: function (event) {
      this._closeWizard();
    },
    
    _getPage: function (pageId) {
      return this.element
        .find('.wizard-page[data-page-id="' + pageId + '"]')
    },
    
    _showPage: function (pageId) {
      this.element
        .find('.progress-pages').find('li[data-page-id="' + pageId + '"]')
        .show();
      
      this._getPage(pageId)
        .addClass('wizard-page-visible');
      
      this._updateButtons();
      this._updatePageNumbers();
    },

    _hidePage: function (pageId) {
      this.element
        .find('.progress-pages').find('li[data-page-id="' + pageId + '"]')
        .hide();
      
      this.element
        .find('.wizard-page[data-page-id="' + pageId + '"]')
        .removeClass('wizard-page-visible');
      
      this._updateButtons();
      this._updatePageNumbers();
    },
    
    _nextPage: function () {
      var index = this.element
        .find('.wizard-page-active')
        .index('.wizard-page-visible');
    
      this.element
        .find('.wizard-page-active')
        .removeClass('wizard-page-active');
      
      var visiblePages = this.element.find('.wizard-page-visible');
      
      var visiblePage = $(visiblePages[index + 1])
        .addClass('wizard-page-active');
      
      this._updateButtons();
      this._updatePageNumbers();
      
      this.element.trigger('pageChange', {
        id: visiblePage.attr('data-page-id')
      });
    },
    
    _prevPage: function () {
      var index = this.element
        .find('.wizard-page-active')
        .index('.wizard-page-visible');
    
      this.element
        .find('.wizard-page-active')
        .removeClass('wizard-page-active');
      
      var visiblePages = this.element.find('.wizard-page-visible');
      var visiblePage = $(visiblePages[index - 1])
        .addClass('wizard-page-active');
      
      this._updateButtons();
      this._updatePageNumbers();
      
      this.element.trigger('pageChange', {
        id: visiblePage.attr('data-page-id')
      });
    },
    
    _closeWizard: function () {
      $(this.element).remove();
      window.location.reload(true);
    },
    
    _createWorkspaceLoad: function (workspaceEntityId) {
      return function (callback) {
        mApi().workspace.workspaces
          .read(workspaceEntityId)
          .callback(callback);
      }
    },
    
    _createWorkspaceDetailsLoad: function (workspaceEntityId) {
      return function (callback) {
        mApi().workspace.workspaces.details
          .read(workspaceEntityId)
          .callback(callback);
      }
    },
    
    _load: function (callback) {
      var loads = [
        this._createWorkspaceLoad(this.options.workspaceEntityId), 
        this._createWorkspaceDetailsLoad(this.options.workspaceEntityId)
      ];
      
      async.parallel(loads, function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var workspace = results[0];
          var workspaceDetails = results[1];

          renderDustTemplate('workspacecopywizard/workspace-copy-wizard.dust', {
            workspace: workspace,
            workspaceDetails: workspaceDetails
          }, function (text) {
            callback(text);
          });
        }
      });
    },
    
    _updatePageNumbers: function () {
      this.element.find('.currentPage').text(this.element.find('.wizard-page-active').index('.wizard-page-visible') + 1);
      this.element.find('.totalPages').text(this.element.find('.wizard-page-visible').length);
    },
    
    _updateButtons: function () {
      var index = this.element
        .find('.wizard-page-active')
        .index('.wizard-page-visible');
      
      var visiblePages = this.element.find('.wizard-page-visible');
      
      if ((visiblePages.length - 1) <= index) {
        this.element.find('.next').hide();
      } else {
        this.element.find('.next').show();
      }
      
      if (index > 0) {
        this.element.find('.prev').show();
      } else {
        this.element.find('.prev').hide();
      }
    },
    
    _onPageChange: function (event, data) {
      switch (data.id) {
        case 'summary':
          this.element.find('.summary').empty();
          
          var copyWorkspaceStep = this._addSummaryStep("copy-workspace", getLocaleText('plugin.workspacecopywizard.summarySteps.copyWorkspace'));
          var name = this._getPage('name').find('input[name="workspace-name"]').val();
          var nameExtension = this._getPage('name').find('input[name="workspace-name-extension"]').val();
          
          $('<ul>')
            .append($('<li>').text(nameExtension ? 
              getLocaleText('plugin.workspacecopywizard.summarySteps.copyWorkspaceNameWithExtension', name, nameExtension) :
              getLocaleText('plugin.workspacecopywizard.summarySteps.copyWorkspaceName', name)))
            .appendTo(copyWorkspaceStep);
          
          var beginDate = $(this.element).find('input[name="beginDate"]')
            .datepicker('getDate');
          
          var endDate = $(this.element).find('input[name="endDate"]')
            .datepicker('getDate');
          
          if (beginDate || endDate) {
            var changeDatesStep = this._addSummaryStep('change-dates', getLocaleText('plugin.workspacecopywizard.summarySteps.changeDates'));
            var details = $('<ul>').appendTo(changeDatesStep);
            
            if (beginDate) {
              details.append($('<li>').text(getLocaleText('plugin.workspacecopywizard.summarySteps.changeDatesBeginDate', formatDate(beginDate))));
            }
           
            if (endDate) {
              details.append($('<li>').text(getLocaleText('plugin.workspacecopywizard.summarySteps.changeDatesEndDate', formatDate(endDate))));
            }
          }
          
          if (this.element.find('input[name="copy-discussions-areas"]').prop('checked')) {
            this._addSummaryStep('copy-discussions-areas', getLocaleText('plugin.workspacecopywizard.summarySteps.copyDiscussionAreas'));
          }
          
          if (this.element.find('input[name="copy-materials"]').prop('checked')) {
            var linkMaterials = this._getPage('materials').find('input[name="material-copy-style"]:checked').val() == 'link';
            
            this._addSummaryStep('copy-materials', linkMaterials ? 
              getLocaleText('plugin.workspacecopywizard.summarySteps.copyMaterialsLink') :
              getLocaleText('plugin.workspacecopywizard.summarySteps.copyMaterials'));
          }
          
        break;
      }
    },
    
    _setCreatedWorkspace: function (createdWorkspace) {
      this._createdWorkspace = createdWorkspace;
    },
    
    _addSummaryStep: function (id, text) {
      return $('<li>')
        .append($('<span>').text(text))
        .attr({
          'data-id': id
        })
        .appendTo($(this.element).find('.summary')); 
    },
    
    _doCopy: function (stepIds) {
      var steps = $.map(stepIds, $.proxy(function (stepId) {
        return $.proxy(function (callback) {
          $(this.element)
            .find('.summary li[data-id="' + stepId + '"]')
            .addClass('inProgress');
          
          this.options.steps[stepId].call(this, $.proxy(function (err, result) {
            $(this.element)
              .find('.summary li[data-id="' + stepId + '"]')
              .removeClass('inProgress')
              .addClass(err ? 'error' : 'success');
            callback(err, result);
          }, this));
        }, this);
      }, this));
      
      async.series(steps, $.proxy(function(err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          mApi().workspace.workspaces.details
            .read(this._createdWorkspace.id)
            .callback($.proxy(function (err, details) {
              if (err) {
                $('.notification-queue').notificationQueue('notification', 'error', err);
              } else {
                var summaryPage = this._getPage('summary');
                var name = this._createdWorkspace.name + (this._createdWorkspace.nameExtension ? ' (' + this._createdWorkspace.nameExtension + ')' : '');
                
                summaryPage
                  .find('.external-view-url')
                  .attr('href', details.externalViewUrl)
                  .attr('title', details.externalViewUrl);
                
                summaryPage
                  .find('.workspace-entity-url')
                  .attr('href', CONTEXTPATH + '/workspace/' + this._createdWorkspace.urlName)
                  .attr('title', name);
                
                summaryPage
                  .find('.proceed-buttons')
                  .show();
              }
            }, this));
        }
      }, this));
    }
    
  });
  
}).call(this);
