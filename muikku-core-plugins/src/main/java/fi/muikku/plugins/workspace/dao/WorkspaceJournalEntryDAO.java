package fi.muikku.plugins.workspace.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.workspace.model.WorkspaceJournalEntry;
import fi.muikku.plugins.workspace.model.WorkspaceJournalEntry_;

public class WorkspaceJournalEntryDAO extends CorePluginsDAO<WorkspaceJournalEntry> {

  private static final long serialVersionUID = 63917373561361361L;

  public WorkspaceJournalEntry create(WorkspaceEntity workspaceEntity, UserEntity userEntity, String html, String title, Date created, Boolean archived) {
    WorkspaceJournalEntry journalEntry = new WorkspaceJournalEntry();
    journalEntry.setUserEntityId(userEntity.getId());
    journalEntry.setWorkspaceEntityId(workspaceEntity.getId());
    journalEntry.setHtml(html);
    journalEntry.setTitle(title);
    journalEntry.setCreated(created);
    journalEntry.setArchived(archived);
    return persist(journalEntry);
  }

  public List<WorkspaceJournalEntry> listByWorkspaceEntityId(Long workspaceEntityId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceJournalEntry> criteria = criteriaBuilder.createQuery(WorkspaceJournalEntry.class);
    Root<WorkspaceJournalEntry> root = criteria.from(WorkspaceJournalEntry.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.workspaceEntityId), workspaceEntityId),
        criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.archived), Boolean.FALSE)
      )
    );
      
    criteria.orderBy(criteriaBuilder.desc(root.get(WorkspaceJournalEntry_.created)));

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<WorkspaceJournalEntry> listByWorkspaceEntityIdAndUserEntityId(Long workspaceEntityId, Long userEntityId){
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

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public WorkspaceJournalEntry findLatestByWorkspaceEntityIdAndUserEntityId(Long workspaceEntityId, Long userEntityId){
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
  
  public long countByWorkspaceEntityIdAndUserEntityId(Long workspaceEntityId, Long userEntityId){
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
  
  public WorkspaceJournalEntry updateTitle(WorkspaceJournalEntry workspaceJournalEntry, String title){
    workspaceJournalEntry.setTitle(title);
    return persist(workspaceJournalEntry);
  }
  
  public WorkspaceJournalEntry updateHtml(WorkspaceJournalEntry workspaceJournalEntry, String html){
    workspaceJournalEntry.setHtml(html);
    return persist(workspaceJournalEntry);
  }

  public WorkspaceJournalEntry updateArchived(WorkspaceJournalEntry workspaceJournalEntry, Boolean archived) {
    workspaceJournalEntry.setArchived(archived);
    return persist(workspaceJournalEntry);
  }

}
