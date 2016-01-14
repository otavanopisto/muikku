(function() {
  'use strict';
  
  $.widget("custom.workspaceCopyWizard", {
    options: {
      workspaceEntityId: null,
      steps: null
    },
    
    _create : function() {
      this.element.addClass('wizard workspace-copy-wizard flex-grid');
      this._createdWorkspace = null;
      
      this._load($.proxy(function (html) {
        this.element.html(html);
        this.element
          .find('.wizard-page')
          .first()
          .addClass('wizard-page-active');
        
        

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
      
      this._doCopy(steps);
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
          
          this._addSummaryStep("copy-course", "Copy course");
          
          var beginDate = $('input[name="beginDate"]')
            .datepicker('getDate');
          
          var endDate = $('input[name="endDate"]')
            .datepicker('getDate');
          
          if (beginDate || endDate) {
            this._addSummaryStep('change-dates', "Change dates");
          }
          
          if (this.element.find('input[name="copy-materials"]').prop('checked')) {
            this._addSummaryStep('copy-materials', "Copy materials");
          }
        break;
      }
    },
    
    _setCreatedWorkspace: function (createdWorkspace) {
      this._createdWorkspace = createdWorkspace;
    },
    
    _addSummaryStep: function (id, text) {
      return $('<li>')
        .text(text)
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
                  .find('.externalViewUrl')
                  .attr('href', details.externalViewUrl)
                  .text(details.externalViewUrl);
                
                summaryPage
                  .find('.workspaceEntityUrl')
                  .attr('href', CONTEXTPATH + '/workspace/' + this._createdWorkspace.urlName)
                  .text(name);
              }
            }, this));
        }
      }, this));
    }
    
  });
  
}).call(this);
