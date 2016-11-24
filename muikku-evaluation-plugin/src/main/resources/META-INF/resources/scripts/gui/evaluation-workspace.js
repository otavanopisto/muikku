(function() {
  'use strict';
  
  // Evaluation workspace view widget

  $.widget("custom.evaluationWorkspaceView", {
    _create : function() {
      this._loadAssessmentRequests();
    },
    getGrades() {
      return this._grades;
    },
    _loadAssessmentRequests: function () {
      var requestContainer = $('.evaluation-workspace-students-container'); 
      $(requestContainer).empty();
      mApi().evaluation.compositeAssessmentRequests
        .read()
        .callback($.proxy(function (err, assessmentRequests) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          else {
            for (var i = 0; i < assessmentRequests.length; i++) {
              renderDustTemplate("evaluation/evaluation-workspace-student-card.dust", assessmentRequests[i], $.proxy(function (html) {
                $(requestContainer).append(html);
              }, this));
            }
          }
        }, this)); 
    }
  });

    $(document).ready(function () {
    $(document).evaluationWorkspaceView().evaluationModal();
  });

  $(document).on('click', '.evaluate-button', function (event) {
    var requestCard = event.target.closest('.evaluation-request');
    $(document).evaluationModal('open', requestCard);
  });
  
}).call(this);
