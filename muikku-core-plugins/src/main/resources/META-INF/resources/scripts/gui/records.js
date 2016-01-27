(function() {
  
  $.widget("custom.records", {
    options: {
      studentIdentifier: null
    },
    
    _create : function() {
      this._grades = $.parseJSON(this.element.attr('data-grades'));
      this.element.on('click', '.tr-task-evaluated', $.proxy(this._onEvaluationClick, this));
      this.element.on('click', '.tr-item:not(.open)', $.proxy(this._onItemClick, this));
      this.element.on('click', '.tr-view-toolbar .icon-goback', $.proxy(this._loadWorkspaces, this));      
      this._loadWorkspaces();
    },
    
    _loadWorkspaces: function () {
      this._clear();
      
      mApi().user.students
        .read({userEntityId: this.options.userEntityId})
        .on('$', $.proxy(function (student, callback) {
          // TODO: sync load
          this._loadStudentWorkspaces(student.id, $.proxy(function (workspaces) {
            this._loadStudentTransferCredits(student.id, function (transferCredits) {
              student.workspaces = workspaces;
              student.transferCredits = transferCredits;
              callback();
            });
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
            }, this));
          }
        }, this));
    },
    
    _loadStudentWorkspaces: function (studentIdentifier, callback) {
      mApi().workspace.workspaces
        .read({ includeArchivedWorkspaceUsers: true, userIdentifier: studentIdentifier, includeUnpublished: true, orderBy: ['alphabet'] })
        .on('$', $.proxy(function (workspaceEntity, callback) {
          mApi().workspace.workspaces.assessments
            .read(workspaceEntity.id, { studentIdentifier: studentIdentifier })
            .callback($.proxy(function (assessmentsErr, assessments) {
              if( assessmentsErr ){
                $('.notification-queue').notificationQueue('notification', 'error', assessmentsErr );
              } else {
                var assessment = assessments && assessments.length == 1 ? assessments[0] : null;
                if (assessment) {
                  var grade = this._getGrade(assessment.gradingScaleSchoolDataSource, assessment.gradingScaleIdentifier, assessment.gradeSchoolDataSource, assessment.gradeIdentifier);
                  workspaceEntity.evaluated = formatDate(new Date(assessment.evaluated));
                  workspaceEntity.verbalAssessment = assessment.verbalAssessment;
                  workspaceEntity.grade = grade.grade;
                  workspaceEntity.gradingScale = grade.scale;
                }
              }
              
              callback();
            }, this));
          }, this))
          .callback($.proxy(function (err, workspaces) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              callback(workspaces); 
            }
          }, this));
    },
    
    _loadStudentTransferCredits: function (studentIdentifier, callback) {
      mApi().user.students.transferCredits
        .read(studentIdentifier)
        .callback($.proxy(function (err, transferCredits) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
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
                  evaluated: formatDate(new Date(transferCredit.date)),
                  grade: grade.grade,
                  gradingScale: grade.scale
                });
              }
            }, this));
            
            callback(data);
          }
        }, this));
    },
    
    _getGrade: function (gradingScaleSchoolDataSource, gradingScaleIdentifier, gradeSchoolDataSource, gradeIdentifier) {
      if (gradingScaleSchoolDataSource && gradingScaleIdentifier && gradeSchoolDataSource && gradeIdentifier) {
        var gradeId = [gradingScaleSchoolDataSource, gradingScaleIdentifier, gradeSchoolDataSource, gradeIdentifier].join('-');
        return this._grades[gradeId];
      }
        
      return null;
    },
    
    _loadWorkspace: function (workspaceEntityId, workspaceEntityName, workspaceEntityDescription, grade, gradingScale, evaluated, verbalAssessment) {

      this._load();

      mApi().workspace.workspaces.materials.read(workspaceEntityId, { assignmentType: 'EVALUATED' })
        .on('$', $.proxy(function (workspaceMaterial, callback) {
          // TODO: support for binary materials?
          
          mApi().materials.html.read(workspaceMaterial.materialId).callback($.proxy(function (htmlErr, htmlMaterial) {
            if (htmlErr) {
              $('.notification-queue').notificationQueue('notification', 'error', htmlErr);
            } else {
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
                  }
                  
                  callback(); 
                }
              }, this));
            }
          }, this));   
        }, this))
      
        .callback($.proxy(function (err, assignments) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.records.errormessage.noworkspaces', err));
          } else {
            renderDustTemplate('/records/records_item_open.dust', { 
              assignments: assignments,
              workspaceName : workspaceEntityName,
              workspaceDescription : workspaceEntityDescription,
              workspaceGrade: grade, 
              workspaceGradingScale: gradingScale, 
              workspaceEvaluated: evaluated, 
              workspaceVerbalAssessment: verbalAssessment
            }, $.proxy(function(text) {
              this._clear();
              this.element.append(text);
            }, this));
          }
        }, this));
    },
    _onItemClick: function (event) {
      var item = $(event.target).hasClass('tr-item') ? $(event.target) : $(event.target).closest('.tr-item');
      
      var workspaceEntityId = $(item).attr('data-workspace-entity-id');
      var workspaceEntityName =  $(item).attr('data-workspace-entity-name');
      var workspaceEntityDescription = $(item).find('#description').html();
      var workspaceEntityGrade =  $(item).attr('data-workspace-entity-grade');
      var verbalAssessment = $(item).attr('data-workspace-verbal-assessment');
      var grade = $(item).attr('data-workspace-grade');
      var gradingScale = $(item).attr('data-workspace-grading-scale');
      var evaluated = $(item).attr('data-workspace-evaluated');
     
      this._loadWorkspace(workspaceEntityId, workspaceEntityName, workspaceEntityDescription, grade, gradingScale, evaluated, verbalAssessment);
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
    $('.tr-records-view-container').records({
      'userEntityId': MUIKKU_LOGGED_USER_ID,
      'studentIdentifier': MUIKKU_LOGGED_USER
    });
  });
  
 

}).call(this);

