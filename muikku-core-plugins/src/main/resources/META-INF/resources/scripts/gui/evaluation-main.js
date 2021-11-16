(function() {
  'use strict';
  
  // Evaluation main view widget

  $.widget("custom.evaluationMainView", {
    _create : function() {
      this._loadOperations = 0;
      this._importantRequests = [];
      this._unimportantRequests = [];
      this._sortFunctions = [];
      this._sortProperty = '';
      this._currentSort = '';
      this._cardsLoaded = 0;
      this._cardsTotal = 0;
      this._filterFunctions = [];
      this._activeFilters = [];
      this.element.on("loadStart", $.proxy(this._onLoadStart, this));
      this.element.on("loadEnd", $.proxy(this._onLoadEnd, this));
      this.element.on("cardLoaded", $.proxy(this._onCardLoaded, this));
      this.element.on("discardCard", $.proxy(this._onDiscardCard, this));
      this.element.on("cardStateChange", $.proxy(this._onCardStateChange, this));
      this._setupSorters();
      this._setupFilters();
      this._initializeView();
    },
    _initializeView: function() {
      this.element.trigger("loadStart", $('.evaluation-cards-container'));
      var workspaceEntityId = $('#workspaceEntityId').val()||undefined;
      
      if (workspaceEntityId) {
        this._sortProperty = 'evaluation-workspace-sort';
        $('.evaluation-cards-title h3').text($('#workspaceName').val());
        $('.eval-filters').show();
        $('.icon-sort-workspace-alpha-asc').hide();
        $('.icon-sort-workspace-alpha-desc').hide();
      }
      else {
        $('.eval-filters').hide();
        this._sortProperty = 'evaluation-default-sort';
        $('.evaluation-cards-title h3').text(getLocaleText("plugin.evaluation.evaluationRequestsTitle"));
      }
      
      $('#testipostailua').on('click', function() {
        
//        mApi().ceepos.user.orders.read('PYRAMUS-STUDENT-123');

        mApi().ceepos.pay.create({
          'id': '2'
        }).callback(function(err, data) {
          console.log(err + ' ja ' + JSON.stringify(data));
        });

//        mApi().ceepos.order.create({
//          'studentIdentifier': 'PYRAMUS-STUDENT-124',
//          'product': {
//            'Code': 'demo_004'
//           }}).callback(function(err, data) {
//          console.log('no se on ' + err + ' ja ' + data);
//        });
        
//        var object = {
//          'Id': '123',
//          'Status': 2,
//          'Reference': '10000578239',
//          'Hash': 'cf4868d68e5e9ef1b00d7c18e65819027189d1b611a3f7bae90fe5036a195517'
//        };
//        var jsonData = JSON.stringify(object);
//        $.ajax({
//          url: "https://dev.muikkuverkko.fi/rest/ceepos/paymentConfirmationDebug",
//          type: "POST",
//          data: jsonData,
//          dataType: "json",
//          contentType: "application/json; charset=utf-8",
//          success: function(result) {
//            console.log(result);
//          }
//        });
        
        /*
        console.log('simple debug test');
        mApi().ceepos.paymentConfirmationDebug.create({
          'id': '123',
          'status': 2,
          'reference': '10000578239',
          'hash': 'cf4868d68e5e9ef1b00d7c18e65819027189d1b611a3f7bae90fe5036a195517'
        }).callback($.proxy(function (err, data) {
          console.log(err + ' and ' + JSON.stringify(data));
        }, this));
        */
        
        
      });

      /*
      mApi().user.defaultEmailAddress.read().callback(function(err, data) {
        console.log(err + ' and ' + data);
      });
      */
      
      /*
      mApi().ceepos.pay.create({
        'id': '2',
        'studentEmail': 'student@email.com'
      });
      */

      /*
      mApi().ceepos.order.create({
        'studentIdentifier': 'STUDENT-124',
        'product': {
          'code': 'demo_004'
         }}).callback(function(err, data) {
        console.log('no se on ' + err + ' ja ' + data);
      });
      */

      
      // Important requests
      mApi().user.property.read('important-evaluation-requests').callback($.proxy(function (err, property) {
        this._importantRequests = property.value ? property.value.split(',') : [];
        // Unimportant requests
        mApi().user.property.read('unimportant-evaluation-requests').callback($.proxy(function (err, property) {
          this._unimportantRequests = property.value ? property.value.split(',') : [];
          // Default sort
          mApi().user.property.read(this._sortProperty).callback($.proxy(function (err, property) {
            this._currentSort = property.value||'sort-amount-asc';
            // Assessment requests
            this._loadAssessmentRequests();
          }, this));
        }, this));
      }, this));
    },
    _loadAssessmentRequests: function () {
      var workspaceEntityId = $('#workspaceEntityId').val()||undefined;

      mApi().evaluation.compositeAssessmentRequests
        .read({workspaceEntityId: workspaceEntityId})
        .callback($.proxy(function (err, assessmentRequests) {
  
          // Requests
          
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          else {
            if (assessmentRequests.length > 0) {
              this._cardsTotal = assessmentRequests.length;
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
                  cardStateClass = assessmentRequests[i].graded ? assessmentRequests[i].passing ? 'evaluated-passed' : 'evaluated-failed' : 'evaluated-incomplete';
                  isEvaluated = true;
                }
                assessmentRequests[i] = $.extend({}, assessmentRequests[i], {
                  workspaceMode: workspaceEntityId,
                  cardStateClass: cardStateClass,
                  isRequest: isRequest,
                  isEvaluated: isEvaluated});
                
                renderDustTemplate("evaluation/evaluation-card.dust", assessmentRequests[i], $.proxy(function (html) {
                  var card = $(html).appendTo($('.evaluation-cards-container'));
                  $(card).find('.evaluate-button').on('click', function() {
                    var workspaceEntityId = $('#workspaceEntityId').val()||undefined;
                    $(document).evaluationModal('open', $(this).closest('.evaluation-card'), !workspaceEntityId);
                  });
                  $(card).find('.archive-button').on('click', function(event) {
                    var archiveCard = $(event.target).closest('.evaluation-card');
                    if(workspaceEntityId) {
                      $(document).evaluationModal('confirmStudentArchive', archiveCard, $.proxy(function(archived) {
                        if (archived) {
                          $(document).trigger("discardCard", {workspaceUserEntityId: $(archiveCard).attr('data-workspace-user-entity-id')});
                        }
                      }, this));
                    }
                    else {
                      $(document).evaluationModal('confirmRequestArchive', archiveCard, $.proxy(function(archived) {
                        if (archived) {
                          $(document).trigger("discardCard", {workspaceUserEntityId: $(archiveCard).attr('data-workspace-user-entity-id')});
                        }
                      }, this));
                    }
                  });
                  $(card).find('.evaluation-important-button').on('click', $.proxy(function() {
                    this._changeRequestImportance(card, true);
                  }, this));
                  $(card).find('.evaluation-unimportant-button').on('click', $.proxy(function() {
                    this._changeRequestImportance(card, false);
                  }, this));
                  var workspaceUserEntityId = $(card).attr('data-workspace-user-entity-id'); 
                  if (this._isImportant(workspaceUserEntityId)) {
                    $(card).find('.evaluation-important-button').addClass('active');
                  }
                  else if (this._isUnimportant(workspaceUserEntityId)) {
                    $(card).find('.evaluation-unimportant-button').addClass('active');
                  }
                  this.element.trigger("cardLoaded");
                }, this));
              }
            }
            else {
              this._showNoCardsMessage();
            }
            this.element.trigger("loadEnd", $('.evaluation-cards-container'));
          }
        }, this)); 
    },
    _isImportant: function(workspaceUserEntityId) {
      return $.inArray(workspaceUserEntityId, this._importantRequests) >= 0;
    },
    _isUnimportant: function(workspaceUserEntityId) {
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
    _onCardLoaded: function() {
      this._cardsLoaded++;
      if (this._cardsLoaded == this._cardsTotal) {
        if (this._sortFunctions[this._currentSort]) {
          this._sortFunctions[this._currentSort]();
        }
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
        $(data.card).attr('data-graded', data.graded);
        $(data.card).removeClass('evaluation-requested');
        if (data.graded) {
          if (data.passing) {
            $(data.card).removeClass('evaluated-failed evaluated-incomplete').addClass('evaluated-passed');
          }
          else {
            $(data.card).removeClass('evaluated-passed evaluated-incomplete').addClass('evaluated-failed');
          }
        }
        else {
          $(data.card).removeClass('evaluated-passed evaluated-failed').addClass('evaluated-incomplete');
        }
        $(data.card).find('.enrollment-row').removeClass('highlight');
        $(data.card).find('.request-row').removeClass('highlight');
        var evaluationRow = $(data.card).find('.evaluation-row');
        $(evaluationRow).addClass('highlight');
        $(evaluationRow).find('.evaluation-card-data-text').text(formatDate(data.evaluationDate));
        this._resetImportance(data.card);
      }
      else {
        $(data.card).removeClass('evaluated-passed evaluated-failed evaluated-incomplete');
        $(data.card).find('.evaluation-row .evaluation-card-data-text').text('-');
        $(data.card).removeAttr('data-evaluated');
        $(data.card).removeAttr('data-graded');
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
    },
    _setupSorters: function() {
      
      // Sort by assessment request date, ascending
      this._sortFunctions['sort-amount-asc'] = $.proxy(function() {
        $('.eval-sorting').removeClass('selected');
        $('.icon-sort-amount-asc').addClass('selected');
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
        if (this._currentSort != 'sort-amount-asc') {
          this._currentSort = 'sort-amount-asc';
          mApi().user.property.create({key: this._sortProperty, value: this._currentSort});
        }
      }, this);
      $('.icon-sort-amount-asc').on('click', $.proxy(function() {
        this._sortFunctions['sort-amount-asc']();
      }, this));
      
      // Sort by assessment request date, descending
      this._sortFunctions['sort-amount-desc'] = $.proxy(function() {
        $('.eval-sorting').removeClass('selected');
        $('.icon-sort-amount-desc').addClass('selected');
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
        if (this._currentSort != 'sort-amount-desc') {
          this._currentSort = 'sort-amount-desc';
          mApi().user.property.create({key: this._sortProperty, value: this._currentSort});
        }
      }, this);
      $('.icon-sort-amount-desc').on('click', $.proxy(function() {
        this._sortFunctions['sort-amount-desc']();
      }, this));

      // Sort by student name, ascending
      this._sortFunctions['sort-alpha-asc'] = $.proxy(function() {
        $('.eval-sorting').removeClass('selected');
        $('.icon-sort-alpha-asc').addClass('selected');
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
        if (this._currentSort != 'sort-alpha-asc') {
          this._currentSort = 'sort-alpha-asc';
          mApi().user.property.create({key: this._sortProperty, value: this._currentSort});
        }
      }, this);
      $('.icon-sort-alpha-asc').on('click', $.proxy(function() {
        this._sortFunctions['sort-alpha-asc']();
      }, this));

      // Sort by student name, descending
      this._sortFunctions['sort-alpha-desc'] = $.proxy(function() {
        $('.eval-sorting').removeClass('selected');
        $('.icon-sort-alpha-desc').addClass('selected');
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
        if (this._currentSort != 'sort-alpha-desc') {
          this._currentSort = 'sort-alpha-desc';
          mApi().user.property.create({key: this._sortProperty, value: this._currentSort});
        }
      }, this);
      $('.icon-sort-alpha-desc').on('click', $.proxy(function() {
        this._sortFunctions['sort-alpha-desc']();
      }, this));
  
      // Sort by workspace name (student name as secondary), ascending
      this._sortFunctions['sort-workspace-alpha-asc'] = $.proxy(function() {
        $('.eval-sorting').removeClass('selected');
        $('.icon-sort-workspace-alpha-asc').addClass('selected');
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
        if (this._currentSort != 'sort-workspace-alpha-asc') {
          this._currentSort = 'sort-workspace-alpha-asc';
          mApi().user.property.create({key: this._sortProperty, value: this._currentSort});
        }
      }, this);
      $('.icon-sort-workspace-alpha-asc').on('click', $.proxy(function() {
        this._sortFunctions['sort-workspace-alpha-asc']();
      }, this));

      // Sort by workspace name (student name as secondary), descending
      this._sortFunctions['sort-workspace-alpha-desc'] = $.proxy(function() {
        $('.eval-sorting').removeClass('selected');
        $('.icon-sort-workspace-alpha-desc').addClass('selected');
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
        if (this._currentSort != 'sort-workspace-alpha-desc') {
          this._currentSort = 'sort-workspace-alpha-desc';
          mApi().user.property.create({key: this._sortProperty, value: this._currentSort});
        }
      }, this);
      $('.icon-sort-workspace-alpha-desc').on('click', $.proxy(function() {
        this._sortFunctions['sort-workspace-alpha-desc']();
      }, this));

    },
    
    _setupFilters: function() {
      // Text filter
      this._filterFunctions['text'] = $.proxy(function(card) {
        var text = $('input.eval-searchfield').val();
        var cmp =  $(card).find('.evaluation-card-student').text() +
          $(card).find('.evaluation-card-study-programme').text() +
          $(card).find('.workspace-name').text();
        return cmp.toLowerCase().indexOf(text.toLowerCase()) >= 0;
      }, this);
      var textSearchFunction = $.proxy(function() {
        if ($('input.eval-searchfield').val()) {
          $('div.remove-search-results').show();
          this._activeFilters.push('text');
        }
        else {
          $('div.remove-search-results').hide();
          this._activeFilters.splice($.inArray('text', this._activeFilters), 1);
        }
        this._filter();
      }, this);
      $('input.eval-searchfield').on('keypress', $.proxy(function(e) {
        if (e.which === 13) {
          textSearchFunction();
        }
      }, this));
      $('button.eval-searchbutton').click($.proxy(function() {
        textSearchFunction();
      }, this));
      $('div.remove-search-results').click($.proxy(function() {
        $('input.eval-searchfield').val('');
        textSearchFunction();
      }, this));
      // Evaluated filter
      this._filterFunctions['evaluated'] = $.proxy(function(card) {
        return $(card).attr('data-evaluated') == 'true';
      }, this);
      $('input.filter-evaluated').click($.proxy(function() {
        if ($('input.filter-evaluated').is(':checked')) {
          this._activeFilters.push('evaluated');
        }
        else {
          this._activeFilters.splice($.inArray('evaluated', this._activeFilters), 1);
        }
        this._filter();
      }, this));
      // Evaluation request filter
      this._filterFunctions['evaluation-request'] = $.proxy(function(card) {
        return $(card).attr('data-assessment-request-date') != '';
      }, this);
      $('input.filter-evaluation-request').click($.proxy(function() {
        if ($('input.filter-evaluation-request').is(':checked')) {
          this._activeFilters.push('evaluation-request');
        }
        else {
          this._activeFilters.splice($.inArray('evaluation-request', this._activeFilters), 1);
        }
        this._filter();
      }, this));
      // Supplementation request filter
      this._filterFunctions['supplementation-request'] = $.proxy(function(card) {
        return $(card).attr('data-evaluated') == 'true' && $(card).attr('data-graded') == '';
      }, this);
      $('input.filter-supplementation-request').click($.proxy(function() {
        if ($('input.filter-supplementation-request').is(':checked')) {
          this._activeFilters.push('supplementation-request');
        }
        else {
          this._activeFilters.splice($.inArray('supplementation-request', this._activeFilters), 1);
        }
        this._filter();
      }, this));
      // Not evaluated filter
      this._filterFunctions['no-evaluation'] = $.proxy(function(card) {
        return $(card).attr('data-evaluated') != 'true';
      }, this);
      $('input.filter-no-evaluation').click($.proxy(function() {
        if ($('input.filter-no-evaluation').is(':checked')) {
          this._activeFilters.push('no-evaluation');
        }
        else {
          this._activeFilters.splice($.inArray('no-evaluation', this._activeFilters), 1);
        }
        this._filter();
      }, this));
    },
    
    _filter: function() {
      $('.evaluation-card').each($.proxy(function(index, card) {
        var match = true;
        for (var i = 0; i < this._activeFilters.length; i++) {
          match = this._filterFunctions[this._activeFilters[i]](card);
          if (!match) {
            break;
          }
        }
        if (match) {
          $(card).show();
        }
        else {
          $(card).hide();
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

    // My workspaces

    mApi().workspace.workspaces
      .read({userId: MUIKKU_LOGGED_USER_ID})
      .callback($.proxy(function (err, workspaces) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else if (workspaces) {
          var workspaceContainer = $('ul.evaluation-my-workspaces');
          workspaces.sort(function(a, b) {
            return a.name.localeCompare(b.name);
          });
          for (var i = 0; i < workspaces.length; i++) {
            var workspaceName = workspaces[i].name;
            if (workspaces[i].nameExtension) {
              workspaceName += ' (' + workspaces[i].nameExtension + ')';
            }
            var workspaceItem = $('<li>')
              .append($('<a>')
                .attr('href', '/evaluation2?workspaceEntityId=' + workspaces[i].id)
                .text(workspaceName)
              );
            workspaceContainer.append(workspaceItem);
          }
        }
      }, this));

    $('.eval-home').on('click', function() {
      location.href = location.href.split("?")[0];
    });

    $('.eval-workspaces').on('click', function() {
      var evalWorkspacesVisibility = $('.evaluation-workspaces-wrapper').attr('data-visibility');
      
      if (evalWorkspacesVisibility == 'hidden') {
        $('.evaluation-workspaces-wrapper')
          .show()
          .animate({
            left: 0 + "px"
        }, 200, "swing", function() {
          $('.evaluation-workspaces-wrapper').attr('data-visibility', 'visible');
        });
      }
      else {
        $('.evaluation-workspaces-wrapper')
          .animate({
            left: 0 - $('.evaluation-workspaces-wrapper').width() + "px"
        }, 200, "swing", function() {
          $('.evaluation-workspaces-wrapper').hide();
          $('.evaluation-workspaces-wrapper').attr('data-visibility', 'hidden');
        });
      }
    });
    
    $('.eval-filters').on('click', function() {
      var evalFiltersVisibility = $('.evaluation-filters-wrapper').attr('data-visibility');
      
      if (evalFiltersVisibility == 'hidden') {
        $('.evaluation-filters-wrapper')
          .show()
          .animate({
            right: 0 + "px"
        }, 200, "swing", function() {
          $('.evaluation-filters-wrapper').attr('data-visibility', 'visible');
        });
      }
      else {
        $('.evaluation-filters-wrapper')
          .animate({
            right: 0 - $('.evaluation-filters-wrapper').width() + "px"
        }, 200, "swing", function() {
          $('.evaluation-filters-wrapper').hide();
          $('.evaluation-filters-wrapper').attr('data-visibility', 'hidden');
        });
      }
    });
    
    
  });
  
  
}).call(this);
