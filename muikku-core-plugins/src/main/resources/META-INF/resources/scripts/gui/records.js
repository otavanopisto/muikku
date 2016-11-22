(function() {
  
  $.widget("custom.recordFiles", {
    _create : function() {
      var files = $.parseJSON(this.element.attr('data-files'));

      renderDustTemplate('/records/records_files.dust', { files: files }, $.proxy(function(text) {
        this.element.append(text);
      }, this));
    }
  });
  
  $.widget("custom.records", {
    options: {
      studentIdentifier: null
    },
    
    _create : function() {
      this._grades = $.parseJSON(this.element.attr('data-grades'));
      this.element.on('click', '.tr-task-evaluated', $.proxy(this._onEvaluationClick, this));
      this.element.on('click', '.tr-item-workspace-assessment:not(.open)', $.proxy(this._onWorkspaceAssessmentItemClick, this));
      this.element.on('click', '.tr-view-toolbar .icon-goback', $.proxy(this._loadWorkspaces, this));      
      this._loadWorkspaces();
    },
    
    _loadWorkspaces: function () {
      this.element.addClass('loading');
      this._clear();
      
      mApi().user.students
        .read({userEntityId: this.options.userEntityId, includeInactiveStudents: true, includeHidden: true })
        .on('$', $.proxy(function (student, callback) {
          var curriculumIdentifier = student.curriculumIdentifier ? student.curriculumIdentifier : undefined;
          
          async.parallel([this._createStudentWorkspacesLoad(student.id, curriculumIdentifier), this._createStudentTransferCreditsLoad(student.id, curriculumIdentifier)], $.proxy(function (err, results) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              student.workspaces = results[0];
              student.transferCredits = results[1];
              callback();
            }
          }, this));
        }, this))
        .callback($.proxy(function (err, result) {
          result.sort($.proxy(function (student1, student2) {
            return student1.id == this.options.studentIdentifier ? -1 : student2.id == this.options.studentIdentifier ? 1 : 0;
          }, this));
          
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.records.errormessage.noworkspaces', err));
          } else {
            renderDustTemplate('/records/records_studyprogrammes.dust', { students: result }, $.proxy(function(text) {
              this.element.append(text);
              this.element.removeClass('loading');
            }, this));
          }
        }, this));
    },
    
    _createStudentWorkspacesLoad: function (studentIdentifier, curriculumIdentifier) {
      return $.proxy(function (callback) {
        this._loadStudentWorkspaces(studentIdentifier, curriculumIdentifier, $.proxy(function (err, workspaces) {
          callback(err, workspaces);
        }, this));
      }, this);
    },
    
    _createStudentTransferCreditsLoad: function (studentIdentifier, curriculumIdentifier) {
      return $.proxy(function (callback) {
        this._loadStudentTransferCredits(studentIdentifier, curriculumIdentifier, $.proxy(function (err, transferCredits) {
          callback(err, transferCredits);
        }, this));
      }, this);
    },
    
    _loadStudentWorkspaces: function (studentIdentifier, curriculumIdentifier, callback) {
      mApi().workspace.workspaces
        .read({ includeArchivedWorkspaceUsers: true, userIdentifier: studentIdentifier, curriculums: curriculumIdentifier, includeUnpublished: true, orderBy: ['alphabet'], maxResults: 500 })
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
    
    _loadStudentTransferCredits: function (studentIdentifier, curriculumIdentifier, callback) {
      mApi().user.students.transferCredits
        .read(studentIdentifier, { curriculumIdentifier: curriculumIdentifier })
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
            mApi().workspace.workspaces.journal.read(workspaceEntityId, {userEntityId: this.options.userEntityId})
              .callback($.proxy(function (err, journalEntries) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                }
                else {
                  renderDustTemplate('/records/records_item_open.dust', { 
                    assignments: assignments,
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
      
      container.toggle();
      
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
    });
    $('[data-files]').recordFiles({
    });
  });
  
 

}).call(this);

