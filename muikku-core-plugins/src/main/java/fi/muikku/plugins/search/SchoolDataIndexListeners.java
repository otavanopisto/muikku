package fi.muikku.plugins.search;

import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.enterprise.event.TransactionPhase;
import javax.inject.Inject;

import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserGroup;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.events.SchoolDataUserDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataUserEnvironmentRoleDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataUserEnvironmentRoleRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupUpdatedEvent;
import fi.muikku.schooldata.events.SchoolDataUserRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataUserUpdatedEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceUpdatedEvent;
import fi.muikku.search.SearchIndexer;
import fi.muikku.users.UserGroupController;

public class SchoolDataIndexListeners {
  
  @Inject
  private Logger logger;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private UserGroupController userGroupController;
  
  @Inject
  private SearchIndexer indexer;
  
  @Inject
  private UserIndexer userIndexer;
  
  @Inject
  private WorkspaceIndexer workspaceIndexer;

  public void onSchoolDataWorkspaceDiscoveredEvent(@Observes (during = TransactionPhase.BEFORE_COMPLETION) SchoolDataWorkspaceDiscoveredEvent event) {
    workspaceIndexer.indexWorkspace(event.getDataSource(), event.getIdentifier());
  }
  
  public void onSchoolDataWorkspaceUpdatedEvent(@Observes SchoolDataWorkspaceUpdatedEvent event) {
    workspaceIndexer.indexWorkspace(event.getDataSource(), event.getIdentifier());
  }
  
  public void onSchoolDataWorkspaceRemovedEvent(@Observes SchoolDataWorkspaceRemovedEvent event) {
    indexer.remove(Workspace.class.getSimpleName(), event.getSearchId());
  }
  
  public void onSchoolDataUserDiscoveredEvent(@Observes (during = TransactionPhase.BEFORE_COMPLETION) SchoolDataUserDiscoveredEvent event) {
    userIndexer.indexUser(event.getDataSource(), event.getIdentifier());
  }
  
  public void onSchoolDataUserUpdatedEvent(@Observes SchoolDataUserUpdatedEvent event) {
    userIndexer.indexUser(event.getDataSource(), event.getIdentifier());
  }
  
  public void onSchoolDataUserRemovedEvent(@Observes SchoolDataUserRemovedEvent event) {
    indexer.remove(User.class.getSimpleName(), event.getSearchId());
  }
  
  public void onSchoolDataUserEnvironmentRoleDiscoveredEvent(@Observes SchoolDataUserEnvironmentRoleDiscoveredEvent event) {
    userIndexer.indexUser(event.getUserDataSource(), event.getUserIdentifier());
  }
  
  public void onSchoolDataUserEnvironmentRoleRemovedEvent(@Observes SchoolDataUserEnvironmentRoleRemovedEvent event) {
    userIndexer.indexUser(event.getUserDataSource(), event.getUserIdentifier());
  }
  
  public void onSchoolDataUserGroupDiscoveredEvent(@Observes SchoolDataUserGroupDiscoveredEvent event) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      UserGroup userGroup = userGroupController.findUserGroup(event.getDataSource(), event.getIdentifier());
      if (userGroup != null) {
        indexer.index(UserGroup.class.getSimpleName(), userGroup);
      } else {
        logger.warning("could not index user group because user group '" + event.getIdentifier() + '/' + event.getDataSource() +  "' could not be found");
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }  

  public void onSchoolDataUserGroupRemovedEvent(@Observes SchoolDataUserGroupRemovedEvent event) {
    indexer.remove(UserGroup.class.getSimpleName(), event.getSearchId());
  }  

  public void onSchoolDataUserGroupUpdatedEvent(@Observes SchoolDataUserGroupUpdatedEvent event) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      UserGroup userGroup = userGroupController.findUserGroup(event.getDataSource(), event.getIdentifier());
      if (userGroup != null) {
        indexer.index(UserGroup.class.getSimpleName(), userGroup);
      } else {
        logger.warning("could not index user group because user group '" + event.getIdentifier() + '/' + event.getDataSource() +  "' could not be found");
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }  
  
}
