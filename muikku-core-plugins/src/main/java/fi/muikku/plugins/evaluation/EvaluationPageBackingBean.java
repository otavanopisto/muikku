package fi.muikku.plugins.evaluation;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugins.assessmentrequest.AssessmentRequest;
import fi.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.muikku.plugins.assessmentrequest.AssessmentRequestState;
import fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation;
import fi.muikku.plugins.workspace.ContentNode;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.WorkspaceMaterialException;
import fi.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.schooldata.GradingController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.GradingScale;
import fi.muikku.schooldata.entity.GradingScaleItem;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceAssessment;
import fi.muikku.session.SessionController;
import fi.muikku.users.EnvironmentUserController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/evaluation/{workspaceEntityId}/page/{pageId}", to = "/jsf/evaluation/page.jsf")
@LoggedIn
public class EvaluationPageBackingBean {

  @Inject
  private Logger logger;

  @Parameter("workspaceEntityId")
  private Long workspaceEntityId;

  @Parameter("pageId")
  private Integer pageId;

  @Parameter("maxStudents")
  private Integer maxStudents;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private EvaluationController evaluationController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private UserController userController;

  @Inject
  private GradingController gradingController;
  
  @Inject
  private AssessmentRequestController assessmentRequestController;

  @Inject
  private EnvironmentUserController environmentUserController;
  
  @RequestAction
  public String init() {
    EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(sessionController.getLoggedUserEntity());
    if (environmentUser == null) {
      return NavigationRules.ACCESS_DENIED;  
    }
    
    switch (environmentUser.getRole().getArchetype()) {
      case TEACHER:
      case ADMINISTRATOR:
      case MANAGER:
      break;
      default:
        return NavigationRules.ACCESS_DENIED;  
    }

    if (workspaceEntityId == null) {
      return NavigationRules.NOT_FOUND;
    }

    Integer firstStudent = getPageId() * getMaxStudents();

    List<WorkspaceStudent> students = new ArrayList<>();

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    List<ContentNode> assignmentNodes;
    try {
      assignmentNodes = evaluationController.getAssignmentContentNodes(workspaceEntity, false);
    } catch (WorkspaceMaterialException e) {
      logger.log(Level.SEVERE, "Failed to load workspace assignments", e);
      return NavigationRules.INTERNAL_ERROR;
    }

    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    List<WorkspaceUserEntity> workspaceStudents = workspaceController.listWorkspaceUserEnitiesByWorkspaceRoleArchetype(workspaceEntity, WorkspaceRoleArchetype.STUDENT, firstStudent, getMaxStudents());
    for (WorkspaceUserEntity workspaceStudent : workspaceStudents) {
      User user = userController.findUserByDataSourceAndIdentifier(workspaceEntity.getDataSource(), workspaceStudent.getUserSchoolDataIdentifier().getIdentifier());
      if (user != null) {
        UserEntity userEntity = userEntityController.findUserEntityByUser(user);
        if (userEntity != null) {
          List<WorkspaceAssessment> assessments = gradingController.listWorkspaceAssessments(workspaceEntity.getDataSource(), workspace.getIdentifier(), user.getIdentifier());
          String status = "UNASSESSED";
          boolean alreadyEvaluated = false;
          String assessmentData = "";
          if (!assessments.isEmpty()) {
            status = "ASSESSED";
            alreadyEvaluated = true;
            WorkspaceAssessment assessment = assessments.get(0);
            GradingScale gradingScale = gradingController.findGradingScale(assessment.getGradingScaleSchoolDataSource(), assessment.getGradingScaleIdentifier());
            GradingScaleItem grade = gradingController.findGradingScaleItem(gradingScale, assessment.getGradeSchoolDataSource(), assessment.getGradeIdentifier());
            String gradeString = String.format("%s/%s@%s/%s", grade.getIdentifier(), grade.getSchoolDataSource(), gradingScale.getIdentifier(), gradingScale.getSchoolDataSource());
            User assessingUser = userController.findUserByDataSourceAndIdentifier(assessment.getAssessingUserSchoolDataSource(), assessment.getAssessingUserIdentifier());
            UserEntity assessingUserEntity = userEntityController.findUserEntityByUser(assessingUser);
            try {
              assessmentData = new ObjectMapper().writeValueAsString(new WorkspaceStudentEvaluation(assessment.getIdentifier(), gradeString, assessment.getVerbalAssessment(), assessingUserEntity.getId(), assessment.getDate().getTime()));
            } catch (JsonProcessingException e) {
              logger.log(Level.SEVERE, "Assessment data serialization failed", e);
              return NavigationRules.INTERNAL_ERROR;
            }

          }
          List<AssessmentRequest> assessmentRequests = assessmentRequestController.listByWorkspaceIdAndStudentIdOrderByCreated(workspaceEntity.getId(), userEntity.getId());
          if(!assessmentRequests.isEmpty()){
            AssessmentRequest assessmentRequest = assessmentRequests.get(0);
            if(assessments.isEmpty()){
              if(AssessmentRequestState.PENDING == assessmentRequest.getState() ){
                status = "ASSESSMENTREQUESTED";
              }
            }else{
              WorkspaceAssessment assessment = assessments.get(0);
              if(AssessmentRequestState.PENDING == assessmentRequest.getState() && assessment.getDate().getTime() < assessmentRequest.getDate().getTime()){
                status = "ASSESSMENTREQUESTED";
              }
            }
           if("ASSESSMENTREQUESTED".equals(status)){
             if(assessmentRequest.getDate().getTime() + 1209600000 < new Date().getTime()){
               status = "CRITICAL";
             }
           }

          }
          
          List<StudentAssignment> studentAssignments = new ArrayList<>();

          try {
            for (ContentNode assignmentNode : assignmentNodes) {
              StudentAssignmentStatus assignmentStatus = StudentAssignmentStatus.UNANSWERED;
              WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(assignmentNode.getWorkspaceMaterialId());
              WorkspaceMaterialEvaluation assignmentEvaluation = evaluationController.findWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(workspaceMaterial, userEntity);

              if (assignmentEvaluation == null) {
                WorkspaceMaterialReply assignmentReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, userEntity);
                if (assignmentReply != null) {
                  assignmentStatus = StudentAssignmentStatus.DONE;
                }
              } else {
                assignmentStatus = StudentAssignmentStatus.EVALUATED;
              }

              studentAssignments.add(new StudentAssignment(workspaceMaterial.getId(), assignmentEvaluation != null ? assignmentEvaluation.getId() : null, assignmentStatus));
            }
          } catch (Exception e) {
            logger.log(Level.SEVERE, "Failed to load student workspace assignments", e);
            return NavigationRules.INTERNAL_ERROR;
          }

          String studentAssignmentData;
          try {
            studentAssignmentData = new ObjectMapper().writeValueAsString(studentAssignments);
          } catch (Exception e) {
            logger.log(Level.SEVERE, "Failed to serialize student workspace assignments", e);
            return NavigationRules.INTERNAL_ERROR;
          }

          students.add(new WorkspaceStudent(userEntity.getId(), 
              workspaceStudent.getId(), 
              String.format("%s %s", user.getFirstName(), user.getLastName()), 
              user.getStudyProgrammeName(), 
              status, 
              studentAssignmentData, 
              assessmentData, 
              alreadyEvaluated));
        }
      }
    }

    this.workspaceStudents = Collections.unmodifiableList(students);

    return null;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public Integer getMaxStudents() {
    return maxStudents;
  }

  public void setMaxStudents(Integer maxStudents) {
    this.maxStudents = maxStudents;
  }

  public Integer getPageId() {
    return pageId;
  }

  public void setPageId(Integer pageId) {
    this.pageId = pageId;
  }

  public List<WorkspaceStudent> getWorkspaceStudents() {
    return workspaceStudents;
  }

  private List<WorkspaceStudent> workspaceStudents;

  public static class WorkspaceStudent {

    public WorkspaceStudent(Long userEntityId, Long workspaceUserEntityId, String displayName, String studyProgrammeName, String status, String studentAssignmentData, String workspaceAssessmentData, boolean evaluated) {
      this.userEntityId = userEntityId;
      this.workspaceUserEntityId = workspaceUserEntityId;
      this.displayName = displayName;
      this.studyProgrammeName = studyProgrammeName;
      this.status = status;
      this.studentAssignmentData = studentAssignmentData;
      this.workspaceAssessmentData = workspaceAssessmentData;
      this.evaluated = evaluated;
    }

    public Long getUserEntityId() {
      return userEntityId;
    }

    public Long getWorkspaceUserEntityId() {
      return workspaceUserEntityId;
    }

    public String getDisplayName() {
      return displayName;
    }
    
    public String getStudyProgrammeName() {
      return studyProgrammeName;
    }

    public String getStatus() {
      return status;
    }

    public String getStudentAssignmentData() {
      return studentAssignmentData;
    }
    
    public String getWorkspaceAssessmentData() {
      return workspaceAssessmentData;
    }

    public boolean getEvaluated(){
      return evaluated;
    }
    
    private Long workspaceUserEntityId;
    private Long userEntityId;
    private String displayName;
    private String studyProgrammeName;
    private String status;
    private String studentAssignmentData;
    private String workspaceAssessmentData;
    private boolean evaluated;
  }

  public static class WorkspaceStudentEvaluation {
    WorkspaceStudentEvaluation(String assessmentIdentifier, String gradeString, String verbalAssessment, Long assessingUserEntityId, Long date) {
      this.assessmentIdentifier = assessmentIdentifier;
      this.assessingUserEntityId = assessingUserEntityId;
      this.gradeString = gradeString;
      this.verbalAssessment = verbalAssessment;
      this.date = date;
    }

    public String getGradeString() {
      return gradeString;
    }

    public String getVerbalAssessment() {
      return verbalAssessment;
    }

    public Long getAssessingUserEntityId() {
      return assessingUserEntityId;
    }

    public Long getDate() {
      return date;
    } 
    
    public String getAssessmentIdentifier() {
      return assessmentIdentifier;
    }
    
    private String assessmentIdentifier;
    private String gradeString;
    private String verbalAssessment;
    private Long assessingUserEntityId;
    private Long date;

  }

  public static class StudentAssignment {

    public StudentAssignment(Long workspaceMaterialId, Long workspaceMaterialEvaluationId, StudentAssignmentStatus status) {
      this.workspaceMaterialId = workspaceMaterialId;
      this.workspaceMaterialEvaluationId = workspaceMaterialEvaluationId;
      this.status = status;
    }

    public Long getWorkspaceMaterialId() {
      return workspaceMaterialId;
    }

    public StudentAssignmentStatus getStatus() {
      return status;
    }

    public Long getWorkspaceMaterialEvaluationId() {
      return workspaceMaterialEvaluationId;
    }

    private Long workspaceMaterialId;
    private StudentAssignmentStatus status;
    private Long workspaceMaterialEvaluationId;
  }

  public static enum StudentAssignmentStatus {

    UNANSWERED,

    DONE,

    EVALUATED,

    EVALUATION_CRITICAL

  }

}
