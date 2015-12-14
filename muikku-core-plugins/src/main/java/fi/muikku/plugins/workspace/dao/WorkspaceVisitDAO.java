package fi.muikku.plugins.workspace.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.LockModeType;
import javax.persistence.TypedQuery;
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
  
  public WorkspaceVisit lockingFindByUserEntityAndWorkspaceEntity(UserEntity userEntity, WorkspaceEntity workspaceEntity) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceVisit> criteria = criteriaBuilder.createQuery(WorkspaceVisit.class);
    Root<WorkspaceVisit> root = criteria.from(WorkspaceVisit.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.and(
          criteriaBuilder.equal(root.get(WorkspaceVisit_.userEntityId), userEntity.getId()),
          criteriaBuilder.equal(root.get(WorkspaceVisit_.workspaceEntityId), workspaceEntity.getId()))
    );

    TypedQuery<WorkspaceVisit> query = entityManager.createQuery(criteria);
    query.setLockMode(LockModeType.PESSIMISTIC_WRITE);
    return getSingleResult(query);
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
  
  public List<WorkspaceVisit> listByUserEntityAndMinVisitsOrderByLastVisit(UserEntity userEntity, Long numVisits, Integer firstResult, Integer maxResults) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceVisit> criteria = criteriaBuilder.createQuery(WorkspaceVisit.class);
    Root<WorkspaceVisit> root = criteria.from(WorkspaceVisit.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceVisit_.userEntityId), userEntity.getId()),
        criteriaBuilder.greaterThanOrEqualTo(root.get(WorkspaceVisit_.numVisits), numVisits)
      )
    );
    
    criteria.orderBy(criteriaBuilder.desc(root.get(WorkspaceVisit_.lastVisit)));
    
    TypedQuery<WorkspaceVisit> query = entityManager.createQuery(criteria);
    
    if (firstResult != null) {
      query.setFirstResult(firstResult);
    }
    
    if (maxResults != null) {
      query.setMaxResults(maxResults);
    }
    
    return query.getResultList();
  }
  
  public void updateNumVisitsAndLastVisit(WorkspaceVisit workspaceVisit, Long numVisits, Date lastVisit) {
    workspaceVisit.setNumVisits(numVisits);
    workspaceVisit.setLastVisit(lastVisit);
    persist(workspaceVisit);
  }
}
