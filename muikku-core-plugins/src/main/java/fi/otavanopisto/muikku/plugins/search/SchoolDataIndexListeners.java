package fi.otavanopisto.muikku.plugins.search;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.enterprise.event.Observes;
import javax.enterprise.event.TransactionPhase;
import javax.inject.Inject;

import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserEventIdentifier;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserGroupDiscoveredEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserGroupRemovedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserGroupUpdatedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserGroupUserDiscoveredEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserGroupUserRemovedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserGroupUserUpdatedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserUpdatedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceDiscoveredEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceRemovedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUpdatedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUserDiscoveredEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUserRemovedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUserUpdatedEvent;
import fi.otavanopisto.muikku.search.IndexedWorkspace;
import fi.otavanopisto.muikku.search.SearchIndexer;
import fi.otavanopisto.muikku.users.UserGroupController;

@Stateless
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
    indexer.remove(IndexedWorkspace.INDEX_NAME, IndexedWorkspace.TYPE_NAME, event.getSearchId());
  }
  
  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public void onSchoolDataWorkspaceUserDiscoveredEvent(@Observes (during = TransactionPhase.AFTER_SUCCESS) SchoolDataWorkspaceUserDiscoveredEvent event) {
    userIndexer.indexUser(event.getUserDataSource(), event.getUserIdentifier());
  }
  
  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public void onSchoolDataWorkspaceUserUpdatedEvent(@Observes (during = TransactionPhase.AFTER_SUCCESS) SchoolDataWorkspaceUserUpdatedEvent event) {
    userIndexer.indexUser(event.getUserDataSource(), event.getUserIdentifier());
  }
  
  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public void onSchoolDataWorkspaceUserRemovedEvent(@Observes (during = TransactionPhase.AFTER_SUCCESS) SchoolDataWorkspaceUserRemovedEvent event) {
    userIndexer.indexUser(event.getUserDataSource(), event.getUserIdentifier());
  }

  public void onSchoolDataUserUpdatedEvent(@Observes SchoolDataUserUpdatedEvent event) {
    List<SchoolDataUserEventIdentifier> removeIdentifiers = new ArrayList<>(event.getRemovedIdentifiers());
    List<SchoolDataUserEventIdentifier> updatedIdentifiers = new ArrayList<>(event.getDiscoveredIdentifiers());
    updatedIdentifiers.addAll(event.getUpdatedIdentifiers());
    
    for (SchoolDataUserEventIdentifier eventIdentifier : updatedIdentifiers) {
      SchoolDataIdentifier identifier = eventIdentifier.getIdentifier();
      userIndexer.indexUser(identifier.getDataSource(), identifier.getIdentifier());
    }
    
    for (SchoolDataUserEventIdentifier eventIdentifier : removeIdentifiers) {
      SchoolDataIdentifier identifier = eventIdentifier.getIdentifier();
      userIndexer.removeUser(identifier.getDataSource(), identifier.getIdentifier());
    }
  }
  
  public void onSchoolDataUserGroupDiscoveredEvent(@Observes SchoolDataUserGroupDiscoveredEvent event) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      UserGroup userGroup = userGroupController.findUserGroup(event.getDataSource(), event.getIdentifier());
      if (userGroup != null) {
        indexer.index(UserGroup.INDEX_NAME, UserGroup.TYPE_NAME, userGroup);
      } else {
        logger.warning("could not index user group because user group '" + event.getIdentifier() + '/' + event.getDataSource() +  "' could not be found");
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }  

  public void onSchoolDataUserGroupRemovedEvent(@Observes SchoolDataUserGroupRemovedEvent event) {
    indexer.remove(UserGroup.INDEX_NAME, UserGroup.TYPE_NAME, event.getSearchId());
  }  

  public void onSchoolDataUserGroupUpdatedEvent(@Observes SchoolDataUserGroupUpdatedEvent event) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      UserGroup userGroup = userGroupController.findUserGroup(event.getDataSource(), event.getIdentifier());
      if (userGroup != null) {
        indexer.index(UserGroup.INDEX_NAME, UserGroup.TYPE_NAME, userGroup);
      } else {
        logger.warning("could not index user group because user group '" + event.getIdentifier() + '/' + event.getDataSource() +  "' could not be found");
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }  

  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public void onSchoolDataUserGroupUserDiscoveredEvent(@Observes (during = TransactionPhase.AFTER_SUCCESS) SchoolDataUserGroupUserDiscoveredEvent event) {
    userIndexer.indexUser(event.getUserDataSource(), event.getUserIdentifier());
  }  

  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public void onSchoolDataUserGroupUserUpdatedEvent(@Observes (during = TransactionPhase.AFTER_SUCCESS) SchoolDataUserGroupUserUpdatedEvent event) {
    userIndexer.indexUser(event.getUserDataSource(), event.getUserIdentifier());
  }

  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public void onSchoolDataUserGroupUserRemovedEvent(@Observes (during = TransactionPhase.AFTER_SUCCESS) SchoolDataUserGroupUserRemovedEvent event) {
    userIndexer.indexUser(event.getUserDataSource(), event.getUserIdentifier());
  }  

}
