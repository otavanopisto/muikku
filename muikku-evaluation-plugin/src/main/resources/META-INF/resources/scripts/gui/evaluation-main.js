(function() {
  'use strict';
  
  // Evaluation main view widget

  $.widget("custom.evaluationMainView", {
    _create : function() {
      this._loadOperations = 0;
      this.element.on("loadStart", $.proxy(this._onLoadStart, this));
      this.element.on("loadEnd", $.proxy(this._onLoadEnd, this));
      this._loadAssessmentRequests();
    },
    _loadAssessmentRequests: function () {
      this.element.trigger("loadStart", $('.evaluation-cards-container'));
      var workspaceEntityId = $('#workspaceEntityId').val()||undefined;
      
      // View title (TODO localize)
      if (workspaceEntityId) {
        $('.evaluation-cards-title h3').text($('#workspaceName').val());
      }
      else {
        $('.evaluation-cards-title h3').text(getLocaleText("plugin.evaluation.evaluationRequestsTitle"));
      }
      
      var requestContainer = $('.evaluation-cards-container'); 
      mApi().evaluation.compositeAssessmentRequests
        .read({workspaceEntityId: workspaceEntityId})
        .callback($.proxy(function (err, assessmentRequests) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          else {
            // Default sort by lowest assessment request date first
            assessmentRequests.sort(function (a, b) {
              var a = Date.parse(a.assessmentRequestDate);
              var b = Date.parse(b.assessmentRequestDate);
              return isNaN(a) || isNaN(b) ? isNaN(a) ? isNaN(b) ? 0 : 1 : -1 : a < b ? -1 : a > b ? 1 : 0;
            });
            for (var i = 0; i < assessmentRequests.length; i++) {
              assessmentRequests[i] = $.extend({}, assessmentRequests[i], {workspaceMode: workspaceEntityId});
              renderDustTemplate("evaluation/evaluation-card.dust", assessmentRequests[i], $.proxy(function (html) {
                $(requestContainer).append(html);
              }, this));
            }
            this.element.trigger("loadEnd", $('.evaluation-cards-container'));
          }
        }, this)); 
    },
    _onLoadStart: function(event, target) {
      this._loadOperations++;
      if (this._loadOperations == 1) {
        var loadingContainer = $('<div>')
          .addClass('loading')
          .appendTo(target);
      }
    },
    _onLoadEnd: function(event, target) {
      this._loadOperations--;
      if (this._loadOperations == 0) {
        $(document).find('div.loading').remove();
      }
    }
  });

  $(document).ready(function () {
    $(document).evaluationMainView().evaluationModal().muikkuMaterialLoader({
      prependTitle: false,
      readOnlyFields: true,
      fieldlessMode: true
    });
    $(document).trigger("loadStart", $('.evaluation-cards-container'));
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
        $(document).trigger("loadEnd", $('.evaluation-cards-container'));
      }, this)); 
  });

  $(document).on('click', '.evaluate-button', function (event) {
    var workspaceEntityId = $('#workspaceEntityId').val()||undefined;
    var requestCard = event.target.closest('.evaluation-card');
    $(document).evaluationModal('open', requestCard, !workspaceEntityId);
  });
  
  // Sort by assessment request date, ascending
  $(document).on('click', '.icon-sort-amount-asc', function (event) {
    $('.eval-sorting').removeClass('selected');
    $(event.target).addClass('selected');
    var cards = $('.evaluation-card').sort(function (a,b) {
      var a = Date.parse($(a).attr('data-assessment-request-date'));
      var b = Date.parse($(b).attr('data-assessment-request-date'));
      return isNaN(a) || isNaN(b) ? isNaN(a) ? isNaN(b) ? 0 : 1 : -1 : a < b ? -1 : a > b ? 1 : 0;
    });
    $('.evaluation-cards-container').html(cards);
  });

  // Sort by assessment request date, descending
  $(document).on('click', '.icon-sort-amount-desc', function (event) {
    $('.eval-sorting').removeClass('selected');
    $(event.target).addClass('selected');
    var cards = $('.evaluation-card').sort(function (a,b) {
      var a = Date.parse($(a).attr('data-assessment-request-date'));
      var b = Date.parse($(b).attr('data-assessment-request-date'));
      return isNaN(a) || isNaN(b) ? isNaN(a) ? isNaN(b) ? 0 : 1 : -1 : a < b ? 1 : a > b ? -1 : 0;   
    });
    $('.evaluation-cards-container').html(cards);
  });

  // Sort by student name, ascending
  $(document).on('click', '.icon-sort-alpha-asc', function (event) {
    $('.eval-sorting').removeClass('selected');
    $(event.target).addClass('selected');
    var cards = $('.evaluation-card').sort(function (a,b) {
      var a = $(a).find('.evaluation-card-student').text().toLowerCase();
      var b = $(b).find('.evaluation-card-student').text().toLowerCase();
      return a < b ? -1 : a > b ? 1 : 0;
    });
    $('.evaluation-cards-container').html(cards);
  });

  // Sort by student name, descending
  $(document).on('click', '.icon-sort-alpha-desc', function (event) {
    $('.eval-sorting').removeClass('selected');
    $(event.target).addClass('selected');
    var cards = $('.evaluation-card').sort(function (a,b) {
      var a = $(a).find('.evaluation-card-student').text().toLowerCase();
      var b = $(b).find('.evaluation-card-student').text().toLowerCase();
      return a < b ? 1 : a > b ? -1 : 0;
    });
    $('.evaluation-cards-container').html(cards);
  });
  
  $(document).on('click', '.eval-home', function(event) {
    location.href = location.href.split("?")[0];
  });
  
}).call(this);
