package fi.otavanopisto.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.controller.PermissionController;
import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserGroupController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}/permissions", to = "/jsf/workspace/permissions.jsf")
@LoggedIn
public class WorkspacePermissionsManagementBackingBean extends AbstractWorkspaceBackingBean {

  @Parameter
  private String workspaceUrlName;
  
  @Inject
  private Logger logger;

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

  @Inject
  private PluginSettingsController pluginSettingsController;
  
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

    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.WORKSPACE_MANAGE_PERMISSIONS, workspaceEntity)) {
      return NavigationRules.NOT_FOUND;
    }
    
    workspaceEntityId = workspaceEntity.getId();
    workspaceBackingBean.setWorkspaceUrlName(urlName);
    workspaceName = workspaceBackingBean.getWorkspaceName();
    
    userGroupBeans = new ArrayList<WorkspacePermissionsManagementBackingBean.UserGroupBean>();

    permissions = new ArrayList<Permission>();
    // TODO: atm we only support the sign up permission
    Permission permission = permissionController.findByName(MuikkuPermissions.WORKSPACE_SIGNUP);
    permissions.add(permission);
    
    List<UserGroupEntity> userGroupEntities;
    String permissionGroupIds = pluginSettingsController.getPluginSetting("workspace", "permission-group-ids");
    if (permissionGroupIds == null) {
      userGroupEntities = userGroupEntityController.listUserGroupEntities();
    }
    else {
      userGroupEntities = new ArrayList<UserGroupEntity>();
      String[] idArray = permissionGroupIds.split(",");
      for (int i = 0; i < idArray.length; i++) {
        Long groupId = NumberUtils.createLong(idArray[i]);
        if (groupId != null) {
          UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(groupId);
          if (userGroupEntity == null) {
            logger.warning(String.format("Missing group %d in plugin setting workspace.permission-group-ids", groupId));
          }
          else {
            userGroupEntities.add(userGroupEntity);
          }
        }
        else {
          logger.warning(String.format("Malformatted plugin setting workspace.permission-group-ids %s", permissionGroupIds));
        }
      }
    }

    for (UserGroupEntity userGroupEntity : userGroupEntities) {
      UserGroup userGroup = userGroupController.findUserGroup(userGroupEntity);
      userGroupBeans.add(new UserGroupBean(userGroupEntity.getId(), userGroup.getName()));
    }
    
    Collections.sort(userGroupBeans, new Comparator<UserGroupBean>() {
      @Override
      public int compare(UserGroupBean o1, UserGroupBean o2) {
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

  public List<UserGroupBean> getUserGroups() {
    return userGroupBeans;
  }

  public List<Permission> getPermissions() {
    return permissions;
  }
  
  public boolean hasUserGroupPermission(UserGroupBean userGroup, Permission permission) {
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(userGroup.getId());
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(getWorkspaceEntityId());
    return permissionController.hasWorkspaceGroupPermission(workspaceEntity, userGroupEntity, permission);
  }
  
  public class UserGroupBean {
    public UserGroupBean(Long id, String name) {
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
  private List<UserGroupBean> userGroupBeans;
  private List<Permission> permissions;
}