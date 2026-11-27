package fi.otavanopisto.muikku.plugins.workspace.dao;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalComment;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalCommentRecipient;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalCommentRecipient_;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalComment_;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalEntry;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalEntry_;

public class WorkspaceJournalCommentRecipientDAO extends CorePluginsDAO<WorkspaceJournalCommentRecipient> {
	
  private static final long serialVersionUID = 3183814604652130253L;

  public WorkspaceJournalCommentRecipient create(WorkspaceJournalComment comment, Long userEntityId, Date readDate) {
    WorkspaceJournalCommentRecipient commentRecipient = new WorkspaceJournalCommentRecipient();
    commentRecipient.setComment(comment);
    commentRecipient.setUserEntityId(userEntityId);
    commentRecipient.setReadDate(readDate);
    
    return persist(commentRecipient);
 }
  
  public List<WorkspaceJournalCommentRecipient> listByUser(Long userEntityId){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceJournalCommentRecipient> criteria = criteriaBuilder.createQuery(WorkspaceJournalCommentRecipient.class);
    Root<WorkspaceJournalCommentRecipient> root = criteria.from(WorkspaceJournalCommentRecipient.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(WorkspaceJournalCommentRecipient_.userEntityId), userEntityId));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<WorkspaceJournalCommentRecipient> listByComment(WorkspaceJournalComment comment){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceJournalCommentRecipient> criteria = criteriaBuilder.createQuery(WorkspaceJournalCommentRecipient.class);
    Root<WorkspaceJournalCommentRecipient> root = criteria.from(WorkspaceJournalCommentRecipient.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(WorkspaceJournalCommentRecipient_.comment), comment));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public void delete(WorkspaceJournalCommentRecipient commentRecipient){
    super.delete(commentRecipient);
  }
  
  public WorkspaceJournalCommentRecipient findByCommentAndUserEntityId(WorkspaceJournalComment comment, Long userEntityId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceJournalCommentRecipient> criteria = criteriaBuilder.createQuery(WorkspaceJournalCommentRecipient.class);
    Root<WorkspaceJournalCommentRecipient> root = criteria.from(WorkspaceJournalCommentRecipient.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceJournalCommentRecipient_.comment), comment),
        criteriaBuilder.equal(root.get(WorkspaceJournalCommentRecipient_.userEntityId), userEntityId)
      )
    );
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public long countUnreadByJournalEntryAndUserEntity(WorkspaceJournalEntry journalEntry, UserEntity userEntity) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    
    Root<WorkspaceJournalComment> commentRoot = criteria.from(WorkspaceJournalComment.class);
    
    // Find recipients for the current user and comment
    Subquery<Long> recipientSubquery = criteria.subquery(Long.class);
    
    Root<WorkspaceJournalCommentRecipient> recipientRoot = recipientSubquery.from(WorkspaceJournalCommentRecipient.class);
    
    recipientSubquery.select(recipientRoot.get(WorkspaceJournalCommentRecipient_.id));
    
    recipientSubquery.where(criteriaBuilder.and(
      criteriaBuilder.equal(recipientRoot.get(WorkspaceJournalCommentRecipient_.comment), commentRoot),
      criteriaBuilder.equal(recipientRoot.get(WorkspaceJournalCommentRecipient_.userEntityId), userEntity.getId())));
    
    // Count unread comments
    criteria.select(criteriaBuilder.count(commentRoot));
    
    criteria.where(
      criteriaBuilder.and(criteriaBuilder.equal(commentRoot.get(WorkspaceJournalComment_.journalEntry), journalEntry),
        criteriaBuilder.isFalse(commentRoot.get(WorkspaceJournalComment_.archived)),
        criteriaBuilder.or(criteriaBuilder.isNull(commentRoot.get(WorkspaceJournalComment_.creator)),
        criteriaBuilder.notEqual(commentRoot.get(WorkspaceJournalComment_.creator), userEntity.getId())),
        criteriaBuilder.not(criteriaBuilder.exists(recipientSubquery))));
    
    return entityManager.createQuery(criteria).getSingleResult();
  }
  
  public long countUnreadByStudentsAndUserEntity(WorkspaceEntity workspaceEntity, Collection<UserEntity> students, UserEntity user) {
    // No students means there cannot be any unread comments
    if (students == null || students.isEmpty()) {
      return 0L;
    }
    
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    
    Root<WorkspaceJournalComment> commentRoot = criteria.from(WorkspaceJournalComment.class);
    
    // Join comments with their journal entries
    Join<WorkspaceJournalComment, WorkspaceJournalEntry> journalEntryJoin = commentRoot.join(WorkspaceJournalComment_.journalEntry);
    
    // Find recipients for the current user and comment
    Subquery<Long> recipientSubquery = criteria.subquery(Long.class);
    
    Root<WorkspaceJournalCommentRecipient> recipientRoot = recipientSubquery.from(WorkspaceJournalCommentRecipient.class);
    
    recipientSubquery.select(recipientRoot.get(WorkspaceJournalCommentRecipient_.id));
    
    // Match the recipient to the current comment and only check the current user's read status
    recipientSubquery.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(recipientRoot.get(WorkspaceJournalCommentRecipient_.comment),commentRoot),
        criteriaBuilder.equal(recipientRoot.get(WorkspaceJournalCommentRecipient_.userEntityId),user.getId())
      )
    );
    // Count all matching comments
    criteria.select(criteriaBuilder.count(commentRoot));
    List<Long> studentIds = students.stream()
        .map(UserEntity::getId)
        .collect(Collectors.toList());
    
    criteria.where(
      criteriaBuilder.and(
        journalEntryJoin.get(WorkspaceJournalEntry_.userEntityId).in(studentIds),
        criteriaBuilder.isFalse(commentRoot.get(WorkspaceJournalComment_.archived)),
        criteriaBuilder.equal(journalEntryJoin.get(WorkspaceJournalEntry_.workspaceEntityId), workspaceEntity.getId()),
        criteriaBuilder.not(criteriaBuilder.exists(recipientSubquery)) // Only include comments without a recipient for the current user
      )
    );

    return entityManager.createQuery(criteria).getSingleResult();
  }
}
