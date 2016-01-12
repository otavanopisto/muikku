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

        this._dialog.find('.wizard-page').each($.proxy(function (index, page) {
          var pageId = $(page)
            .attr('data-page-id');
          
          var progressPage = $('<li>')
            .attr({
              'data-page-id': pageId
            })
            .text(pageId);
          
          this._dialog.find('.progress')
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
          }]
        });
        
      }, this));
    },
    
    _showPage: function (pageId) {
      this._dialog
        .find('.progress').find('li[data-page-id="' + pageId + '"]')
        .show();
      
      this._dialog
        .find('.wizard-page[data-page-id="' + pageId + '"]')
        .addClass('wizard-page-visible');
    },

    _hidePage: function (pageId) {
      this._dialog
        .find('.progress').find('li[data-page-id="' + pageId + '"]')
        .hide();
      
      this._dialog
        .find('.wizard-page[data-page-id="' + pageId + '"]')
        .removeClass('wizard-page-visible');
    },
    
    _nextPage: function () {
      var index = this._dialog
        .find('.wizard-page-active')
        .index('.wizard-page-visible');
    
      this._dialog
        .find('.wizard-page-active')
        .removeClass('wizard-page-active');
      
      var visiblePages = this._dialog.find('.wizard-page-visible');
      
      $(visiblePages[index + 1])
        .addClass('wizard-page-active');
      
      if ((visiblePages.length - 1) <= (index + 1)) {
        this._dialog.dialog("widget")
          .find('.button-next')
          .button('disable');
      } else {
        this._dialog.dialog("widget")
          .find('.button-next')
          .button('enable');
      }
      
      if ((index + 1) >= 0) {
        this._dialog.dialog("widget")
          .find('.button-prev')
          .button('enable');
      } else {
        this._dialog.dialog("widget")
          .find('.button-prev')
          .button('disable');
      }

    },
    
    _prevPage: function () {
      var index = this._dialog
        .find('.wizard-page-active')
        .index('.wizard-page-visible');
    
      this._dialog
        .find('.wizard-page-active')
        .removeClass('wizard-page-active');
      
      var visiblePages = this._dialog.find('.wizard-page-visible');
      
      $(visiblePages[index - 1])
        .addClass('wizard-page-active');
      
      if ((visiblePages.length - 1) <= (index + 1)) {
        this._dialog.dialog("widget")
          .find('.button-next')
          .button('disable');
      } else {
        this._dialog.dialog("widget")
          .find('.button-next')
          .button('enable');
      }
      
      if ((index - 1) > 0) {
        this._dialog.dialog("widget")
          .find('.button-prev')
          .button('enable');
      } else {
        this._dialog.dialog("widget")
          .find('.button-prev')
          .button('disable');
      }

    },
    
    _load: function (callback) {
      renderDustTemplate('workspacecopywizard/workspace-copy-wizard.dust', {}, function (text) {
        callback(text);
      });
    }
    
  });
  
  $(document).ready(function () {
    $('<div>').workspaceCopyWizard();
  });
  
}).call(this);