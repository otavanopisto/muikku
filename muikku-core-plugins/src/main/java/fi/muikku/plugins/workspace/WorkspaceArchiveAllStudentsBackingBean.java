package fi.muikku.plugins.workspace;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.session.SessionController;
import fi.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}/archiveallstudents", to = "/jsf/workspace/archive-all-students.jsf")
@LoggedIn
public class WorkspaceArchiveAllStudentsBackingBean {

  @Inject
  private SessionController sessionController;

  @Parameter
  private String workspaceUrlName;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  @Named
  private WorkspaceBackingBean workspaceBackingBean;

  @RequestAction
  public String init() {
    String urlName = getWorkspaceUrlName();

    if (StringUtils.isBlank(urlName)) {
      return NavigationRules.NOT_FOUND;
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);
    if (workspaceEntity == null) {
      return NavigationRules.NOT_FOUND;
    }
    workspaceEntityId = workspaceEntity.getId();
    workspaceBackingBean.setWorkspaceUrlName(urlName);
  
    if (!sessionController.hasCoursePermission(MuikkuPermissions.ARCHIVE_ALL_WORKSPACE_STUDENTS, workspaceEntity)) {
      return NavigationRules.NOT_FOUND;
    }
    
    List<WorkspaceUserEntity> students = workspaceUserEntityController.listWorkspaceUserEntitiesByRoleArchetype(workspaceEntity, WorkspaceRoleArchetype.STUDENT);
    for (WorkspaceUserEntity student : students) {
      workspaceUserEntityController.archiveWorkspaceUserEntity(student);
    }
    
    return String.format("/jsf/workspace/users.jsf?faces-redirect=true&workspaceUrlName=%s", workspaceUrlName);
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  private Long workspaceEntityId;

}
