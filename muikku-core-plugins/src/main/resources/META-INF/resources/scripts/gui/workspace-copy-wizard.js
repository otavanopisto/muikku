(function() {
  'use strict';
  
  $.widget("custom.workspaceCopyWizard", {
    options: {
      
    },
    
    _create : function() {
      this._load($.proxy(function (html) {
        this._dialog = $(html);
        this._dialog
          .find('.wizard-page')
          .first()
          .addClass('wizard-page-active');

        this._dialog.on('click', 'input[name="copy-materials"]', $.proxy(function (event) {
          var materialPage = this._dialog.find('section[data-page-id="materials"]');
          if ($(event.target).prop('checked')) {
            this._showPage('materials');
          } else {
            this._hidePage('materials');
          }
        }, this));
        
        this.element.on("pageChange", $.proxy(this._onPageChange, this));

        this._dialog.find('.wizard-page').each($.proxy(function (index, page) {
          var pageId = $(page)
            .attr('data-page-id');
          
          var progressPage = $('<li>')
            .attr({
              'data-page-id': pageId
            })
            .text(pageId);
          
          this._dialog.find('.progress-pages')
            .append(progressPage);
          
          if ($(page).hasClass('wizard-page-visible')) {
            progressPage.show();
          } else {
            progressPage.hide();
          }
          
        }, this));
        
        this._dialog.dialog({
          modal: true, 
          resizable: false,
          width: 'auto',
          height: 'auto',
          buttons: [{
            'text': this._dialog.attr('data-button-prev'),
            'class': 'button-prev',
            'disabled': true,
            'click': $.proxy(function(event) {
              this._prevPage();
            }, this)
          }, {
            'text': this._dialog.attr('data-button-next'),
            'class': 'button-next',
            'disabled': false,
            'click': $.proxy(function(event) {
              this._nextPage();
            }, this)
          }, {
            'text': this._dialog.attr('data-copy'),
            'class': 'button-copy',
            'disabled': true,
            'click': $.proxy(function(event) {
              var steps = $.map(this._dialog.find('.summary li'), function (li) {
                return $(li).attr('data-id');
              });
              
              this._doCopy(steps);
            }, this)
          }]
        });

        this._updatePageNumbers();
      }, this));
    },
    
    _showPage: function (pageId) {
      this._dialog
        .find('.progress-pages').find('li[data-page-id="' + pageId + '"]')
        .show();
      
      this._dialog
        .find('.wizard-page[data-page-id="' + pageId + '"]')
        .addClass('wizard-page-visible');
      
      this._updateButtons();
      this._updatePageNumbers();
    },

    _hidePage: function (pageId) {
      this._dialog
        .find('.progress-pages').find('li[data-page-id="' + pageId + '"]')
        .hide();
      
      this._dialog
        .find('.wizard-page[data-page-id="' + pageId + '"]')
        .removeClass('wizard-page-visible');
      
      this._updateButtons();
      this._updatePageNumbers();
    },
    
    _nextPage: function () {
      var index = this._dialog
        .find('.wizard-page-active')
        .index('.wizard-page-visible');
    
      this._dialog
        .find('.wizard-page-active')
        .removeClass('wizard-page-active');
      
      var visiblePages = this._dialog.find('.wizard-page-visible');
      
      var visiblePage = $(visiblePages[index + 1])
        .addClass('wizard-page-active');
      
      this._updateButtons();
      this._updatePageNumbers();
      
      this.element.trigger('pageChange', {
        id: visiblePage.attr('data-page-id')
      });
    },
    
    _prevPage: function () {
      var index = this._dialog
        .find('.wizard-page-active')
        .index('.wizard-page-visible');
    
      this._dialog
        .find('.wizard-page-active')
        .removeClass('wizard-page-active');
      
      var visiblePages = this._dialog.find('.wizard-page-visible');
      var visiblePage = $(visiblePages[index - 1])
        .addClass('wizard-page-active');
      
      this._updateButtons();
      this._updatePageNumbers();
      
      this.element.trigger('pageChange', {
        id: visiblePage.attr('data-page-id')
      });
    },
    
    _load: function (callback) {
      renderDustTemplate('workspacecopywizard/workspace-copy-wizard.dust', {}, function (text) {
        callback(text);
      });
    },
    
    _updatePageNumbers: function () {
      this._dialog.find('.currentPage').text(this._dialog.find('.wizard-page-active').index('.wizard-page-visible') + 1);
      this._dialog.find('.totalPages').text(this._dialog.find('.wizard-page-visible').length);
    },
    
    _updateButtons: function () {
      var index = this._dialog
        .find('.wizard-page-active')
        .index('.wizard-page-visible');
      
      var visiblePages = this._dialog.find('.wizard-page-visible');
      
      if ((visiblePages.length - 1) <= index) {
        this._dialog.dialog("widget")
          .find('.button-next')
          .button('disable');
      } else {
        this._dialog.dialog("widget")
          .find('.button-next')
          .button('enable');
      }
      
      if (index > 0) {
        this._dialog.dialog("widget")
          .find('.button-prev')
          .button('enable');
      } else {
        this._dialog.dialog("widget")
          .find('.button-prev')
          .button('disable');
      }
    },
    
    _onPageChange: function (event, data) {
      this._dialog.dialog("widget")
        .find('.button-copy')
        .button(data.id == 'summary' ? 'enable' : 'disable');
      
      switch (data.id) {
        case 'summary':
          $(this._dialog).find('.summary').empty();
          
          this._addSummaryStep("copy-course", "Copy course");
          if (this._dialog.find('input[name="copy-materials"]').prop('checked')) {
            this._addSummaryStep('copy-materials', "Copy materials");
          }
        break;
      }
    },
    
    _addSummaryStep: function (id, text) {
      return $('<li>')
        .text(text)
        .attr({
          'data-id': id
        })
        .appendTo($(this._dialog).find('.summary')); 
    },
    
    _doCopy: function (stepIds) {
      var steps = $.map(stepIds, $.proxy(function (stepId) {
        return $.proxy(function (callback) {
          $(this._dialog)
            .find('.summary li[data-id="' + stepId + '"]')
            .addClass('inProgress');
          
          this.options.steps[stepId]($.proxy(function (err, result) {
            $(this._dialog)
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
          // All done
        }
      }, this));
    }
    
  });
  
  $(document).ready(function () {
    $('<div>').workspaceCopyWizard({
      steps: {
        'copy-course': function (callback) {
          setTimeout(function () {
            callback(null, {});
          }, 3000);
        },
        'copy-materials': function (callback) {
          setTimeout(function () {
            callback('Errori', {});
          }, 1000);
        }
      }
    });
  });
  
}).call(this);