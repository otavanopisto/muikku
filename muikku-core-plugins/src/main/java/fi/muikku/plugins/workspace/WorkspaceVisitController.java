package fi.muikku.plugins.workspace;

import java.util.Date;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.workspace.dao.WorkspaceVisitDAO;
import fi.muikku.plugins.workspace.model.WorkspaceVisit;
import fi.muikku.session.SessionController;
import fi.muikku.session.local.LocalSession;

public class WorkspaceVisitController {
  @Inject
  private WorkspaceVisitDAO workspaceVisitDAO;
  
  @Inject
  @LocalSession
  private SessionController sessionController;
  
  public void visit(WorkspaceEntity workspaceEntity) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    if (userEntity == null) {
      return;
    } else {
      WorkspaceVisit workspaceVisit = workspaceVisitDAO.findByUserEntityAndWorkspaceEntity(userEntity, workspaceEntity);
      if (workspaceVisit == null) {
        workspaceVisit = workspaceVisitDAO.create(userEntity, workspaceEntity, new Date());
      }
      
      workspaceVisitDAO.updateNumVisitsAndLastVisit(workspaceVisit, workspaceVisit.getNumVisits() + 1, new Date());
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
  
  public Date getLastVisit(WorkspaceEntity workspaceEntity) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    if (userEntity == null) {
      return null;
    } else {
      WorkspaceVisit workspaceVisit = workspaceVisitDAO.findByUserEntityAndWorkspaceEntity(userEntity, workspaceEntity);
      if (workspaceVisit == null) {
        return null;
      }
      
      return workspaceVisit.getLastVisit();
    }
  }
}
