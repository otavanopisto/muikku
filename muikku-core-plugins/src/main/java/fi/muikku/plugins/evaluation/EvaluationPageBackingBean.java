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
import fi.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation;
import fi.muikku.plugins.workspace.ContentNode;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.WorkspaceMaterialException;
import fi.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.schooldata.GradingController;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.GradingScale;
import fi.muikku.schooldata.entity.GradingScaleItem;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceAssessment;
import fi.muikku.schooldata.entity.WorkspaceAssessmentRequest;
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

          Date assessmentRequestDate = null;
          try {
            List<WorkspaceAssessmentRequest> assessmentRequests = assessmentRequestController.listByWorkspaceUser(workspaceStudent);

            assessmentRequestDate = findMaxDate(assessmentRequests);
            
            if (!assessmentRequests.isEmpty()){
              WorkspaceAssessmentRequest assessmentRequest = assessmentRequests.get(0);
              
              boolean hasAssessment = !assessments.isEmpty();
              WorkspaceAssessment assessment = hasAssessment ? assessments.get(0) : null;

              if ((!hasAssessment) || (assessmentRequestDate.after(assessment.getDate()))) {
                if (assessmentRequest.getDate().getTime() + 1209600000 < new Date().getTime())
                  status = "CRITICAL";
                else
                  status = "ASSESSMENTREQUESTED";
              }
            }
          } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e1) {
            // TODO Auto-generated catch block
            e1.printStackTrace();
          }
          
          List<StudentAssignment> studentAssignments = new ArrayList<>();

          try {
            for (ContentNode assignmentNode : assignmentNodes) {
              StudentAssignmentStatus assignmentStatus = StudentAssignmentStatus.UNANSWERED;
              WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(assignmentNode.getWorkspaceMaterialId());
              WorkspaceMaterialEvaluation assignmentEvaluation = evaluationController.findWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(workspaceMaterial, userEntity);

              Long numOfTries = 0l;
              Date replyCreated = null;
              Date replyModified = null;
              
              if (assignmentEvaluation == null) {
                WorkspaceMaterialReply assignmentReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, userEntity);
                if (assignmentReply != null) {
                  assignmentStatus = StudentAssignmentStatus.DONE;
                  replyCreated = assignmentReply.getCreated();
                  replyModified = assignmentReply.getLastModified();
                }
              } else {
                assignmentStatus = StudentAssignmentStatus.EVALUATED;
                WorkspaceMaterialReply assignmentReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, userEntity);
                if (assignmentReply != null) {
                  replyCreated = assignmentReply.getCreated();
                  replyModified = assignmentReply.getLastModified();
                }
              }

              studentAssignments.add(new StudentAssignment(workspaceMaterial.getId(), assignmentEvaluation != null ? assignmentEvaluation.getId() : null, assignmentStatus,
                  numOfTries, replyCreated, replyModified));
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
              alreadyEvaluated,
              assessmentRequestDate));
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

  private Date findMaxDate(List<WorkspaceAssessmentRequest> wars) {
    Date maxDate = null;
    
    for (WorkspaceAssessmentRequest war : wars) {
      Date compDate = war.getDate();
      
      if (compDate != null) {
        if (maxDate == null) {
          maxDate = compDate;
        } else {
          maxDate = maxDate.before(compDate) ? compDate : maxDate;
        }
      }
    }
    
    return maxDate;
  }
  
  private List<WorkspaceStudent> workspaceStudents;

  public static class WorkspaceStudent {

    public WorkspaceStudent(Long userEntityId, Long workspaceUserEntityId, String displayName, String studyProgrammeName, String status, String studentAssignmentData, String workspaceAssessmentData, boolean evaluated, Date assessmentRequestDate) {
      this.userEntityId = userEntityId;
      this.workspaceUserEntityId = workspaceUserEntityId;
      this.displayName = displayName;
      this.studyProgrammeName = studyProgrammeName;
      this.status = status;
      this.studentAssignmentData = studentAssignmentData;
      this.workspaceAssessmentData = workspaceAssessmentData;
      this.evaluated = evaluated;
      this.assessmentRequestDate = assessmentRequestDate;
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
    
    public Date getAssessmentRequestDate() {
      return assessmentRequestDate;
    }

    public void setAssessmentRequestDate(Date assessmentRequestDate) {
      this.assessmentRequestDate = assessmentRequestDate;
    }

    private Date assessmentRequestDate;
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

    public StudentAssignment(Long workspaceMaterialId, Long workspaceMaterialEvaluationId, StudentAssignmentStatus status, Long numOfTries, Date created, Date lastModified) {
      this.workspaceMaterialId = workspaceMaterialId;
      this.workspaceMaterialEvaluationId = workspaceMaterialEvaluationId;
      this.status = status;
      this.numOfTries = numOfTries;
      this.created = created;
      this.lastModified = lastModified;
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

    public Long getNumOfTries() {
      return numOfTries;
    }

    public Date getCreated() {
      return created;
    }

    public Date getLastModified() {
      return lastModified;
    }

    private final Long workspaceMaterialId;
    private final StudentAssignmentStatus status;
    private final Long workspaceMaterialEvaluationId;
    private final Long numOfTries;
    private final Date created;
    private final Date lastModified;
  }

  public static enum StudentAssignmentStatus {

    UNANSWERED,

    DONE,

    EVALUATED,

    EVALUATION_CRITICAL

  }

}
