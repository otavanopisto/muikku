(function() {
  'use strict';
  
  // Evaluation main view widget

  $.widget("custom.evaluationMainView", {
    _create : function() {
      this._loadAssessmentRequests();
    },
    getGrades() {
      return this._grades;
    },
    _loadAssessmentRequests: function () {
      var requestContainer = $('.evaluation-requests-container'); 
      $(requestContainer).empty();
      mApi().evaluation.compositeAssessmentRequests
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

  $(document).ready(function () {
    $(document).evaluationMainView().evaluationModal();
  });

  $(document).on('click', '.evaluate-button', function (event) {
    var requestCard = event.target.closest('.evaluation-request');
    $(document).evaluationModal('open', requestCard);
  });
  
}).call(this);
