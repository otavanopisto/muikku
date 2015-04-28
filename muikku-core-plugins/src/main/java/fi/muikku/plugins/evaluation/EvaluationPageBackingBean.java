package fi.muikku.plugins.evaluation;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.users.UserController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/evaluation/{workspaceEntityId}/page/{pageId}", to = "/jsf/evaluation/page.jsf")
@LoggedIn
public class EvaluationPageBackingBean {
  
  @Parameter ("workspaceEntityId")
  private Long workspaceEntityId;
  
  @Parameter ("pageId")
  private Integer pageId;
  
  @Parameter ("maxStudents")
  private Integer maxStudents;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private UserController userController;
  
  @RequestAction
  public String init() {
    // TODO: Logged in as teacher?

    if (workspaceEntityId == null) {
      return NavigationRules.NOT_FOUND;
    }
    
    Integer firstStudent = getPageId() * getMaxStudents();
    
    List<WorkspaceStudent> students = new ArrayList<>();
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);

    List<WorkspaceUserEntity> workspaceStudents = workspaceController.listWorkspaceUserEnitiesByWorkspaceRoleArchetype(workspaceEntity, WorkspaceRoleArchetype.STUDENT, firstStudent, getMaxStudents());
    for (WorkspaceUserEntity workspaceStudent : workspaceStudents) {
      User user = userController.findUserByDataSourceAndIdentifier(workspaceEntity.getDataSource(), workspaceStudent.getUserSchoolDataIdentifier().getIdentifier());
      students.add(new WorkspaceStudent(workspaceStudent.getId(), String.format("%s %s", user.getFirstName(), user.getLastName())));
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
   
    public WorkspaceStudent(Long workspaceUserEntityId, String displayName) {
      this.workspaceUserEntityId = workspaceUserEntityId;
      this.displayName = displayName;
    }
    
    public Long getWorkspaceUserEntityId() {
      return workspaceUserEntityId;
    }
    
    public String getDisplayName() {
      return displayName;
    }
    
    private Long workspaceUserEntityId;
    private String displayName;
  }

}
