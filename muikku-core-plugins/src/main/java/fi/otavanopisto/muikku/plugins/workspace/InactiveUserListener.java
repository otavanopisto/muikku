package fi.otavanopisto.muikku.plugins.workspace;

import java.util.List;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.forum.ForumAreaSubsciptionController;
import fi.otavanopisto.muikku.plugins.forum.ForumThreadSubsciptionController;
import fi.otavanopisto.muikku.plugins.search.UserIndexer;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserInactiveEvent;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class InactiveUserListener {

  @Inject
  private UserIndexer userIndexer;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private ForumAreaSubsciptionController forumAreaSubsciptionController;
  
  @Inject
  private ForumThreadSubsciptionController forumThreadSubsciptionController;
  
  public void onSchoolDataUserInactiveEvent(@Observes SchoolDataUserInactiveEvent event) {
    SchoolDataIdentifier schoolDataIdentifier = new SchoolDataIdentifier(event.getIdentifier(), event.getDataSource());
    // Remove an inactive user from all workspaces in which they are currently active
    List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityController.listActiveWorkspaceUserEntitiesByUserIdentifier(schoolDataIdentifier);
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      workspaceUserEntityController.updateActive(workspaceUserEntity, Boolean.FALSE);
    }
    // Update Elastic search index since active workspaces have changed
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(schoolDataIdentifier);
    if (userSchoolDataIdentifier != null) {
      userIndexer.indexUser(userSchoolDataIdentifier.getUserEntity());
    }
    // #6967: Remove user's all forum subscriptions
    UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    forumAreaSubsciptionController.removeAreaSubscriptions(userEntity);
    forumThreadSubsciptionController.removeThreadSubscriptions(userEntity);
  }

}
