(function() {
  'use strict';
  
  $.widget("custom.imageDetails", {
    
    options: {
      typePrefix: {
        'author': '&nbsp;/&nbsp;',
        'license': ',&nbsp;'
      }
    },
    
    _create : function() {
      this._details = null;
      
      $.each(['source', 'author', 'license'], $.proxy(function (index, type) {
        this._appendDetails(type, this.element.attr('data-' + type), this.element.attr('data-' + type + '-url'));
      }, this));

      var imageWidth = this.element.attr('width');
      if (imageWidth && imageWidth > 0) {
    	  this.element.closest('figure').css('max-width', imageWidth + 'px');
    	  this.element.css('width', '');
    	  this.element.css('height', '');
      } else if (this.element.css('width')) {
      	  this.element.closest('figure').css('max-width', this.element.css('width'));
      } else if (this.element.width() > 0) {
    	  this.element.closest('figure').css('max-width', this.element.width() + 'px');
      }
      
    },
    
    _appendDetails: function (type, text, url) {
      if (text || url) {
        if (!this._details) {
          var figure = this.element.closest('figure');
          if (!figure.length) {
            var figure = $('<figure>')
              .addClass('image');
            
            var float = this.element.css('float');
            if (float) {
              this.element.css('float', 'none');
              figure.css('float', float);
            }

            var parentLink = this.element.parent('a');
            if (parentLink.length) {
              figure.insertBefore(parentLink);
              parentLink.appendTo(figure);
            } else {
              figure.insertBefore(this.element);
              this.element.appendTo(figure);
            }
          }
          
          this._details = $('<div>')
            .addClass('image-details icon-copyright')
            .appendTo(figure);
        
          this._detailsContainer = $('<div>')
            .append($('<span>').addClass('image-details-label').text(getLocaleText('plugin.workspace.materials.detailsSourceLabel')))
            .addClass('image-details-container')
            .appendTo(this._details);
        }
        
        if (this.options.typePrefix[type] && $(this._detailsContainer).children().length > 1) {
          $('<span>')
            .html(this.options.typePrefix[type])
            .appendTo(this._detailsContainer);
        }

        if (url) {
          $('<a>')
            .attr({
              href: url,
              target: "_blank"
            })
            .text(text||url)
            .appendTo(this._detailsContainer);
        } else {
          $('<span>')
            .text(text||url)
            .appendTo(this._detailsContainer);
        }
      }
    },
    
    _destroy: function () {
      
    }
  });
  
  
  
}).call(this);
