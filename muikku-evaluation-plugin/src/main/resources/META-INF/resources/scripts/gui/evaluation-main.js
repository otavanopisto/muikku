(function() {
  'use strict';
  
  // Evaluation main view widget

  $.widget("custom.evaluationMainView", {
    _create : function() {
      this._grades = [];
      this._loadGrades();
      this._loadAssessmentRequests();
    },
    _loadGrades: function() {
      mApi().evaluation.grades
      .read()
      .callback($.proxy(function (err, grades) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          this._grades = grades;
        }
      }, this)); 
    },
    _loadAssessmentRequests: function () {
      var requestContainer = $('.evaluation-requests-container'); 
      $(requestContainer).empty();
      mApi().evaluation.assessmentRequests
        .read()
        .callback($.proxy(function (err, assessmentRequests) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          else {
            for (var i = 0; i < assessmentRequests.length; i++) {
              renderDustTemplate("evaluation/evaluation-request-card.dust", assessmentRequests[i], $.proxy(function (html) {
                $(requestContainer).append(html);
              }, this));
            }
          }
        }, this)); 
    }
  });

  // Evaluation dialog widget

  $.widget("custom.evaluationDialog", {
    options: {
    },
    open: function(requestCard) {
      this._evaluationModal = $('<div>')
        .addClass('eval-modal')
        .appendTo('body');
      
      $('body').addClass('no-scroll');
      
      renderDustTemplate("evaluation/evaluation-modal-view.dust", {
        studentName: $(requestCard).find('.evaluation-request-student').text(),
        studyProgrammeName: $(requestCard).find('.evaluation-request-study-programme').text(),
        courseName: $(requestCard).find('.workspace-name').text()
      }, $.proxy(function (html) {
        this._evaluationModal.append(html);
        $('.eval-modal-close').click($.proxy(function (event) {
          $('body').removeClass('no-scroll');
          this._evaluationModal.remove();
        }, this));
      }, this));
    }
  });

  $(document).ready(function () {
    $(document).evaluationMainView().evaluationDialog();
  });

  $(document).on('click', '.evaluate-button', function (event) {
    var requestCard = event.target.closest('.evaluation-request');
    $(document).evaluationDialog('open', requestCard);
  });
  
}).call(this);
