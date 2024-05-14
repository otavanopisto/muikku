package fi.otavanopisto.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.activitylog.ActivityLogController;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLogType;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceVisitDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceVisit;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.session.local.LocalSession;

public class WorkspaceVisitController {
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private WorkspaceVisitDAO workspaceVisitDAO;
  
  @Inject
  private ActivityLogController activityLogController;
  
  @Inject
  @LocalSession
  private SessionController sessionController;
  
  public void visit(WorkspaceEntity workspaceEntity) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    if (userEntity == null) {
      return;
    } else {
      synchronized(userEntity) {
        activityLogController.createActivityLog(userEntity.getId(), ActivityLogType.WORKSPACE_VISIT, workspaceEntity.getId(), null);
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
    
    List<WorkspaceEntity> workspaceEntities = workspaceEntityController.listActiveWorkspaceEntitiesByUserIdentifier(userEntity.defaultSchoolDataIdentifier());
    Map<Long, WorkspaceEntity> workspaceEntityMap = new HashMap<>();
    for (WorkspaceEntity workspaceEntity : workspaceEntities) {
      workspaceEntityMap.put(workspaceEntity.getId(), workspaceEntity);
    }
    List<WorkspaceVisit> workspaceVisits = workspaceVisitDAO.listByWorkspaceEntityIdsAndUserEntityAndMinVisitsOrderByLastVisit(
        workspaceEntityMap.keySet(),
        userEntity,
        numVisits,
        null,
        null); 
   
    List<WorkspaceEntity> result = new ArrayList<>(workspaceVisits.size());
    for (WorkspaceVisit workspaceVisit : workspaceVisits) {
      result.add(workspaceEntityMap.get(workspaceVisit.getWorkspaceEntityId()));
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
