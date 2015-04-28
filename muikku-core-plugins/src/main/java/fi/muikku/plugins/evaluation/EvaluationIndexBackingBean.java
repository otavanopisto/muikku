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
import fi.muikku.schooldata.CourseMetaController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.CourseIdentifier;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/evaluation", to = "/jsf/evaluation/index.jsf")
@LoggedIn
public class EvaluationIndexBackingBean {
  
  @Parameter ("workspaceEntityId")
  private Long workspaceEntityId;

  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private CourseMetaController courseMetaController;
  
  @RequestAction
  public String init() {
    // TODO: Logged in as teacher?
    
    ArrayList<WorkspaceItem> items = new ArrayList<>();
    
    for (WorkspaceEntity workspaceEntity : workspaceController.listWorkspaceEntitiesByUser(sessionController.getLoggedUserEntity())) {
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      CourseIdentifier courseIdentifier = courseMetaController.findCourseIdentifier(workspace.getSchoolDataSource(), workspace.getCourseIdentifierIdentifier());
      if (courseIdentifier != null) {
        if (workspaceEntity.getId().equals(getWorkspaceEntityId())) {
          items.add(0, new WorkspaceItem(workspaceEntity.getId(), courseIdentifier.getCode(), workspace.getName()));
        } else {
          items.add(new WorkspaceItem(workspaceEntity.getId(), courseIdentifier.getCode(), workspace.getName()));
        }
      }
    }
    
    workspaceItems = Collections.unmodifiableList(items);
    
    if (getWorkspaceEntityId() == null && !workspaceItems.isEmpty()) {
      workspaceEntityId = workspaceItems.get(0).getWorkspaceEntityId();
    }
    
    if (workspaceEntityId == null) {
      return NavigationRules.NOT_FOUND;
    }
    
    return null;
  }
  
  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }
  
  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }
  
  public List<WorkspaceItem> getWorkspaceItems() {
    return workspaceItems;
  }
  
  private List<WorkspaceItem> workspaceItems;
  
  public static class WorkspaceItem {

    public WorkspaceItem(Long workspaceEntityId, String code, String title) {
      super();
      this.workspaceEntityId = workspaceEntityId;
      this.code = code;
      this.title = title;
    }

    public String getCode() {
      return code;
    }

    public void setCode(String code) {
      this.code = code;
    }

    public String getTitle() {
      return title;
    }

    public void setTitle(String title) {
      this.title = title;
    }
    
    public Long getWorkspaceEntityId() {
      return workspaceEntityId;
    }
    
    public void setWorkspaceEntityId(Long workspaceEntityId) {
      this.workspaceEntityId = workspaceEntityId;
    }

    private String code;
    private String title;
    private Long workspaceEntityId;
  }

}
