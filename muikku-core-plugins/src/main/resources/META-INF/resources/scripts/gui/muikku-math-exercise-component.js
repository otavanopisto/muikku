(function() {
  'use strict';

  $.widget("custom.muikkuMathExerciseField", {
    options : {
      readonly: false,
      setReadonly: function (readonly) {
        $(this.element).muikkuMathExerciseField('setReadOnly', readonly);
      }
    },
    _create : function() {
      var methods = {};
      _.each($.custom.muikkuField['_proto'].options, $.proxy(function (value, key) {
        if ((!_.startsWith(key, '_')) && $.isFunction(value)) {
          if (this[key]) {
            methods[key] = $.proxy(this[key], this);
          }
        }
      }, this));

      this._answer = undefined;
      this._readonly = this.options.readonly;
      this.element.addClass("muikku-math-exercise-field");

      this.element.muikkuField($.extend(this.options, methods));

      MathJax.Hub.Config({
        jax: ["input/TeX", "output/SVG"],
        extensions: ["toMathML.js", "tex2jax.js", "MathMenu.js", "MathZoom.js", "fast-preview.js", "AssistiveMML.js", "a11y/accessibility-menu.js"],
        TeX: {
          extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"]
        },
        tex2jax: {
          inlineMath: [["$$","$$"],["\\(","\\)"]]
        },
        SVG: {useFontCache: true, useGlobalCache: false, EqnChunk: 1000000, EqnDelay: 0}
      });

      if (this._readonly) {
        this._initializeReadonly();
      } else {
        this._initializeEditor();
      }

//      this._editor = CKEDITOR.replace(this.element[0], this.options.ckeditor);
//      this._editor.on('contentChange', $.proxy(this._onContentChange, this));
//      this._editor.on('instanceReady', $.proxy(this._onInstanceReady, this));
    },

    _initializeReadonly: function (answer) {
      this.element.empty();

      var viewerElement = $('<div class="muikku-math-exercise-field-viewer">');
      this.element.append(viewerElement);
      
      this._answerHandler = {
        get: $.proxy(function () {
          return this._answer;
        }, this),
        set: $.proxy(function (answer) {
          var viewerField = this.element.find('.muikku-math-exercise-field-viewer');
          viewerField.html(answer);
          viewerField.find("span.muikku-math-exercise-formula").each($.proxy(function (index, formula) {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, formula]);
          }, this));
        }, this)
      };

      if (answer) {
        this._answerHandler.set(answer);
      }
    },

    _initializeEditor: function (answer) {
      this.element.empty();
      
      var editorElement = $('<div class="muikku-math-exercise-field-editor answer">');
      var resultElement = $('<div class="muikku-math-exercise-field-result result">').text("\\(\\)");
      this.element.append(editorElement);
      this.element.append(resultElement);

      // Initialize the result element as MathJax render output
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, resultElement[0]]);
      
      // Initialize digabi editor
      makeRichText(this.element.find(".muikku-math-exercise-field-editor")[0], {
        screenshot: {
          saver: ({data}) =>
            new Promise(resolve => {
              const reader = new FileReader()
              reader.onload = evt => resolve(evt.target.result)
              reader.readAsDataURL(data)
            }),
          limit: 10
        },
        baseUrl: 'https://dev.muikku.fi:8443',
        updateMathImg: $.proxy(this.updateImage, this)
      });

      this._answerHandler = {
        get: $.proxy(function () {
          var editorField = this.element.find(".muikku-math-exercise-field-editor");
          
          var answerField = editorField.clone();
          // If there was math editor open, remove it
          answerField.find("div.math-editor").remove();
          
          answerField.find("img.muikku-math-exercise-formula").each(function () {
            var img = $(this);
            var latex = img.attr("alt") || '';
            if (latex) {
              // Add latex formatting so the answer is ready to render as-is
              latex = '\\(' + latex + '\\)';
              img.replaceWith($('<span class="muikku-math-exercise-formula">').text(latex));
            } else {
              // Remove img's that don't have latex
              img.remove();
            }
          });
          
          this._answer = answerField.html();
          return this._answer;
        }, this),
        set: $.proxy(function (answer) {
          var editorField = this.element.find(".muikku-math-exercise-field-editor");

          editorField.html(answer);

          editorField.find("span.muikku-math-exercise-formula").each($.proxy(function (index, formulaElement) {
            var formula = $(formulaElement);
            var latex = formula.text();
            // Remove beginning \( and trailing \) from text
            latex = latex.replace(/^\\\(|\\\)$/g, '');

            var img = $('<img alt="' + latex + '" class="muikku-math-exercise-formula"/>');
            formula.replaceWith(img);
            
            // Queue up an event to render the latex in img
            MathJax.Hub.Queue($.proxy(function () {
              this.updateImage(img, latex);
            }, this));
          }, this));
        }, this)
      };
      
      if (answer) {
        this._answerHandler.set(answer);
      }
    },
    
    updateImage: function (img, latex) {
      img.addClass('muikku-math-exercise-formula');
      
      this._updateMathImageSVG(latex, function (svg) {
        img.prop({
          src: svg,
          alt: latex
        });
        
        img.closest('[data-js="answer"]').trigger('input');
      });
    },
    
    _updateMathImageSVG: function (latex, cb) {
      // Queue up so we don't trigger before MathJax has fully initialized
      MathJax.Hub.Queue($.proxy(function () {
        // Find the Jax associated with the result field
        var renderElement = this.element.find('.muikku-math-exercise-field-result');
        
        if (renderElement.length) {
          var jax = MathJax.Hub.getAllJax(renderElement[0])[0];

          // Update latex on the result field
          MathJax.Hub.Queue(['Text', jax, '\\displaystyle{' + latex + '}']);
  
          // Take the resulting SVG and return it to the callback
          MathJax.Hub.Queue(() => {
            var svgElement = this.element.find('.muikku-math-exercise-field-result svg');
            if (svgElement.length) {
              var svg = svgElement.attr('xmlns', "http://www.w3.org/2000/svg")
              svg.find('use').each(function () {
                var use = $(this)
                if (use[0].outerHTML.indexOf('xmlns:xlink') === -1) {
                  use.attr('xmlns:xlink', 'http://www.w3.org/1999/xlink') //add these for safari
                }
              })
              var svgHtml = svg.prop('outerHTML')
              //firefox fix
              svgHtml = svgHtml.replace(' xlink=', ' xmlns:xlink=')
              // Safari xlink ns issue fix
              svgHtml = svgHtml.replace(/ ns\d+:href/gi, ' xlink:href')
              cb('data:image/svg+xml;base64,' + window.btoa(svgHtml))
            } else {
              cb('data:image/svg+xml;base64,' + window.btoa(`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
                  <svg width="17px" height="15px" viewBox="0 0 17 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <title>Group 2</title>
                      <defs></defs>
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g transform="translate(-241.000000, -219.000000)">
                              <g transform="translate(209.000000, 207.000000)">
                                  <rect x="-1.58632797e-14" y="0" width="80" height="40"></rect>
                                  <g transform="translate(32.000000, 12.000000)">
                                      <polygon id="Combined-Shape" fill="#9B0000" fill-rule="nonzero" points="0 15 8.04006 0 16.08012 15"></polygon>
                                      <polygon id="Combined-Shape-path" fill="#FFFFFF" points="7 11 9 11 9 13 7 13"></polygon>
                                      <polygon id="Combined-Shape-path" fill="#FFFFFF" points="7 5 9 5 9 10 7 10"></polygon>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </svg>`));
            }
          });
        }
      }, this));
    },
    
    setReadOnly: function (readonly) {
      if (this._readonly != readonly) {
        this._readonly = readonly;
        
        if (this._readonly) {
          MathJax.Hub.Queue($.proxy(function () {
            this._initializeReadonly(this._answer);
          }, this));
        } else {
          MathJax.Hub.Queue($.proxy(function () {
            this._initializeEditor(this._answer);
          }, this));
        }
      }
    },
    
    answer: function(val) {
      if (val === undefined) {
        return this._answerHandler.get();
      } else {
        this._answer = val;
        this._answerHandler.set(this._answer);
      }
    },

    _onInstanceReady: function (event, data) {
      this.setReadOnly(this._readonly);
    },
    
    _onContentChange: function (event, data) {
    },
    
    _destroy: function () {
    }
  });

}).call(this);