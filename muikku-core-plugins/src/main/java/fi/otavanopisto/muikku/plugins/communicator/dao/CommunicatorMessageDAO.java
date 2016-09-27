package fi.otavanopisto.muikku.plugins.communicator.dao;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

import fi.otavanopisto.muikku.model.base.Tag;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel_;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient_;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage_;


public class CommunicatorMessageDAO extends CorePluginsDAO<CommunicatorMessage> {
	
  private static final long serialVersionUID = -8721990589622544635L;

  public CommunicatorMessage create(CommunicatorMessageId communicatorMessageId, Long sender,
      CommunicatorMessageCategory category, String caption, String content, Date created, Set<Tag> tags) {
    CommunicatorMessage msg = new CommunicatorMessage();
    
    int s = tags != null ? tags.size() : 0;
    Set<Long> tagIds = new HashSet<Long>(s);
    
    if (tags != null) {
      for (Tag t : tags)
        tagIds.add(t.getId());
    }

    msg.setCommunicatorMessageId(communicatorMessageId);
    msg.setSender(sender);
    msg.setCategory(category);
    msg.setCaption(caption);
    msg.setContent(content);
    msg.setCreated(created);
    msg.setTags(tagIds);
    msg.setArchivedBySender(false);
    msg.setTrashedBySender(false);
    
    getEntityManager().persist(msg);
    
    return msg;
  }

  public List<CommunicatorMessage> listThreadsInTrash(UserEntity user, Integer firstResult, Integer maxResults) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);

    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> messageJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);
    Join<CommunicatorMessage, CommunicatorMessageId> threadJoin = messageJoin.join(CommunicatorMessage_.communicatorMessageId);
    
    // SubQuery finds the latest date in a thread when linked to the main query 
    // and thus allows finding the latest message in the thread.
    Subquery<Date> subQuery = criteria.subquery(Date.class);
    Root<CommunicatorMessageRecipient> subQueryRoot = subQuery.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> subMessageJoin = subQueryRoot.join(CommunicatorMessageRecipient_.communicatorMessage);

    subQuery.select(criteriaBuilder.greatest(subMessageJoin.get(CommunicatorMessage_.created)));
    
    subQuery.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(subMessageJoin.get(CommunicatorMessage_.communicatorMessageId), messageJoin.get(CommunicatorMessage_.communicatorMessageId)),
        
        criteriaBuilder.or(
          criteriaBuilder.and(
            criteriaBuilder.equal(subQueryRoot.get(CommunicatorMessageRecipient_.recipient), user.getId()),
            criteriaBuilder.equal(subQueryRoot.get(CommunicatorMessageRecipient_.trashedByReceiver), Boolean.TRUE),
            criteriaBuilder.equal(subQueryRoot.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
          ),
          criteriaBuilder.and(
            criteriaBuilder.equal(subMessageJoin.get(CommunicatorMessage_.sender), user.getId()),
            criteriaBuilder.equal(subMessageJoin.get(CommunicatorMessage_.trashedBySender), Boolean.TRUE),
            criteriaBuilder.equal(subMessageJoin.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE)
          )
        )
      )
    );
    
    criteria.select(messageJoin);

    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(messageJoin.get(CommunicatorMessage_.created), subQuery),
        
        criteriaBuilder.or(
          criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), user.getId()),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.trashedByReceiver), Boolean.TRUE),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
          ),
          criteriaBuilder.and(
            criteriaBuilder.equal(messageJoin.get(CommunicatorMessage_.sender), user.getId()),
            criteriaBuilder.equal(messageJoin.get(CommunicatorMessage_.trashedBySender), Boolean.TRUE),
            criteriaBuilder.equal(messageJoin.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE)
          )
        )
      )
    );
    
    criteria.groupBy(threadJoin);

    criteria.orderBy(criteriaBuilder.desc(
      messageJoin.get(CommunicatorMessage_.created)
    ));
    
    TypedQuery<CommunicatorMessage> query = entityManager.createQuery(criteria);
    
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    
    return query.getResultList();
  }
  
  public List<CommunicatorMessage> listThreadsInInbox(UserEntity recipient, CommunicatorLabel label, Integer firstResult, Integer maxResults) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> messageJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);
    Join<CommunicatorMessage, CommunicatorMessageId> threadJoin = messageJoin.join(CommunicatorMessage_.communicatorMessageId);
    
    criteria.select(messageJoin);

    // SubQuery finds the latest date in a thread when linked to the main query 
    // and thus allows finding the latest message in the thread.
    Subquery<Date> subQuery = criteria.subquery(Date.class);
    Root<CommunicatorMessageRecipient> subQueryRoot = subQuery.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> subMessageJoin = subQueryRoot.join(CommunicatorMessageRecipient_.communicatorMessage);
    Join<CommunicatorMessage, CommunicatorMessageId> subThreadJoin = subMessageJoin.join(CommunicatorMessage_.communicatorMessageId);

    subQuery.select(criteriaBuilder.greatest(subMessageJoin.get(CommunicatorMessage_.created)));
    
    if (label != null) {
      Root<CommunicatorMessageIdLabel> labelRoot = criteria.from(CommunicatorMessageIdLabel.class);
      Root<CommunicatorMessageIdLabel> subLabelRoot = criteria.from(CommunicatorMessageIdLabel.class);

      subQuery.where(
        criteriaBuilder.and(
          criteriaBuilder.equal(subMessageJoin.get(CommunicatorMessage_.communicatorMessageId), messageJoin.get(CommunicatorMessage_.communicatorMessageId)),
          criteriaBuilder.equal(subQueryRoot.get(CommunicatorMessageRecipient_.recipient), recipient.getId()),
          criteriaBuilder.equal(subQueryRoot.get(CommunicatorMessageRecipient_.trashedByReceiver), Boolean.FALSE),
          criteriaBuilder.equal(subQueryRoot.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE),
          subThreadJoin.in(subLabelRoot.get(CommunicatorMessageIdLabel_.communicatorMessageId)),
          criteriaBuilder.equal(subLabelRoot.get(CommunicatorMessageIdLabel_.label), label)
        )
      );
      
      criteria.where(
        criteriaBuilder.and(
          criteriaBuilder.equal(messageJoin.get(CommunicatorMessage_.created), subQuery),
          criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), recipient.getId()),
          criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.trashedByReceiver), Boolean.FALSE),
          criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE),
          threadJoin.in(labelRoot.get(CommunicatorMessageIdLabel_.communicatorMessageId)),
          criteriaBuilder.equal(labelRoot.get(CommunicatorMessageIdLabel_.label), label)
        )
      );
    } else {
      subQuery.where(
        criteriaBuilder.and(
          criteriaBuilder.equal(subMessageJoin.get(CommunicatorMessage_.communicatorMessageId), messageJoin.get(CommunicatorMessage_.communicatorMessageId)),
          criteriaBuilder.equal(subQueryRoot.get(CommunicatorMessageRecipient_.recipient), recipient.getId()),
          criteriaBuilder.equal(subQueryRoot.get(CommunicatorMessageRecipient_.trashedByReceiver), Boolean.FALSE),
          criteriaBuilder.equal(subQueryRoot.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
        )
      );
        
      criteria.where(
        criteriaBuilder.and(
          criteriaBuilder.equal(messageJoin.get(CommunicatorMessage_.created), subQuery),
          criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), recipient.getId()),
          criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.trashedByReceiver), Boolean.FALSE),
          criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
        )
      );
    }
    
    criteria.groupBy(threadJoin);
    
    criteria.orderBy(criteriaBuilder.desc(
      messageJoin.get(CommunicatorMessage_.created)
    ));
    
    TypedQuery<CommunicatorMessage> query = entityManager.createQuery(criteria);
    
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    
    return query.getResultList();
  }
  
  public List<CommunicatorMessage> listThreadsInSent(UserEntity sender, Integer firstResult, Integer maxResults) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessage> root = criteria.from(CommunicatorMessage.class);

    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessage_.sender), sender.getId()),
            criteriaBuilder.equal(root.get(CommunicatorMessage_.trashedBySender), Boolean.FALSE),
            criteriaBuilder.equal(root.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE)
        )
    );
    criteria.groupBy(root.get(CommunicatorMessage_.communicatorMessageId));
    
    criteria.orderBy(criteriaBuilder.desc(root.get(CommunicatorMessage_.created)));
    
    TypedQuery<CommunicatorMessage> query = entityManager.createQuery(criteria);
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    
    return query.getResultList();
  }

  public List<CommunicatorMessage> listMessagesInThread(UserEntity user, CommunicatorMessageId communicatorMessageId, boolean trashed, boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();

    CriteriaQuery<CommunicatorMessage> criteria;
    Root<CommunicatorMessage> CommunicatorMessage;
    criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    CommunicatorMessage = criteria.from(CommunicatorMessage.class);
    Root<CommunicatorMessageRecipient> recipient = criteria.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> recipientMessage = 
        criteriaBuilder.treat(recipient.join(CommunicatorMessageRecipient_.communicatorMessage), CommunicatorMessage.class);
    criteria.select(CommunicatorMessage);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(CommunicatorMessage.get(CommunicatorMessage_.id), recipientMessage.get(CommunicatorMessage_.id)),
            criteriaBuilder.equal(recipientMessage.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId),
            criteriaBuilder.equal(recipient.get(CommunicatorMessageRecipient_.recipient), user.getId()),
            criteriaBuilder.equal(recipient.get(CommunicatorMessageRecipient_.trashedByReceiver), trashed),
            criteriaBuilder.equal(recipient.get(CommunicatorMessageRecipient_.archivedByReceiver), archived)
        )
    );
    return entityManager.createQuery(criteria).getResultList();
  }
  
  /**
   * Returns the number of messages the user can see in a thread in either inbox/sent or in trash
   * depending on the value of trashed parameter.
   * 
   * @param user
   * @param communicatorMessageId
   * @param trashed
   * @return
   */
  public Long countMessagesByUserAndMessageId(UserEntity user, CommunicatorMessageId communicatorMessageId, boolean trashed) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> msgJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);

    criteria.select(criteriaBuilder.countDistinct(msgJoin));
    
    criteria.where(
        criteriaBuilder.or(
          criteriaBuilder.and(
              criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId),
              criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), user.getId()),
              criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.trashedByReceiver), trashed),
              criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
          ),
          criteriaBuilder.and(
              criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId),
              criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.sender), user.getId()),
              criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.trashedBySender), trashed),
              criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE)
          )
        )
    );
    
    return entityManager.createQuery(criteria).getSingleResult();
  }

  public List<CommunicatorMessage> listMessagesInSentThread(UserEntity sender, CommunicatorMessageId communicatorMessageId, boolean trashed, boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessage> root = criteria.from(CommunicatorMessage.class);

    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId),
            criteriaBuilder.equal(root.get(CommunicatorMessage_.sender), sender.getId()),
            criteriaBuilder.equal(root.get(CommunicatorMessage_.trashedBySender), trashed),
            criteriaBuilder.equal(root.get(CommunicatorMessage_.archivedBySender), archived)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public CommunicatorMessage updateTrashedBySender(CommunicatorMessage msg, boolean trashed) {
    msg.setTrashedBySender(trashed);
    
    getEntityManager().persist(msg);
    
    return msg;
  }

  public CommunicatorMessage updateArchivedBySender(CommunicatorMessage msg, boolean archived) {
    msg.setArchivedBySender(archived);
    
    getEntityManager().persist(msg);
    
    return msg;
  }

  @Override
  public void delete(CommunicatorMessage e) {
    super.delete(e);
  }
}