package fi.otavanopisto.muikku.schooldata;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;

public class WorkspaceSignupGroupController {

  @Inject
  private Logger logger;
  
  @Inject
  private OrganizationEntityController organizationEntityController;
  
  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  /**
   * Lists Groups are available to be bound as signup groups of a workspace.
   */
  public List<UserGroupEntity> listAvailableWorkspaceSignupGroups() {
    List<UserGroupEntity> userGroupEntities;
    
    String permissionGroupIds = pluginSettingsController.getPluginSetting("workspace", "permission-group-ids");
    if (StringUtils.isEmpty(permissionGroupIds)) {
      userGroupEntities = userGroupEntityController.listUserGroupEntities();
    }
    else {
      boolean fullOrganizationAccess = organizationEntityController.canCurrentUserAccessAllOrganizations();
      OrganizationEntity organizationEntity = organizationEntityController.getCurrentUserOrganization();
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
            if (fullOrganizationAccess || (organizationEntity != null && organizationEntity.getId().equals(userGroupEntity.getOrganization().getId()))) {
              userGroupEntities.add(userGroupEntity);
            }
          }
        }
        else {
          logger.warning(String.format("Malformatted plugin setting workspace.permission-group-ids %s", permissionGroupIds));
        }
      }
    }
    
    return userGroupEntities;
  }
  
}
