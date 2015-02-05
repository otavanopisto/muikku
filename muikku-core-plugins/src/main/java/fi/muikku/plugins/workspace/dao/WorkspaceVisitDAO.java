package fi.muikku.plugins.workspace.dao;

import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.workspace.model.WorkspaceVisit;
import fi.muikku.plugins.workspace.model.WorkspaceVisit_;

public class WorkspaceVisitDAO extends CorePluginsDAO<WorkspaceVisit> {
  private static final long serialVersionUID = 1L;

  public WorkspaceVisit create(UserEntity userEntity, WorkspaceEntity workspaceEntity, Date lastVisit) {
    WorkspaceVisit visit = new WorkspaceVisit();
    visit.setUserEntityId(userEntity.getId());
    visit.setWorkspaceEntityId(workspaceEntity.getId());
    visit.setNumVisits(0l);
    visit.setLastVisit(lastVisit);
    persist(visit);
    return visit;
  }
  
  public WorkspaceVisit findByUserEntityAndWorkspaceEntity(UserEntity userEntity, WorkspaceEntity workspaceEntity) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceVisit> criteria = criteriaBuilder.createQuery(WorkspaceVisit.class);
    Root<WorkspaceVisit> root = criteria.from(WorkspaceVisit.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.and(
          criteriaBuilder.equal(root.get(WorkspaceVisit_.userEntityId), userEntity.getId()),
          criteriaBuilder.equal(root.get(WorkspaceVisit_.workspaceEntityId), workspaceEntity.getId()))
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public void updateNumVisitsAndLastVisit(WorkspaceVisit workspaceVisit, Long numVisits, Date lastVisit) {
    workspaceVisit.setNumVisits(numVisits);
    workspaceVisit.setLastVisit(lastVisit);
    persist(workspaceVisit);
  }
}
