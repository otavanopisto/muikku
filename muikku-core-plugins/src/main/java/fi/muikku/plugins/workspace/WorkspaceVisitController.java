package fi.muikku.plugins.workspace;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.workspace.dao.WorkspaceVisitDAO;
import fi.muikku.plugins.workspace.model.WorkspaceVisit;
import fi.muikku.session.SessionController;
import fi.muikku.session.local.LocalSession;
import fi.muikku.users.UserController;

public class WorkspaceVisitController {
  @Inject
  private WorkspaceVisitDAO workspaceVisitDAO;
  
  @Inject
  private UserController userController;
  
  @Inject
  @LocalSession
  private SessionController sessionController;
  
  public void incrementVisits(WorkspaceEntity workspaceEntity) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    if (userEntity == null) {
      return;
    } else {
      WorkspaceVisit workspaceVisit = workspaceVisitDAO.findByUserEntityAndWorkspaceEntity(userEntity, workspaceEntity);
      if (workspaceVisit == null) {
        workspaceVisit = workspaceVisitDAO.create(userEntity, workspaceEntity);
      }
      
      workspaceVisitDAO.updateNumVisits(workspaceVisit, workspaceVisit.getNumVisits() + 1);
    }
  }
  
  public long getNumVisits(WorkspaceEntity workspaceEntity) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    if (userEntity == null) {
      return 0l;
    } else {
      WorkspaceVisit workspaceVisit = workspaceVisitDAO.findByUserEntityAndWorkspaceEntity(userEntity, workspaceEntity);
      if (workspaceVisit == null) {
        return 0l;
      }
      
      return workspaceVisit.getNumVisits();
    }
  }
}
