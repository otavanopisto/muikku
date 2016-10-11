(function() {
  'use strict';
  
  // Evaluation main view widget

  $.widget("custom.evaluationMainView", {
    _create : function() {
      this._loadAssessmentRequests();
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
    open: function() {
      this._evaluationModal = $('<div>')
        .addClass('eval-modal')
        .appendTo('body');
      
      renderDustTemplate("evaluation/evaluation-modal-view.dust", {}, $.proxy(function (html) {
        this._evaluationModal.append(html);
        $('.eval-modal-close').click($.proxy(function (event) {
          this._evaluationModal.remove();
        }, this));
      }, this));
    }
  });

  $(document).ready(function () {
    $(document).evaluationMainView().evaluationDialog();
  });

  $(document).on('click', '.workspace-name', function (event) {
    $(document).evaluationDialog('open');
  });
  
}).call(this);
