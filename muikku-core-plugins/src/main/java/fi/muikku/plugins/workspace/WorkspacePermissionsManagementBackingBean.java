package fi.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.controller.PermissionController;
import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.security.Permission;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.UserGroup;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserGroupController;
import fi.muikku.users.UserGroupEntityController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}/permissions", to = "/jsf/workspace/permissions.jsf")
@LoggedIn
public class WorkspacePermissionsManagementBackingBean {

//  @Inject
//  private Logger logger;

  @Parameter
  private String workspaceUrlName;

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  @Named
  private WorkspaceBackingBean workspaceBackingBean;

  @Inject
  private UserGroupController userGroupController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private PermissionController permissionController;

  @Inject
  private SessionController sessionController;
  
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

    if (!sessionController.hasCoursePermission(MuikkuPermissions.WORKSPACE_MANAGEWORKSPACESETTINGS, workspaceEntity)) {
      return NavigationRules.NOT_FOUND;
    }
    
    workspaceEntityId = workspaceEntity.getId();
    workspaceBackingBean.setWorkspaceUrlName(urlName);
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    workspaceName = workspace.getName();
    
    things = new ArrayList<WorkspacePermissionsManagementBackingBean.UserGroupThing>();

    permissions = new ArrayList<Permission>();
    // TODO: atm we only support the sign up permission
    Permission permission = permissionController.findByName(MuikkuPermissions.WORKSPACE_SIGNUP);
    permissions.add(permission);
    
    List<UserGroupEntity> userGroupEntities = userGroupEntityController.listUserGroupEntities();
    for (UserGroupEntity userGroupEntity : userGroupEntities) {
      UserGroup userGroup = userGroupController.findUserGroup(userGroupEntity);
      
      things.add(new UserGroupThing(userGroupEntity.getId(), userGroup.getName()));
    }
    
    Collections.sort(things, new Comparator<UserGroupThing>() {
      @Override
      public int compare(UserGroupThing o1, UserGroupThing o2) {
        return o1.getName().compareTo(o2.getName());
      }
    });
    
    return null;
  }

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }

  public String getWorkspaceName() {
    return workspaceName;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public List<UserGroupThing> getUserGroups() {
    return things;
  }

  public List<Permission> getPermissions() {
    return permissions;
  }
  
  public boolean hasUserGroupPermission(UserGroupThing userGroup, Permission permission) {
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(userGroup.getId());
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(getWorkspaceEntityId());
    
    return permissionController.hasWorkspaceGroupPermission(workspaceEntity, userGroupEntity, permission);
  }
  
  public class UserGroupThing {
    public UserGroupThing(Long id, String name) {
      this.id = id;
      this.name = name;
    }
    public Long getId() {
      return id;
    }
    public void setId(Long id) {
      this.id = id;
    }
    public String getName() {
      return name;
    }
    public void setName(String name) {
      this.name = name;
    }
    private Long id;
    private String name;
  }
  
  private String workspaceName;
  private Long workspaceEntityId;
  private List<UserGroupThing> things;
  private List<Permission> permissions;
}