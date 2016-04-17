package fi.otavanopisto.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceVisitDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceVisit;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.session.local.LocalSession;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class WorkspaceVisitController {
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
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
      synchronized(userEntity) {
        WorkspaceVisit workspaceVisit = workspaceVisitDAO.lockingFindByUserEntityAndWorkspaceEntity(userEntity, workspaceEntity);
        if (workspaceVisit == null) {
          workspaceVisit = workspaceVisitDAO.create(userEntity, workspaceEntity, new Date());
        }
        workspaceVisitDAO.updateNumVisitsAndLastVisit(workspaceVisit, workspaceVisit.getNumVisits() + 1, new Date());
      }
    }
  }
  
  public long getNumVisits(WorkspaceEntity workspaceEntity) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    if (userEntity == null) {
      return 0l;
    } else {
      return getNumVisits(workspaceEntity, userEntity);
    }
  }

  public long getNumVisits(WorkspaceEntity workspaceEntity, UserEntity userEntity) {
    WorkspaceVisit workspaceVisit = workspaceVisitDAO.findByUserEntityAndWorkspaceEntity(userEntity, workspaceEntity);
    if (workspaceVisit == null) {
      return 0l;
    }
    
    return workspaceVisit.getNumVisits();
  }
  
  public List<WorkspaceEntity> listWorkspaceEntitiesByMinVisitsOrderByLastVisit(UserEntity userEntity, Long numVisits) {
    List<WorkspaceVisit> workspaceVisits = workspaceVisitDAO.listByUserEntityAndMinVisitsOrderByLastVisit(userEntity, numVisits, null, null);
    
    List<WorkspaceEntity> result = new ArrayList<>(workspaceVisits.size());
    for (WorkspaceVisit workspaceVisit : workspaceVisits) {
      result.add(workspaceEntityController.findWorkspaceEntityById(workspaceVisit.getWorkspaceEntityId()));
    }

    return result;
  }  
  
  public List<WorkspaceEntity> listEnrolledWorkspaceEntitiesByMinVisitsOrderByLastVisit(UserEntity userEntity, Long numVisits) {
    List<WorkspaceVisit> workspaceVisits = workspaceVisitDAO.listByUserEntityAndMinVisitsOrderByLastVisit(userEntity, numVisits, null, null);
    
    List<WorkspaceEntity> result = new ArrayList<>(workspaceVisits.size());
    for (WorkspaceVisit workspaceVisit : workspaceVisits) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceVisit.getWorkspaceEntityId());
      List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityController.listWorkspaceUserEntities(workspaceEntity);
      for (WorkspaceUserEntity wue : workspaceUserEntities) {
        UserSchoolDataIdentifier userSchoolDataIdentifier = wue.getUserSchoolDataIdentifier();
        if (userSchoolDataIdentifier.getUserEntity().getId().equals(userEntity.getId())) {
          result.add(workspaceEntity);
          break;
        }
      }
    }

    return result;
  }  
  
  public Date getLastVisit(WorkspaceEntity workspaceEntity) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    if (userEntity == null) {
      return null;
    } else {
      return getLastVisit(workspaceEntity, userEntity);
    }
  }

  public Date getLastVisit(WorkspaceEntity workspaceEntity, UserEntity userEntity) {
    WorkspaceVisit workspaceVisit = workspaceVisitDAO.findByUserEntityAndWorkspaceEntity(userEntity, workspaceEntity);
    if (workspaceVisit == null) {
      return null;
    }
    
    return workspaceVisit.getLastVisit();
  }
}
