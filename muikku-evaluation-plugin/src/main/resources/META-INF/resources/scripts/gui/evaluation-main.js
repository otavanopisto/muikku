(function() {
  'use strict';

  $.widget("custom.evaluationMainView", {
    _create : function() {
      this._loadAssessmentRequests();
    },
    _loadAssessmentRequests: function () {
      mApi().evaluation.assessmentRequests
        .read()
        .callback($.proxy(function (err, assessmentRequests) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          else {
            // TODO assessment requests to ui
          }
        }, this)); 
    }
    
  });

  $(document).ready(function () {
    $(document).evaluationMainView();
  });

}).call(this);
