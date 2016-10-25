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
      
      // Init grading scales
      
      this._gradingScales = null;
    },
    
    open: function(requestCard) {
      this._evaluationModal = $('<div>')
        .addClass('eval-modal')
        .appendTo('body');
      $('body').addClass('no-scroll');
      
      // Load assessment
      
      if ($(requestCard).attr('data-evaluated') == 'true') {
        var courseStudentIdentifier = $(requestCard).attr('data-course-student-identifier');
        mApi({async: false}).evaluation.courseStudent.assessment
          .read(courseStudentIdentifier)
          .callback($.proxy(function (err, assessment) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              this._assessment = assessment;
            }
          }, this));
      }
      else {
        this._assessment = null;
      }
      
      // Load assessors
      
      var workspaceEntityId = $(requestCard).attr('data-workspace-entity-id');
      mApi().workspace.workspaces.staffMembers
        .read(workspaceEntityId, {orderBy: 'name'})
        .callback($.proxy(function (err, staffMembers) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          else {
            
            // Render modal
            
            renderDustTemplate("evaluation/evaluation-modal-view.dust", {
              studentName: $(requestCard).find('.evaluation-request-student').text(),
              studyProgrammeName: $(requestCard).find('.evaluation-request-study-programme').text(),
              courseName: $(requestCard).find('.workspace-name').text(),
              gradingScales: this._gradingScales||{},
              assessors: staffMembers,
              assessmentIdentifier: this._assessment ? this._assessment.identifier : ''
            }, $.proxy(function (html) {
              
              // Modal UI
              
              this._evaluationModal.append(html);
              
              // Verbal assessment and CKEditor
              
              var verbalAssessmentEditor = this._evaluationModal.find("#evaluateFormLiteralEvaluation")[0];
              $(verbalAssessmentEditor).val(this._assessment ? this._assessment.verbalAssessment : '');
              CKEDITOR.replace(verbalAssessmentEditor, this.options.ckeditor);

              // Assessment date and date picker
              
              var dateEditor = $(this._evaluationModal).find('input[name="evaluationDate"]'); 
              $(dateEditor)
                .css({'z-index': 9999, 'position': 'relative'})
                .attr('type', 'text')
                .datepicker();
              var evaluationDate = this._assessment ? new Date(moment(this._assessment.assessmentDate)) : new Date();
              $(dateEditor).datepicker('setDate', evaluationDate);
              
              // Assessor and grade
              
              if (this._assessment) {
                $('#assessor').val(this._assessment.assessorIdentifier);
                $('#grade').val(this._assessment.gradingScaleIdentifier + '@' + this._assessment.gradeIdentifier);
              }

              // Save assessment button
              
              $('.button-evaluate-passing').click($.proxy(function(event) {
                this._saveAssessment();
              }, this));
              
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
    },

    setGradingScales: function(gradingScales) {
      this._gradingScales = gradingScales;
    },
    
    _saveAssessment: function() {
      alert('let us shave!!');
    }
  });
  
}).call(this);
