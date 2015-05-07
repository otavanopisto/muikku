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
  
  @Parameter ("workspaceEntityId")
  private Long workspaceEntityId;
  
  @Parameter ("pageId")
  private Integer pageId;
  
  @Parameter ("maxStudents")
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
          if(!assessments.isEmpty()){
            status = "ASSESSED";
          }
          students.add(new WorkspaceStudent(userEntity.getId(), workspaceStudent.getId(), String.format("%s %s", user.getFirstName(), user.getLastName()), status));
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

        UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(workspaceStudent.getUserSchoolDataIdentifier().getDataSource(), workspaceStudent.getUserSchoolDataIdentifier().getIdentifier());
        WorkspaceMaterialEvaluation evaluation = evaluationController.findWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(workspaceMaterial, userEntity);
        if (evaluation == null) {
          WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, userEntity);
          if (reply != null) {
            status = StudentAssignmentStatus.DONE;
          }
        } else {
          // TODO: Should it be evaluated even when teacher has given a non passing grade?
          status = StudentAssignmentStatus.EVALUATED;
        }
        
        studentAssignments.add(new StudentAssignment(userEntity.getId(), evaluation != null ? evaluation.getId() : null, status));
      }
      
      result.add(new Assignment(workspaceMaterial.getId(), assignmentNode.getTitle(), studentAssignments));
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
   
    public WorkspaceStudent(Long userEntityId, Long workspaceUserEntityId, String displayName, String status) {
      this.userEntityId = userEntityId;
      this.workspaceUserEntityId = workspaceUserEntityId;
      this.displayName = displayName;
      this.status = status;
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

    private Long workspaceUserEntityId;
    private Long userEntityId;
    private String displayName;
    private String status;
  }

  public static class Assignment {
    
    public Assignment(Long workspaceMaterialId, String title, List<StudentAssignment> studentAssignments) {
      this.workspaceMaterialId = workspaceMaterialId;
      this.title = title;
      this.studentAssignments = studentAssignments;
    }
    
    public Long getWorkspaceMaterialId() {
      return workspaceMaterialId;
    }
    
    public String getTitle() {
      return title;
    }
    
    public List<StudentAssignment> getStudentAssignments() {
      return studentAssignments;
    }
    
    private Long workspaceMaterialId;
    private String title;
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
