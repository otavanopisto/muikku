package fi.otavanopisto.muikku.plugins.workspace.dao;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalEntry;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalEntry_;

public class WorkspaceJournalEntryDAO extends CorePluginsDAO<WorkspaceJournalEntry> {

  private static final long serialVersionUID = 63917373561361361L;

  public WorkspaceJournalEntry create(WorkspaceEntity workspaceEntity, UserEntity userEntity, String html, String title, Date created, String materialFieldReplyIdentifier, Boolean archived) {
    WorkspaceJournalEntry journalEntry = new WorkspaceJournalEntry();
    journalEntry.setUserEntityId(userEntity.getId());
    journalEntry.setWorkspaceEntityId(workspaceEntity.getId());
    journalEntry.setHtml(html);
    journalEntry.setTitle(title);
    journalEntry.setCreated(created);
    journalEntry.setArchived(archived);
    journalEntry.setMaterialFieldReplyIdentifier(materialFieldReplyIdentifier);
    return persist(journalEntry);
  }

  public List<WorkspaceJournalEntry> listByWorkspaceEntityId(WorkspaceEntity workspaceEntity, int firstResult, int maxResults) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceJournalEntry> criteria = criteriaBuilder.createQuery(WorkspaceJournalEntry.class);
    Root<WorkspaceJournalEntry> root = criteria.from(WorkspaceJournalEntry.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.workspaceEntityId), workspaceEntity.getId()),
        criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.archived), Boolean.FALSE)
      )
    );
      
    criteria.orderBy(criteriaBuilder.desc(root.get(WorkspaceJournalEntry_.created)));

    TypedQuery<WorkspaceJournalEntry> query = entityManager.createQuery(criteria);
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    
    return query.getResultList();
  }

  public List<WorkspaceJournalEntry> listByWorkspaceEntityIdAndUserEntityId(WorkspaceEntity workspaceEntity, UserEntity userEntity, 
      int firstResult, int maxResults) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceJournalEntry> criteria = criteriaBuilder.createQuery(WorkspaceJournalEntry.class);
    Root<WorkspaceJournalEntry> root = criteria.from(WorkspaceJournalEntry.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.workspaceEntityId), workspaceEntity.getId()),
            criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.userEntityId), userEntity.getId()),
            criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.archived), Boolean.FALSE)
        )
    );
    criteria.orderBy(criteriaBuilder.desc(root.get(WorkspaceJournalEntry_.created)));

    TypedQuery<WorkspaceJournalEntry> query = entityManager.createQuery(criteria);
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    
    return query.getResultList();
  }

  public List<WorkspaceJournalEntry> listByWorkspaceEntityAndUserEntities(WorkspaceEntity workspaceEntity,
      Collection<UserEntity> userEntities, int firstResult, int maxResults) {
    EntityManager entityManager = getEntityManager();

    Set<Long> userEntityIds = userEntities.stream().map(userEntity -> userEntity.getId()).collect(Collectors.toSet());
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceJournalEntry> criteria = criteriaBuilder.createQuery(WorkspaceJournalEntry.class);
    Root<WorkspaceJournalEntry> root = criteria.from(WorkspaceJournalEntry.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.workspaceEntityId), workspaceEntity.getId()),
            root.get(WorkspaceJournalEntry_.userEntityId).in(userEntityIds),
            criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.archived), Boolean.FALSE)
        )
    );
    criteria.orderBy(criteriaBuilder.desc(root.get(WorkspaceJournalEntry_.created)));

    TypedQuery<WorkspaceJournalEntry> query = entityManager.createQuery(criteria);
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    
    return query.getResultList();
  }
  
  public WorkspaceJournalEntry findLatestByWorkspaceEntityIdAndUserEntityId(Long workspaceEntityId, Long userEntityId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceJournalEntry> criteria = criteriaBuilder.createQuery(WorkspaceJournalEntry.class);
    Root<WorkspaceJournalEntry> root = criteria.from(WorkspaceJournalEntry.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.workspaceEntityId), workspaceEntityId),
            criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.userEntityId), userEntityId),
            criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.archived), Boolean.FALSE)
        )
    );
    criteria.orderBy(criteriaBuilder.desc(root.get(WorkspaceJournalEntry_.created)));
    TypedQuery<WorkspaceJournalEntry> query = entityManager.createQuery(criteria);
    
    query.setMaxResults(1);
    
    return getSingleResult(query);
  }
  
  public WorkspaceJournalEntry findByMaterialFieldReplyIdentifier(String identifier) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceJournalEntry> criteria = criteriaBuilder.createQuery(WorkspaceJournalEntry.class);
    Root<WorkspaceJournalEntry> root = criteria.from(WorkspaceJournalEntry.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.materialFieldReplyIdentifier), identifier),
            criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.archived), Boolean.FALSE)
        )
    );
    criteria.orderBy(criteriaBuilder.desc(root.get(WorkspaceJournalEntry_.created)));
    TypedQuery<WorkspaceJournalEntry> query = entityManager.createQuery(criteria);
    
    query.setMaxResults(1);
    
    return getSingleResult(query);
  }
  
  public long countByWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<WorkspaceJournalEntry> root = criteria.from(WorkspaceJournalEntry.class);
    criteria.select(criteriaBuilder.count(root));
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.workspaceEntityId), workspaceEntity.getId()),
            criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.archived), Boolean.FALSE)
        )
    );

    return entityManager.createQuery(criteria).getSingleResult();
  }
  
  public long countByWorkspaceEntityIdAndUserEntityId(Long workspaceEntityId, Long userEntityId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<WorkspaceJournalEntry> root = criteria.from(WorkspaceJournalEntry.class);
    criteria.select(criteriaBuilder.count(root));
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.workspaceEntityId), workspaceEntityId),
            criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.userEntityId), userEntityId),
            criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.archived), Boolean.FALSE)
        )
    );

    return entityManager.createQuery(criteria).getSingleResult();
  }
  
  public WorkspaceJournalEntry updateTitle(WorkspaceJournalEntry workspaceJournalEntry, String title) {
    workspaceJournalEntry.setTitle(title);
    return persist(workspaceJournalEntry);
  }

  public WorkspaceJournalEntry update(WorkspaceJournalEntry workspaceJournalEntry, String title, String html) {
    workspaceJournalEntry.setTitle(title);
    workspaceJournalEntry.setHtml(html);
    return persist(workspaceJournalEntry);
  }

  public WorkspaceJournalEntry updateArchived(WorkspaceJournalEntry workspaceJournalEntry, Boolean archived) {
    workspaceJournalEntry.setArchived(archived);
    return persist(workspaceJournalEntry);
  }

  public void delete(WorkspaceJournalEntry workspaceJournalEntry) {
    super.delete(workspaceJournalEntry);
  }
}
