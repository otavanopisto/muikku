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

  // Evaluation dialog widget

  $.widget("custom.evaluationDialog", {
    _create : function() {
      this._loadGradingScales();
    },
    open: function(requestCard) {
      this._evaluationModal = $('<div>')
        .addClass('eval-modal')
        .appendTo('body');
      $('body').addClass('no-scroll');
      
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
    _loadGradingScales: function() {
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
