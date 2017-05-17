(function() {

  $.widget("custom.records", {
    options: {
      studentIdentifier: null
    },

    _create : function() {
      this._categoryId = null;
      this._grades = $.parseJSON(this.element.attr('data-grades'));
      $('.mf-button-container').on('change', '.tr-category-dropdown', $.proxy(this._onCategoryChange, this));
      this.element.on('click', '.tr-task-evaluated', $.proxy(this._onEvaluationClick, this));
      this.element.on('click', '.tr-item-workspace-assessment:not(.open)', $.proxy(this._onWorkspaceAssessmentItemClick, this));
      this.element.on('click', '.tr-view-toolbar .icon-goback', $.proxy(this._goBackRecords, this));
      this._loadCategory();
    },

    category: function (categoryId) {
      this._categoryId = categoryId;
      this._loadCategory(categoryId);
    },
    _goBackRecords : function () {
      this._loadCategory('records');
    },
    _onCategoryChange: function (event, data) {
      this.category(data.value);
    },

    _loadCategory: function (categoryId) {
      var selectedCategory = categoryId == null ? $('.tr-category-dropdown li:first-child').attr('data-value') : categoryId;
      switch (selectedCategory) {
        case  'forms' :
          this._loadForms();
          break;
        case  'records' :
          this._loadRecords();
          break;
        case  'vops' :
          this._loadVops();
          break;
        case 'hops-form':
          this._loadHopsForm();
          break;
        default :
          alert('Unknown category');
      }
    },

    _loadForms : function () {
      this.element.addClass('loading');
      this._clear();
      var err = err;


      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.records.errormessage.noworkspaces', err));
      } else {
        renderDustTemplate('/records/records_forms.dust', {}, $.proxy(function(text) {
          this.element.append(text);
          this.element.removeClass('loading');
        }, this));
      }
    },

    _loadHopsForm : function () {
      this.element.addClass('loading');
      this._clear();
      mApi().records.hops.read().callback((function(err, data){
        if (err){
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.records.errormessage.noworkspaces', err));
          return;
        }

        renderDustTemplate('/records/records_hops_form.dust', data, (function(text) {
          this.element.append(text);
          this.element.removeClass('loading');
          this.element.find('form').submit(this._submitHops.bind(this));
        }).bind(this));
      }).bind(this));
    },

    _submitHops : function (e) {
      e.preventDefault();
      var updateData = {};
      this.element.find("[name]").each(function(index, element){
        var $element = $(element);
        if ($element.attr("type") === "checkbox"){
          updateData[$element.attr("name")] = $element.is(":checked");
          return;
        } else if ($element.attr("type") === "radio" && !$element.is(":checked")){
          return;
        }
        updateData[$element.attr("name")] = $element.val();
      });
      mApi().records.hops.update(updateData).callback((function(err,data){
        if (err){
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.records.updateSuccess'));
        }

      }).bind(this));
      return false;
    },

    _loadVops : function () {



      this.element.addClass('loading');
      this._clear();

      mApi().records.vops
      .read(MUIKKU_LOGGED_USER)
      .on('$', $.proxy(function (vops, callback) {
         var maxitems = 15;
         var titleItems = [];

         for (var i = 0; i < maxitems; i++) {
           titleItems.push(i+1);
         }

         vops.coursetitlenos = titleItems;
        callback();
      }, this)).callback($.proxy(function (err, result) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.records.errormessage.noworkspaces', err));
        } else {
          renderDustTemplate('/records/records_vops.dust', result, $.proxy(function(text) {
            this.element.append(text);
            this.element.removeClass('loading');

            $('.tr-vops-legend-content').click( function() {
              var state = $('.tr-vops-legend-content').hasClass('open') ? 'open' : 'closed';
              if(state == 'open'){
                $(this).removeClass('open');
                $(this).addClass('closed');
              } else {
                $(this).removeClass('closed');
                $(this).addClass('open');
              }

            });
          }, this));
        }
      }, this));
    },

    _loadRecords : function () {
      this.element.addClass('loading');
      this._clear();

      mApi().user.students
        .read({userEntityId: this.options.userEntityId, includeInactiveStudents: true, includeHidden: true })
        .on('$', $.proxy(function (student, callback) {
          // var curriculumIdentifier = student.curriculumIdentifier ?
          // student.curriculumIdentifier : undefined;

          async.parallel([this._createStudentWorkspacesLoad(student.id), this._createStudentTransferCreditsLoad(student.id), this._createCurriculumsLoad()], $.proxy(function (err, results) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              var DEFAULT_CURRICULUM = "default";
              var studentCurriculumIdentifier = student.curriculumIdentifier ? student.curriculumIdentifier : undefined;
              var studentWorkspaces = results[0];
              var studentTransferCredits = results[1];
              var curriculums = results[2].slice() || [];
              curriculums.push({identifier: "default", name: undefined});

              if (studentWorkspaces) {
                studentWorkspaces = studentWorkspaces.reduce(function(workspacesByCurriculum, workspace) {
                  var curriculum = undefined;

                  // If student doesn't have curriculum set, all credits are
                  // valid so they go to default curriculum
                  if (!studentCurriculumIdentifier)
                    curriculum = DEFAULT_CURRICULUM;
                  else if (workspace.curriculumIdentifiers && (workspace.curriculumIdentifiers.length > 0)) {
                    // Student has curriculum, credit has curriculum(s)

                    for (var currInd = 0, currLen = workspace.curriculumIdentifiers.length; currInd < currLen; currInd++) {
                      var workspaceCurriculum = workspace.curriculumIdentifiers[currInd];
                      workspacesByCurriculum[workspaceCurriculum] = workspacesByCurriculum[workspaceCurriculum] || [];
                      workspacesByCurriculum[workspaceCurriculum].push(workspace);
                    }
                  } else
                    // Student has curriculum but credit doesn't so add the
                    // credit to current curriculum
                    curriculum = studentCurriculumIdentifier;

                  if (curriculum) {
                    workspacesByCurriculum[curriculum] = workspacesByCurriculum[curriculum] || [];
                    workspacesByCurriculum[curriculum].push(workspace);
                  }
                  return workspacesByCurriculum;
                }, {});
              }

              if (studentTransferCredits) {
                studentTransferCredits = studentTransferCredits.reduce(function(transferCreditsByCurriculum, transferCredit) {
                  var curriculum;

                  // If student doesn't have curriculum set, all transfercredits
                  // are valid so they go to default curriculum
                  if (!studentCurriculumIdentifier)
                    curriculum = DEFAULT_CURRICULUM;
                  else if (transferCredit.curriculumIdentifier)
                    // Student has curriculum, transfercredit has curriculum
                    curriculum = transferCredit.curriculumIdentifier;
                  else
                    // Student has curriculum but transfercredit doesn't so add
                    // the transfercredit to current curriculum
                    curriculum = studentCurriculumIdentifier;

                  transferCreditsByCurriculum[curriculum] = transferCreditsByCurriculum[curriculum] || [];
                  transferCreditsByCurriculum[curriculum].push(transferCredit);
                  return transferCreditsByCurriculum;
                }, {});
              }

              var studentCurriculums = [];
              $.each(curriculums, function(index, curriculum) {
                var workspaces = studentWorkspaces ? studentWorkspaces[curriculum.identifier] : undefined;
                var transferCredits = studentTransferCredits ? studentTransferCredits[curriculum.identifier] : undefined;

                if (workspaces || transferCredits) {
                  studentCurriculums.push({
                    curriculumId: curriculum.identifier,
                    curriculumName: curriculum.name,
                    workspaces: workspaces,
                    transferCredits: transferCredits
                  });
                }
              });

              // Sort curriculums so that the current curriculum is on top
              studentCurriculums.sort($.proxy(function (curriculum1, curriculum2) {
                return curriculum1.curriculumId == studentCurriculumIdentifier ? -1 : curriculum2.curriculumId == studentCurriculumIdentifier ? 1 : 0;
              }, this));

              student.curriculums = studentCurriculums;
              callback();
            }
          }, this));
        }, this))
        .callback($.proxy(function (err, result) {
          result.sort($.proxy(function (student1, student2) {
            return student1.id == this.options.studentIdentifier ? -1 : student2.id == this.options.studentIdentifier ? 1 : 0;
          }, this));

          var files = $.parseJSON($('[data-files]').attr('data-files'));



          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.records.errormessage.noworkspaces', err));
          } else {
            renderDustTemplate('/records/records_studyprogrammes.dust', { students: result, files: files }, $.proxy(function(text) {

              this.element.append(text);
              this.element.removeClass('loading');
            }, this));
          }
        }, this));
    },


    _createStudentWorkspacesLoad: function (studentIdentifier) {
      return $.proxy(function (callback) {
        this._loadStudentWorkspaces(studentIdentifier, $.proxy(function (err, workspaces) {
          callback(err, workspaces);
        }, this));
      }, this);
    },

    _createStudentTransferCreditsLoad: function (studentIdentifier) {
      return $.proxy(function (callback) {
        this._loadStudentTransferCredits(studentIdentifier, $.proxy(function (err, transferCredits) {
          callback(err, transferCredits);
        }, this));
      }, this);
    },

    _createCurriculumsLoad: function () {
      return $.proxy(function (callback) {
        mApi().coursepicker.curriculums
          .read()
          .callback(callback);
      }, this);
    },

    _loadStudentWorkspaces: function (studentIdentifier, callback) {
      mApi().workspace.workspaces
        .read({ includeArchivedWorkspaceUsers: true, userIdentifier: studentIdentifier, includeUnpublished: true, orderBy: ['alphabet'], maxResults: 500 })
        .on('$', $.proxy(function (workspaceEntity, callback) {
          mApi().workspace.workspaces.students.assessments
            .read(workspaceEntity.id, studentIdentifier)
            .callback($.proxy(function (assessmentsErr, assessments) {
              if( assessmentsErr ){
                $('.notification-queue').notificationQueue('notification', 'error', assessmentsErr );
              } else {
                var assessment = assessments && assessments.length == 1 ? assessments[0] : null;
                if (assessment) {
                  var grade = this._getGrade(assessment.gradingScaleSchoolDataSource, assessment.gradingScaleIdentifier, assessment.gradeSchoolDataSource, assessment.gradeIdentifier);
                  workspaceEntity.evaluated = formatDate(moment(assessment.evaluated).toDate());
                  workspaceEntity.verbalAssessment = assessment.verbalAssessment;
                  workspaceEntity.grade = grade.grade;
                  workspaceEntity.gradingScale = grade.scale;
                  workspaceEntity.passed = assessment.passed;
                }
              }
              callback();
            }, this));
          }, this))
          .callback($.proxy(function (err, workspaces) {
            callback(err, workspaces);
          }, this));
    },

    _loadStudentTransferCredits: function (studentIdentifier, callback) {
      mApi().user.students.transferCredits
        .read(studentIdentifier, {})
        .callback($.proxy(function (err, transferCredits) {
          var data = $.map(transferCredits, $.proxy(function (transferCredit) {
            var scaleSchoolDataSource;
            var scaleIdentifier;
            var gradeSchoolDataSource;
            var gradeIdentifier;

            if (transferCredit.gradeIdentifier && transferCredit.gradingScaleIdentifier) {
              var gradeSplit = transferCredit.gradeIdentifier.split('-');
              var scaleSplit = transferCredit.gradingScaleIdentifier.split('-');

              if (gradeSplit.length == 2) {
                gradeSchoolDataSource = gradeSplit[0];
                gradeIdentifier = gradeSplit[1];
              }

              if (scaleSplit.length == 2) {
                scaleSchoolDataSource = scaleSplit[0];
                scaleIdentifier = scaleSplit[1];
              }
            }

            if (scaleSchoolDataSource && scaleIdentifier && gradeSchoolDataSource && gradeIdentifier) {
              var grade = this._getGrade(scaleSchoolDataSource, scaleIdentifier, gradeSchoolDataSource, gradeIdentifier);
              return $.extend(transferCredit, {
                evaluated: formatDate(moment(transferCredit.date).toDate()),
                grade: grade.grade,
                gradingScale: grade.scale
              });
            }
          }, this));

          callback(err, data);
        }, this));
    },

    _getGrade: function (gradingScaleSchoolDataSource, gradingScaleIdentifier, gradeSchoolDataSource, gradeIdentifier) {
      if (gradingScaleSchoolDataSource && gradingScaleIdentifier && gradeSchoolDataSource && gradeIdentifier) {
        var gradeId = [gradingScaleSchoolDataSource, gradingScaleIdentifier, gradeSchoolDataSource, gradeIdentifier].join('-');
        return this._grades[gradeId];
      }

      return null;
    },

    _loadWorkspace: function (workspaceEntityId, workspaceEntityName, workspaceEntityDescription, grade, gradingScale, passed, evaluated, verbalAssessment) {
      this._clear();
      this.element.addClass('loading');
      mApi().workspace.workspaces.materials.read(workspaceEntityId, { assignmentType: 'EVALUATED' })
        .on('$', $.proxy(function (workspaceMaterial, callback) {
          if (workspaceMaterial) {
            mApi().materials.html.read(workspaceMaterial.materialId).callback($.proxy(function (htmlErr, htmlMaterial) {
              if (htmlErr) {
                $('.notification-queue').notificationQueue('notification', 'error', htmlErr);
              } else {
                htmlMaterial.title = workspaceMaterial.title;
                mApi().workspace.workspaces.materials.evaluations.read(workspaceEntityId, workspaceMaterial.id, {
                  userEntityId: this.options.userEntityId
                })
                .callback($.proxy(function (evaluationsErr, evaluations) {
                  if (evaluationsErr) {
                    $('.notification-queue').notificationQueue('notification', 'error', evaluationsErr);
                  } else {
                    var evaluation = evaluations && evaluations.length == 1 ? evaluations[0] : null;
                    workspaceMaterial.material = htmlMaterial;
                    if (evaluation) {
                      var grade = this._grades[[evaluation.gradingScaleSchoolDataSource, evaluation.gradingScaleIdentifier, evaluation.gradeSchoolDataSource, evaluation.gradeIdentifier].join('-')];
                      workspaceMaterial.verbalAssessment = evaluation.verbalAssessment;
                      workspaceMaterial.grade = grade.grade;
                      workspaceMaterial.gradingScale = grade.scale;
                      workspaceMaterial.passing = grade.passing;
                    }
                    callback();
                  }
                }, this));
              }
            }, this));
          }
        }, this))
        .callback($.proxy(function (err, assignments) {
          this.element.removeClass('loading');
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.records.errormessage.noworkspaces', err));
          }
          else {
            mApi().workspace.workspaces.journal.read(workspaceEntityId, {
              userEntityId: this.options.userEntityId,
              firstResult: 0,
              maxResults: 512
            }).callback($.proxy(function (err, journalEntries) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                }
                else {
                  renderDustTemplate('/records/records_item_open.dust', {
                    assignments: assignments,
                    workspaceEntityId : workspaceEntityId,
                    workspaceName : workspaceEntityName,
                    workspaceDescription : workspaceEntityDescription,
                    workspaceGrade: grade,
                    workspaceGradingScale: gradingScale,
                    passed: passed,
                    workspaceEvaluated: evaluated,
                    workspaceVerbalAssessment: verbalAssessment,
                    workspaceJournalEntries: journalEntries
                  }, $.proxy(function(text) {
                    this._clear();
                    this.element.append(text);
                  }, this));
                }
              }, this));
          }
        }, this));
    },
    _onWorkspaceAssessmentItemClick: function (event) {

      var item = $(event.target).hasClass('tr-item') ? $(event.target) : $(event.target).closest('.tr-item');
      var workspaceEntityId = $(item).attr('data-workspace-entity-id');
      var workspaceEntityName =  $(item).attr('data-workspace-entity-name');
      var workspaceEntityDescription = $(item).find('#description').html();
      var workspaceEntityGrade =  $(item).attr('data-workspace-entity-grade');
      var verbalAssessment = $(item).attr('data-workspace-verbal-assessment');
      var grade = $(item).attr('data-workspace-grade');
      var gradingScale = $(item).attr('data-workspace-grading-scale');
      var passed = $(item).attr('data-workspace-grade-passed') == 'true';
      var evaluated = $(item).attr('data-workspace-evaluated');

      if (workspaceEntityId) {
        this._loadWorkspace(workspaceEntityId, workspaceEntityName, workspaceEntityDescription, grade, gradingScale, passed, evaluated, verbalAssessment);
      }
    },
    _onEvaluationClick: function(event){
      var container = $(event.target).parents('.tr-task-evaluated').find('.content-container');
      var materialContainer = $(container).find('.material');
      if ($(materialContainer).attr('data-material-content')) {
        var workspaceEntityId = $(materialContainer).attr('data-workspace-entity-id');
        var workspaceMaterialId = $(materialContainer).attr('data-workspace-material-id');
        mApi().workspace.workspaces.materials.compositeMaterialReplies
          .read(workspaceEntityId, workspaceMaterialId, {userEntityId: this.options.userEntityId})
          .callback($.proxy(function (err, replies) {
            var fieldAnswers = {};
            for (var i = 0, l = replies.answers.length; i < l; i++) {
              var answer = replies.answers[i];
              var answerKey = [answer.materialId, answer.embedId, answer.fieldName].join('.');
              fieldAnswers[answerKey] = answer.value;
            }
            $('[data-grades]').muikkuMaterialLoader('loadMaterial', $(materialContainer)[0], fieldAnswers);
            container.toggle();
          }, this));
      }
      else {
        container.toggle();
      }
    },
    _load: function(){
      this.element.empty();
      $(this.element).append('<div class="mf-loading"><div class"circle1"></div><div class"circle2"></div><div class"circle3"></div></div>');
    },
    _clear: function(){
      this.element.empty();
    },
    _destroy: function () {
      this.element.off('click', '.tr-item');
      this.element.off('click', '.tr-view-tool');
      this.element.off('click', '.tr-task-evaluated');
    }
  });

  $(document).ready(function(){
    $('[data-grades]').records({
      'userEntityId': MUIKKU_LOGGED_USER_ID,
      'studentIdentifier': MUIKKU_LOGGED_USER
    }).muikkuMaterialLoader({
      prependTitle: false,
      readOnlyFields: true,
      fieldlessMode: true
    });
  });

  $(document).on('afterHtmlMaterialRender', function (event, data) {
    var replyState = $(data.pageElement).attr('data-reply-state');
    if (replyState != '') {
      $(data.pageElement).muikkuMaterialPage('checkExercises', true);
    }
  });

}).call(this);

