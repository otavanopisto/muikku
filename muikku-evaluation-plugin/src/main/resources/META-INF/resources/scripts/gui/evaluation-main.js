(function() {
  'use strict';
  
  // Evaluation main view widget

  $.widget("custom.evaluationMainView", {
    _create : function() {
      this._loadAssessmentRequests();
    },
    _loadAssessmentRequests: function () {
      var workspaceEntityId = $('#workspaceEntityId').val()||undefined;
      
      // View title (TODO localize)
      if (workspaceEntityId) {
        $('.evaluation-requests-title h3').text($('#workspaceName').val());
      }
      else {
        $('.evaluation-requests-title h3').text('Arviointipyynnöt');
      }
      
      var requestContainer = $('.evaluation-requests-container'); 
      $(requestContainer).empty();
      mApi().evaluation.compositeAssessmentRequests
        .read({workspaceEntityId: workspaceEntityId})
        .callback($.proxy(function (err, assessmentRequests) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          else {
            // Default sort by lowest assessment request date first
            assessmentRequests.sort(function (a, b) {
              return Date.parse(a.assessmentRequestDate) > Date.parse(b.assessmentRequestDate);
            });
            for (var i = 0; i < assessmentRequests.length; i++) {
              if (!workspaceEntityId) {
                assessmentRequests[i] = $.extend({}, assessmentRequests[i], {showWorkspace: true});
              }
              renderDustTemplate("evaluation/evaluation-request-card.dust", assessmentRequests[i], $.proxy(function (html) {
                $(requestContainer).append(html);
              }, this));
            }
          }
        }, this)); 
    }
  });

  $(document).ready(function () {
    $(document).evaluationMainView().evaluationModal().muikkuMaterialLoader({
      prependTitle: false,
      readOnlyFields: true,
      fieldlessMode: true
    });
    // Grading scales
    mApi().evaluation.compositeGradingScales
      .read()
      .callback($.proxy(function (err, gradingScales) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          $(document).evaluationModal('setGradingScales', gradingScales);
        }
      }, this)); 
  });

  $(document).on('click', '.evaluate-button', function (event) {
    var requestCard = event.target.closest('.evaluation-request');
    $(document).evaluationModal('open', requestCard);
  });
  
  // Sort by assessment request date, ascending
  $(document).on('click', '.icon-sort-amount-asc', function (event) {
    $('.eval-sorting').removeClass('selected');
    $(event.target).addClass('selected');
    var cards = $('.evaluation-request').sort(function (a,b) {
      return Date.parse($(a).attr('data-assessment-request-date')) > Date.parse($(b).attr('data-assessment-request-date')); 
    });
    $('.evaluation-requests-container').html(cards);
  });

  // Sort by assessment request date, descending
  $(document).on('click', '.icon-sort-amount-desc', function (event) {
    $('.eval-sorting').removeClass('selected');
    $(event.target).addClass('selected');
    var cards = $('.evaluation-request').sort(function (a,b) {
      return Date.parse($(a).attr('data-assessment-request-date')) < Date.parse($(b).attr('data-assessment-request-date')); 
    });
    $('.evaluation-requests-container').html(cards);
  });

  // Sort by student name, ascending
  $(document).on('click', '.icon-sort-alpha-asc', function (event) {
    $('.eval-sorting').removeClass('selected');
    $(event.target).addClass('selected');
    var cards = $('.evaluation-request').sort(function (a,b) {
      return $(a).find('.evaluation-request-student').text() > $(b).find('.evaluation-request-student').text(); 
    });
    $('.evaluation-requests-container').html(cards);
  });

  // Sort by student name, descending
  $(document).on('click', '.icon-sort-alpha-desc', function (event) {
    $('.eval-sorting').removeClass('selected');
    $(event.target).addClass('selected');
    var cards = $('.evaluation-request').sort(function (a,b) {
      return $(a).find('.evaluation-request-student').text() < $(b).find('.evaluation-request-student').text(); 
    });
    $('.evaluation-requests-container').html(cards);
  });
  
}).call(this);
