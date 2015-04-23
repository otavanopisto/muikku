package fi.muikku.plugins.search;

import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.enterprise.event.TransactionPhase;
import javax.inject.Inject;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.events.SchoolDataUserDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataUserRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataUserUpdatedEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceUpdatedEvent;
import fi.muikku.search.SearchIndexer;
import fi.muikku.users.UserController;

public class SchoolDataIndexListeners {
  
  @Inject
  private Logger logger;

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private UserController userController;

  @Inject
  private SearchIndexer indexer;

  public void onSchoolDataWorkspaceDiscoveredEvent(@Observes (during = TransactionPhase.BEFORE_COMPLETION) SchoolDataWorkspaceDiscoveredEvent event) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
      if (workspaceEntity != null) {
        Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
        if (workspace != null) {
          try {
            indexer.index(Workspace.class.getSimpleName(), workspace);
          } catch (Exception e) {
            logger.warning("could not index workspace #" + event.getIdentifier() + '/' + event.getDataSource());
          }
        }
      } else {
        logger.warning("could not index workspace because workspace entity #" + event.getIdentifier() + '/' + event.getDataSource() +  " could not be found");
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  public void onSchoolDataWorkspaceUpdatedEvent(@Observes SchoolDataWorkspaceUpdatedEvent event) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (workspaceEntity != null) {
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      if (workspace != null) {
        try {
          indexer.index(Workspace.class.getSimpleName(), workspace);
        } catch (Exception e) {
          logger.warning("could not index workspace #" + event.getIdentifier() + '/' + event.getDataSource());
        }
      }
    } else {
      logger.warning("could not index workspace because workspace entity #" + event.getIdentifier() + '/' + event.getDataSource() +  " could not be found");
    }
  }
  
  public void onSchoolDataWorkspaceRemovedEvent(@Observes SchoolDataWorkspaceRemovedEvent event) {
    indexer.remove(Workspace.class.getSimpleName(), event.getSearchId());
  }
  
  public void onSchoolDataUserDiscoveredEvent(@Observes (during = TransactionPhase.BEFORE_COMPLETION) SchoolDataUserDiscoveredEvent event) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      User user = userController.findUserByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
      if (user != null) {
        indexer.index(User.class.getSimpleName(), user);
      } else {
        logger.warning("could not index user because user '" + event.getIdentifier() + '/' + event.getDataSource() +  "' could not be found");
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  public void onSchoolDataUserUpdatedEvent(@Observes SchoolDataUserUpdatedEvent event) {
    User user = userController.findUserByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (user != null) {
      indexer.index(User.class.getSimpleName(), user);
    } else {
      logger.warning("could not index user because user '" + event.getIdentifier() + '/' + event.getDataSource() +  "' could not be found");
    }
  }
  
  public void onSchoolDataUserRemovedEvent(@Observes SchoolDataUserRemovedEvent event) {
    indexer.remove(User.class.getSimpleName(), event.getSearchId());
  }
}
