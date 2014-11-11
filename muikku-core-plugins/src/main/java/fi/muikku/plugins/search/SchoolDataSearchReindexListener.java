package fi.muikku.plugins.search;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.search.SearchIndexer;
import fi.muikku.search.SearchReindexEvent;
import fi.muikku.users.UserController;

@Stateless
public class SchoolDataSearchReindexListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private UserController userController;

  @Inject
  private SearchIndexer indexer;

  public void onReindexEvent(@Observes SearchReindexEvent event) {
    List<WorkspaceEntity> workspaceEntities = workspaceEntityController.listWorkspaceEntities();
    for (WorkspaceEntity workspaceEntity : workspaceEntities) {
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      if (workspace != null) {
        try {
          indexer.index(Workspace.class.getSimpleName(), workspace);
        } catch (Exception e) {
          logger.log(Level.WARNING, "could not index WorkspaceEntity #" + workspaceEntity.getId(), e);
        }
      }
    }
    
    for (User user : userController.listUsers()) {
      try {
        indexer.index(User.class.getSimpleName(), user);
      } catch (Exception e) {
        logger.log(Level.WARNING, "could not index User #" + user.getSchoolDataSource() + '/' + user.getIdentifier(), e);
      }
    }
    
  }
  
}
