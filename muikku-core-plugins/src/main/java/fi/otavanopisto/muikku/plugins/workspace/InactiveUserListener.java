package fi.otavanopisto.muikku.plugins.workspace;

import java.util.List;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.search.UserIndexer;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserInactiveEvent;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class InactiveUserListener {

  @Inject
  private UserIndexer userIndexer;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  public void onSchoolDataUserInactiveEvent(@Observes SchoolDataUserInactiveEvent event) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (userSchoolDataIdentifier != null) {
      // Remove an inactive user from all workspaces in which they are currently active
      List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityController.listActiveWorkspaceUserEntitiesByUserEntity(userSchoolDataIdentifier.getUserEntity());
      for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
        workspaceUserEntityController.updateActive(workspaceUserEntity, Boolean.FALSE);
      }
      // Update Elastic search index since active workspaces have changed
      userIndexer.indexUser(userSchoolDataIdentifier.getUserEntity());
    }
  }

  

}
