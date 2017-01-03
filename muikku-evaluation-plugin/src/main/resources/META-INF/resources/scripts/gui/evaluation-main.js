(function() {
  'use strict';
  
  // Evaluation main view widget

  $.widget("custom.evaluationMainView", {
    _create : function() {
      this._loadOperations = 0;
      this._importantRequests = [];
      this._unimportantRequests = [];
      this.element.on("loadStart", $.proxy(this._onLoadStart, this));
      this.element.on("loadEnd", $.proxy(this._onLoadEnd, this));
      this.element.on("discardCard", $.proxy(this._onDiscardCard, this));
      this.element.on("cardStateChange", $.proxy(this._onCardStateChange, this))
      this._loadAssessmentRequests();
    },
    _loadAssessmentRequests: function () {
      this.element.trigger("loadStart", $('.evaluation-cards-container'));
      var workspaceEntityId = $('#workspaceEntityId').val()||undefined;
      
      if (workspaceEntityId) {
        $('.evaluation-cards-title h3').text($('#workspaceName').val());
        $('.icon-sort-workspace-alpha-asc').hide();
        $('.icon-sort-workspace-alpha-desc').hide();
      }
      else {
        $('.evaluation-cards-title h3').text(getLocaleText("plugin.evaluation.evaluationRequestsTitle"));
      }
      
      var requestContainer = $('.evaluation-cards-container'); 
      
      mApi().user.property
        .read('important-evaluation-requests')
        .callback($.proxy(function (err, property) {

          // Important requests
          this._importantRequests = property.value ? property.value.split(',') : [];
          mApi().user.property
            .read('unimportant-evaluation-requests')
            .callback($.proxy(function (err, property) {

              // Unimportant requests
              
              this._unimportantRequests = property.value ? property.value.split(',') : [];
              mApi().evaluation.compositeAssessmentRequests
                .read({workspaceEntityId: workspaceEntityId})
                .callback($.proxy(function (err, assessmentRequests) {

                  // Requests
                  
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  }
                  else {
                    if (assessmentRequests.length > 0) {

                      // Default sort by lowest assessment request date first

                      assessmentRequests.sort($.proxy(function (c1, c2) {
                        var result = this._compareImportance(c1.workspaceUserEntityId.toString(), c2.workspaceUserEntityId.toString());
                        if (result == 0) {
                          var a = Date.parse(c1.assessmentRequestDate);
                          var b = Date.parse(c2.assessmentRequestDate);
                          return isNaN(a) || isNaN(b) ? isNaN(a) ? isNaN(b) ? 0 : 1 : -1 : a < b ? -1 : a > b ? 1 : 0;
                        }
                        return result;
                      }, this));
                      
                      for (var i = 0; i < assessmentRequests.length; i++) {
                        var requestDate = assessmentRequests[i].assessmentRequestDate;
                        var evaluationDate = assessmentRequests[i].evaluationDate;
                        var isRequest = '';
                        var isEvaluated = '';
                        var cardStateClass = '';
                        if ((requestDate && evaluationDate && requestDate > evaluationDate) || (requestDate && !evaluationDate)) {
                          cardStateClass = 'evaluation-requested';
                          isRequest = true;
                        }
                        else if (evaluationDate) {
                          cardStateClass = assessmentRequests[i].passing ? 'evaluated-passed' : 'evaluated-incomplete';
                          isEvaluated = true;
                        }
                        assessmentRequests[i] = $.extend({}, assessmentRequests[i], {
                          workspaceMode: workspaceEntityId,
                          cardStateClass: cardStateClass,
                          isRequest: isRequest,
                          isEvaluated: isEvaluated});
                        renderDustTemplate("evaluation/evaluation-card.dust", assessmentRequests[i], $.proxy(function (html) {
                          var card = $(html).appendTo(requestContainer);
                          $(card).find('.evaluate-button').on('click', function() {
                            var workspaceEntityId = $('#workspaceEntityId').val()||undefined;
                            $(document).evaluationModal('open', $(this).closest('.evaluation-card'), !workspaceEntityId);
                          });
                          $(card).find('.archive-button').on('click', function(event) {
                            var archiveCard = $(event.target).closest('.evaluation-card');
                            $(document).evaluationModal('confirmStudentArchive', archiveCard, $.proxy(function(archived) {
                              if (archived) {
                                $(document).trigger("discardCard", {workspaceUserEntityId: $(archiveCard).attr('data-workspace-user-entity-id')});
                              }
                            }, this));
                          });
                          $(card).find('.evaluation-important-button').on('click', $.proxy(function(event) {
                            this._changeRequestImportance(card, true);
                          }, this));
                          $(card).find('.evaluation-unimportant-button').on('click', $.proxy(function(event) {
                            this._changeRequestImportance(card, false);
                          }, this));
                          var workspaceUserEntityId = $(card).attr('data-workspace-user-entity-id'); 
                          if (this._isImportant(workspaceUserEntityId)) {
                            $(card).find('.evaluation-important-button').addClass('active');
                          }
                          else if (this._isUnimportant(workspaceUserEntityId)) {
                            $(card).find('.evaluation-unimportant-button').addClass('active');
                          }
                        }, this));
                      }  
                    }
                    else {
                      this._showNoCardsMessage();
                    }
                    this.element.trigger("loadEnd", $('.evaluation-cards-container'));
                  }
                }, this)); 
            }, this));
        }, this));
    },
    _isImportant(workspaceUserEntityId) {
      return $.inArray(workspaceUserEntityId, this._importantRequests) >= 0;
    },
    _isUnimportant(workspaceUserEntityId) {
      return $.inArray(workspaceUserEntityId, this._unimportantRequests) >= 0;
    },
    _resetImportance: function(card) {
      var workspaceUserEntityId = $(card).attr('data-workspace-user-entity-id');
      if ($.inArray(workspaceUserEntityId, this._importantRequests) >= 0) {
        this._importantRequests.splice(this._importantRequests.indexOf(workspaceUserEntityId), 1);
        mApi().user.property.create({key: 'important-evaluation-requests', value: this._importantRequests.join(',')});
      }
      if ($.inArray(workspaceUserEntityId, this._unimportantRequests) >= 0) {
        this._unimportantRequests.splice(this._unimportantRequests.indexOf(workspaceUserEntityId), 1);
        mApi().user.property.create({key: 'unimportant-evaluation-requests', value: this._unimportantRequests.join(',')});
      }
    },
    _changeRequestImportance: function(card, important) {
      var saveImportant = false;
      var saveUnimportant = false;
      var workspaceUserEntityId = $(card).attr('data-workspace-user-entity-id');
      if (important) {
        if ($.inArray(workspaceUserEntityId, this._unimportantRequests) >= 0) { // unimportant > important
          saveImportant = true;
          saveUnimportant = true;
          $(card).find('.evaluation-important-button').addClass('active');
          $(card).find('.evaluation-unimportant-button').removeClass('active');
          this._unimportantRequests.splice(this._unimportantRequests.indexOf(workspaceUserEntityId), 1);
          this._importantRequests.push(workspaceUserEntityId);
        }
        else if ($.inArray(workspaceUserEntityId, this._importantRequests) >= 0) { // important > none
          saveImportant = true;
          $(card).find('.evaluation-important-button').removeClass('active');
          this._importantRequests.splice(this._importantRequests.indexOf(workspaceUserEntityId), 1);
        }
        else { // none > important
          saveImportant = true;
          $(card).find('.evaluation-important-button').addClass('active');
          this._importantRequests.push(workspaceUserEntityId);
        }
      }
      else {
        if ($.inArray(workspaceUserEntityId, this._unimportantRequests) >= 0) { // unimportant > none
          saveUnimportant = true;
          $(card).find('.evaluation-unimportant-button').removeClass('active');
          this._unimportantRequests.splice(this._unimportantRequests.indexOf(workspaceUserEntityId), 1);
        }
        else if ($.inArray(workspaceUserEntityId, this._importantRequests) >= 0) { // important > unimportant
          saveImportant = true;
          saveUnimportant = true;
          $(card).find('.evaluation-important-button').removeClass('active');
          $(card).find('.evaluation-unimportant-button').addClass('active');
          this._importantRequests.splice(this._importantRequests.indexOf(workspaceUserEntityId), 1);
          this._unimportantRequests.push(workspaceUserEntityId);
        }
        else { // none > unimportant
          saveUnimportant = true;
          $(card).find('.evaluation-unimportant-button').addClass('active');
          this._unimportantRequests.push(workspaceUserEntityId);
        }
      }
      if (saveImportant) {
        mApi().user.property.create({key: 'important-evaluation-requests', value: this._importantRequests.join(',')});
      }
      if (saveUnimportant) {
        mApi().user.property.create({key: 'unimportant-evaluation-requests', value: this._unimportantRequests.join(',')});
      }
      $('.eval-sorting.selected').click();
    },
    compareCardImportance: function(card1, card2) {
      return this._compareImportance($(card1).attr('data-workspace-user-entity-id'), $(card2).attr('data-workspace-user-entity-id'));
    },
    _compareImportance: function(workspaceUserEntityId1, workspaceUserEntityId2) {
      var result = 0;
      var c1priority = $.inArray(workspaceUserEntityId1, this._importantRequests) >= 0;
      var c2priority = $.inArray(workspaceUserEntityId2, this._importantRequests) >= 0;
      if (c1priority != c2priority) {
        result = c1priority ? -1 : 1;
      }
      else {
        c1priority = $.inArray(workspaceUserEntityId1, this._unimportantRequests) >= 0;
        c2priority = $.inArray(workspaceUserEntityId2, this._unimportantRequests) >= 0;
        if (c1priority != c2priority) {
          result = c1priority ? 1 : -1;
        }
      }
      return result;
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
    },
    _onDiscardCard: function(event, data) {
      var workspaceEntityId = $('#workspaceEntityId').val()||undefined;
      var workspaceUserEntityId = data.workspaceUserEntityId;
      var card = $('.evaluation-card[data-workspace-user-entity-id="' + workspaceUserEntityId + '"]');
      this._resetImportance(card);
      $(card).remove();
      if (!$('.evaluation-card').length && workspaceEntityId === undefined) {
        this._showNoCardsMessage();
      }
    },
    _onCardStateChange: function(event, data) {
      if (data.evaluated) {
        $(data.card).attr('data-evaluated', true);
        $(data.card).removeClass('evaluation-requested');
        if (data.passing) {
          $(data.card).removeClass('evaluated-incomplete').addClass('evaluated-passed');
        }
        else {
          $(data.card).removeClass('evaluated-passed').addClass('evaluated-incomplete');
        }
        $(data.card).find('.enrollment-row').removeClass('highlight');
        $(data.card).find('.request-row').removeClass('highlight');
        var evaluationRow = $(data.card).find('.evaluation-row');
        $(evaluationRow).addClass('highlight');
        $(evaluationRow).find('.evaluation-card-data-text').text(formatDate(data.evaluationDate));
        this._resetImportance(data.card);
      }
      else {
        $(data.card).removeClass('evaluated-passed evaluation-incomplete');
        $(data.card).find('.evaluation-row .evaluation-card-data-text').text('-');
        $(data.card).removeAttr('data-evaluated');
        if ($(data.card).attr('data-assessment-request-date')) {
          $(data.card).find('.request-row').addClass('highlight');
          $(data.card).addClass('evaluation-requested');
        }
        else {
          $(data.card).find('.enrollment-row').addClass('highlight');
          $(data.card).removeClass('evaluation-requested');
        }
      }
    },
    _showNoCardsMessage: function() {
      $('.evaluation-cards-container').append($('<div>')
        .addClass('evaluation-well-done-container')
        .text(getLocaleText("plugin.evaluation.evaluationWellDone")));
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

  // Sort by assessment request date, ascending
  $('.icon-sort-amount-asc').on('click', function(event) {
    $('.eval-sorting').removeClass('selected');
    $(event.target).addClass('selected');
    var cards = $('.evaluation-card').sort(function (c1, c2) {
      var result = $(document).evaluationMainView('compareCardImportance', c1, c2);
      if (result == 0) {
        var a = Date.parse($(c1).attr('data-assessment-request-date'));
        var b = Date.parse($(c2).attr('data-assessment-request-date'));
        return isNaN(a) || isNaN(b) ? isNaN(a) ? isNaN(b) ? 0 : 1 : -1 : a < b ? -1 : a > b ? 1 : 0;
      }
      return result;
    });
    for (var i = 0; i < cards.length; i++) {
      $('.evaluation-cards-container').append(cards[i]);
    }
  });

  // Sort by assessment request date, descending
  $('.icon-sort-amount-desc').on('click', function (event) {
    $('.eval-sorting').removeClass('selected');
    $(event.target).addClass('selected');
    var cards = $('.evaluation-card').sort(function (c1, c2) {
      var result = $(document).evaluationMainView('compareCardImportance', c1, c2);
      if (result == 0) {
        var a = Date.parse($(c1).attr('data-assessment-request-date'));
        var b = Date.parse($(c2).attr('data-assessment-request-date'));
        return isNaN(a) || isNaN(b) ? isNaN(a) ? isNaN(b) ? 0 : 1 : -1 : a < b ? 1 : a > b ? -1 : 0;
      }
      return result;
    });
    for (var i = 0; i < cards.length; i++) {
      $('.evaluation-cards-container').append(cards[i]);
    }
  });

  // Sort by student name, ascending
  $('.icon-sort-alpha-asc').on('click', function (event) {
    $('.eval-sorting').removeClass('selected');
    $(event.target).addClass('selected');
    var cards = $('.evaluation-card').sort(function (c1, c2) {
      var result = $(document).evaluationMainView('compareCardImportance', c1, c2);
      if (result == 0) {
        var a = $(c1).find('.evaluation-card-student').text().toLowerCase();
        var b = $(c2).find('.evaluation-card-student').text().toLowerCase();
        return a.localeCompare(b);
      }
      return result;
    });
    for (var i = 0; i < cards.length; i++) {
      $('.evaluation-cards-container').append(cards[i]);
    }
  });

  // Sort by student name, descending
  $('.icon-sort-alpha-desc').on('click', function (event) {
    $('.eval-sorting').removeClass('selected');
    $(event.target).addClass('selected');
    var cards = $('.evaluation-card').sort(function (c1, c2) {
      var result = $(document).evaluationMainView('compareCardImportance', c1, c2);
      if (result == 0) {
        var a = $(c1).find('.evaluation-card-student').text().toLowerCase();
        var b = $(c2).find('.evaluation-card-student').text().toLowerCase();
        return b.localeCompare(a);
      }
      return result;
    });
    for (var i = 0; i < cards.length; i++) {
      $('.evaluation-cards-container').append(cards[i]);
    }
  });
  
  // Sort by workspace name (student name as secondary), ascending
  $('.icon-sort-workspace-alpha-asc').on('click', function (event) {
    $('.eval-sorting').removeClass('selected');
    $(event.target).addClass('selected');
    var cards = $('.evaluation-card').sort(function (c1, c2) {
      var result = $(document).evaluationMainView('compareCardImportance', c1, c2);
      if (result == 0) {
        var a = $(c1).find('.workspace-name').text().toLowerCase();
        var b = $(c2).find('.workspace-name').text().toLowerCase();
        if (a == b) {
          a = $(c1).find('.evaluation-card-student').text().toLowerCase();
          b = $(c2).find('.evaluation-card-student').text().toLowerCase();
        }
        return a.localeCompare(b);
      }
      return result;
    });
    for (var i = 0; i < cards.length; i++) {
      $('.evaluation-cards-container').append(cards[i]);
    }
});

  // Sort by workspace name (student name as secondary), descending
  $('.icon-sort-workspace-alpha-desc').on('click', function (event) {
    $('.eval-sorting').removeClass('selected');
    $(event.target).addClass('selected');
    var cards = $('.evaluation-card').sort(function (c1, c2) {
      var result = $(document).evaluationMainView('compareCardImportance', c1, c2);
      if (result == 0) {
        var a = $(c1).find('.workspace-name').text().toLowerCase();
        var b = $(c2).find('.workspace-name').text().toLowerCase();
        if (a == b) {
          a = $(c1).find('.evaluation-card-student').text().toLowerCase();
          b = $(c2).find('.evaluation-card-student').text().toLowerCase();
        }
        return b.localeCompare(a);
      }
      return result;
    });
    for (var i = 0; i < cards.length; i++) {
      $('.evaluation-cards-container').append(cards[i]);
    }
  });

  $('.eval-home').on('click', function (event) {
    location.href = location.href.split("?")[0];
  });
  
}).call(this);
