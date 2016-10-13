(function() {
  'use strict';
  
  $.widget("custom.evaluationModal", {
    options: {
      ckeditor: {
        baseFloatZIndex: 99999,
        language: getLocale(),
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
          { name: 'insert', items : [ 'Muikku-mathjax' ] },
          { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
          { name: 'tools', items: [ 'Maximize' ] }
        ],
        extraPlugins: {
          'widget': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/4.5.8/',
          'lineutils': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/4.5.8/'
        }
      }
    },
    _create : function() {
      // CKEditor
      var extraPlugins = [];
      $.each($.extend(this.options.ckeditor.extraPlugins, {}, true), $.proxy(function (plugin, url) {
        CKEDITOR.plugins.addExternal(plugin, url);
        extraPlugins.push(plugin);
      }, this));
      this.options.ckeditor.extraPlugins = extraPlugins.join(',');
      // Grading scales
      mApi().evaluation.compositeGradingScales
      .read()
      .callback($.proxy(function (err, gradingScales) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          this._gradingScales = gradingScales;
        }
      }, this)); 
    },
    open: function(requestCard) {
      this._evaluationModal = $('<div>')
        .addClass('eval-modal')
        .appendTo('body');
      $('body').addClass('no-scroll');
      
      var verbalAssessment, assessorId, gradeId;
      var evaluationDate = new Date();
      if ($(requestCard).attr('data-evaluated') == 'true') {
        // load evaluation data
      }
      
      // Assessors
      var workspaceEntityId = $(requestCard).attr('data-workspace-entity-id');
      mApi().workspace.workspaces.staffMembers
        .read(workspaceEntityId, {orderBy: 'name'})
        .callback($.proxy(function (err, staffMembers) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          else {
            // Modal itself
            renderDustTemplate("evaluation/evaluation-modal-view.dust", {
              studentName: $(requestCard).find('.evaluation-request-student').text(),
              studyProgrammeName: $(requestCard).find('.evaluation-request-study-programme').text(),
              courseName: $(requestCard).find('.workspace-name').text(),
              gradingScales: this._gradingScales||{},
              assessors: staffMembers
            }, $.proxy(function (html) {
              this._evaluationModal.append(html);
              // CKEditor
              CKEDITOR.replace(this._evaluationModal.find("#evaluateFormLiteralEvaluation")[0], this.options.ckeditor);
              $(this._evaluationModal).find('input[name="evaluationDate"]')
                .css({'z-index': 9999, 'position': 'relative'})
                .attr('type', 'text')
                .datepicker();
              $(this._evaluationModal).find('input[name="evaluationDate"]')
                .datepicker('setDate', evaluationDate);
              // Close button
              $('.eval-modal-close').click($.proxy(function (event) {
                this.close();
              }, this));
            }, this));
          }
        }, this));
    },
    close: function() {
      $('body').removeClass('no-scroll');
      this._evaluationModal.remove();
    }
  });
  
}).call(this);
