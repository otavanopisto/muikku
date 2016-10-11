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
    _create : function() {
    },
    open: function () {
      renderDustTemplate("evaluation/evaluation-modal-view.dust", null, $.proxy(function (html) {
        $(html).dialog({
          modal: true, 
          resizable: false,
          width: 'auto',
          height: 'auto',
          buttons : [{
            'text' : 'Cancel (localize)',
            'class' : '',
            'click' : function(event) {
              $(this).dialog().remove();
            }
          }],
          beforeClose: function(event, ui) {
            $(this).dialog().remove();          
          },
        });
      }, this));
    }
  });

  $(document).ready(function () {
    $(document).evaluationMainView();
  });

  $(document).on('click', '.workspace-name', function (event) {
    $(document).evaluationDialog().evaluationDialog('open');
  });

}).call(this);
