package fi.otavanopisto.muikku.plugins.activitylog.dao;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLog;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLogType;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLog_;

public class ActivityLogDAO extends CorePluginsDAO<ActivityLog>{
  
  private static final long serialVersionUID = 7895651610938408594L;
  
  public ActivityLog create(Long userEntityId, ActivityLogType type, Long workspaceEntityId, Long contextId) {
    ActivityLog activityLog = new ActivityLog();
    activityLog.setUserEntityId(userEntityId);
    activityLog.setActivityLogType(type);
    activityLog.setTimestamp(new Date());
    activityLog.setWorkspaceEntityId(workspaceEntityId);
    activityLog.setContextId(contextId);
    return persist(activityLog);
  }
  
  public List<ActivityLog> listActivityLogs(Long userEntityId, Long workspaceEntityId, Date from, Date to) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ActivityLog> criteria = criteriaBuilder.createQuery(ActivityLog.class);
    Root<ActivityLog> root = criteria.from(ActivityLog.class);
    criteria.select(root);
    List<Predicate> predicates = new ArrayList<Predicate>();
    predicates.add(criteriaBuilder.equal(root.get(ActivityLog_.userEntityId), userEntityId));
    predicates.add(criteriaBuilder.greaterThan(root.get(ActivityLog_.timestamp), from));
    predicates.add(criteriaBuilder.lessThan(root.get(ActivityLog_.timestamp), to));
    if(workspaceEntityId == null)
      predicates.add(criteriaBuilder.isNull(root.get(ActivityLog_.workspaceEntityId)));
    else
      predicates.add(criteriaBuilder.equal(root.get(ActivityLog_.workspaceEntityId), workspaceEntityId));
    criteria.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));
    criteria.orderBy(criteriaBuilder.asc(root.get(ActivityLog_.timestamp)));
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<Long> listWorkspaces(Long userEntityId) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<ActivityLog> root = criteria.from(ActivityLog.class);
    criteria.select(root.get(ActivityLog_.workspaceEntityId));
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(ActivityLog_.userEntityId), userEntityId),
        criteriaBuilder.isNotNull(root.get(ActivityLog_.workspaceEntityId))
    ));
    criteria.groupBy(root.get(ActivityLog_.workspaceEntityId));
    return entityManager.createQuery(criteria).getResultList();
  }
}
