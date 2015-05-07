package fi.muikku.plugins.evaluation;

import java.util.ArrayList;
import java.util.Collections;
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
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation;
import fi.muikku.plugins.workspace.ContentNode;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.WorkspaceMaterialException;
import fi.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.schooldata.GradingController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.GradingScale;
import fi.muikku.schooldata.entity.GradingScaleItem;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceAssessment;
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

  @RequestAction
  public String init() {
    // TODO: Logged in as teacher?

    if (workspaceEntityId == null) {
      return NavigationRules.NOT_FOUND;
    }
    
    Integer firstStudent = getPageId() * getMaxStudents();
    
    List<WorkspaceStudent> students = new ArrayList<>();
    List<ContentNode> assignmentNodes = null;
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    try {
      assignmentNodes = getAssignmentNodes(workspaceEntity);
    } catch (WorkspaceMaterialException e) {
      logger.log(Level.SEVERE, "Failed to loading workspace materials", e);
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
          String assessmentData = "";
          if(!assessments.isEmpty()){
            status = "ASSESSED";
            //TODO: which one?
            WorkspaceAssessment assessment = assessments.get(0);
            GradingScale gradingScale = gradingController.findGradingScale(assessment.getGradingScaleSchoolDataSource(), assessment.getGradingScaleIdentifier());
            GradingScaleItem grade = gradingController.findGradingScaleItem(gradingScale, assessment.getGradeSchoolDataSource(), assessment.getGradeIdentifier());
            String gradeString = String.format("%s/%s@%s/%s", grade.getIdentifier(), grade.getSchoolDataSource(), gradingScale.getIdentifier(), gradingScale.getSchoolDataSource());
            User assessingUser = userController.findUserByDataSourceAndIdentifier(assessment.getAssessingUserSchoolDataSource(), assessment.getAssessingUserIdentifier()); 
            UserEntity assessingUserEntity = userEntityController.findUserEntityByUser(assessingUser);
            try {
              assessmentData = new ObjectMapper().writeValueAsString(new WorkspaceStudentEvaluation(gradeString, assessment.getVerbalAssessment(), assessingUserEntity.getId(), assessment.getDate().getTime()));
            } catch (JsonProcessingException e) {
              logger.log(Level.SEVERE, "Grading scales serialization failed", e);
              return NavigationRules.INTERNAL_ERROR;
            }
            
          }
          students.add(new WorkspaceStudent(userEntity.getId(), workspaceStudent.getId(), String.format("%s %s", user.getFirstName(), user.getLastName()), status, assessmentData));
        }
      }
    }
    
    this.workspaceStudents = Collections.unmodifiableList(students);
    this.assignments = createAssignments(workspaceStudents, assignmentNodes);
    
    return null;
  }

  private List<ContentNode> getAssignmentNodes(WorkspaceEntity workspaceEntity) throws WorkspaceMaterialException {
    // TODO: Optimize this
    List<ContentNode> result = new ArrayList<>();
    addAssignmentNodes(workspaceMaterialController.listWorkspaceMaterialsAsContentNodes(workspaceEntity, false), result);
    return result;
  }

  private void addAssignmentNodes(List<ContentNode> contentNodes, List<ContentNode> result) {
    for (ContentNode contentNode : contentNodes) {
      if (contentNode.getAssignmentType() == WorkspaceMaterialAssignmentType.EVALUATED) {
        result.add(contentNode);
      } else {
        addAssignmentNodes(contentNode.getChildren(), result);
      }
    }
  }

  private List<Assignment> createAssignments(List<WorkspaceUserEntity> workspaceStudents, List<ContentNode> assignmentNodes) {
    List<Assignment> result = new ArrayList<>(assignmentNodes.size());
    for (ContentNode assignmentNode : assignmentNodes) {
      WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(assignmentNode.getWorkspaceMaterialId());

      List<StudentAssignment> studentAssignments = new ArrayList<>(workspaceStudents.size());
      for (WorkspaceUserEntity workspaceStudent : workspaceStudents) {
        StudentAssignmentStatus status = StudentAssignmentStatus.UNANSWERED;

        UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(workspaceStudent.getUserSchoolDataIdentifier().getDataSource(),
            workspaceStudent.getUserSchoolDataIdentifier().getIdentifier());
        WorkspaceMaterialEvaluation evaluation = evaluationController.findWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(workspaceMaterial,
            userEntity);
        if (evaluation == null) {
          WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial,
              userEntity);
          if (reply != null) {
            status = StudentAssignmentStatus.DONE;
          }
        } else {
          // TODO: Should it be evaluated even when teacher has given a non passing grade?
          status = StudentAssignmentStatus.EVALUATED;
        }

        studentAssignments.add(new StudentAssignment(userEntity.getId(), evaluation != null ? evaluation.getId() : null, status));
      }

      result.add(new Assignment(workspaceMaterial.getId(), workspaceMaterial.getMaterialId(), assignmentNode.getTitle(), assignmentNode.getHtml(),
          assignmentNode.getType(), studentAssignments));
    }

    return result;
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

  public List<Assignment> getAssignments() {
    return assignments;
  }

  public List<WorkspaceStudent> getWorkspaceStudents() {
    return workspaceStudents;
  }

  private List<Assignment> assignments;
  private List<WorkspaceStudent> workspaceStudents;

  public static class WorkspaceStudent {

    public WorkspaceStudent(Long userEntityId, Long workspaceUserEntityId, String displayName, String status, String assessmentData) {
      this.userEntityId = userEntityId;
      this.workspaceUserEntityId = workspaceUserEntityId;
      this.displayName = displayName;
      this.status = status;
      this.assessmentData = assessmentData;
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

    public String getStatus() {
      return status;
    }

    public String getAssessmentData() {
      return assessmentData;
    }

    private Long workspaceUserEntityId;
    private Long userEntityId;
    private String displayName;
    private String status;
    private String assessmentData;
  }

  public static class WorkspaceStudentEvaluation {

    public WorkspaceStudentEvaluation(String gradeString, String verbalAssessment, Long assessingUserEntityId, Long date) {
      this.gradeString = gradeString;
      this.verbalAssessment = verbalAssessment;
      this.assessingUserEntityId = assessingUserEntityId;
      this.date = date;
    }

    public String getGradeString() {
      return gradeString;
    }

    public void setGradeString(String gradeString) {
      this.gradeString = gradeString;
    }

    public String getVerbalAssessment() {
      return verbalAssessment;
    }

    public void setVerbalAssessment(String verbalAssessment) {
      this.verbalAssessment = verbalAssessment;
    }

    public Long getAssessingUserEntityId() {
      return assessingUserEntityId;
    }

    public void setAssessingUserEntityId(Long assessingUserEntityId) {
      this.assessingUserEntityId = assessingUserEntityId;
    }

    public Long getDate() {
      return date;
    }

    public void setDate(Long date) {
      this.date = date;
    }

    private String gradeString;
    private String verbalAssessment;
    private Long assessingUserEntityId;
    private Long date;
  }

  public static class Assignment {

    public Assignment(Long workspaceMaterialId, Long materialId, String title, String html, String type, List<StudentAssignment> studentAssignments) {
      this.materialId = materialId;
      this.workspaceMaterialId = workspaceMaterialId;
      this.title = title;
      this.html = html;
      this.type = type;
      this.studentAssignments = studentAssignments;
    }

    public Long getWorkspaceMaterialId() {
      return workspaceMaterialId;
    }

    public Long getMaterialId() {
      return materialId;
    }

    public String getTitle() {
      return title;
    }

    public String getHtml() {
      return html;
    }

    public String getType() {
      return type;
    }

    public List<StudentAssignment> getStudentAssignments() {
      return studentAssignments;
    }

    private Long workspaceMaterialId;
    private Long materialId;
    private String title;
    private String html;
    private String type;
    private List<StudentAssignment> studentAssignments;
  }

  public static class StudentAssignment {

    public StudentAssignment(Long studentEntityId, Long workspaceMaterialEvaluationId, StudentAssignmentStatus status) {
      this.studentEntityId = studentEntityId;
      this.workspaceMaterialEvaluationId = workspaceMaterialEvaluationId;
      this.status = status;
    }

    public Long getStudentEntityId() {
      return studentEntityId;
    }

    public StudentAssignmentStatus getStatus() {
      return status;
    }

    public Long getWorkspaceMaterialEvaluationId() {
      return workspaceMaterialEvaluationId;
    }

    private Long studentEntityId;
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
