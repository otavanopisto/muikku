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

import fi.otavanopisto.muikku.model.base.Tag;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel_;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId_;
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
    
    getEntityManager().persist(msg);
    
    return msg;
  }
  
  public List<CommunicatorMessage> listFirstMessagesByRecipient(UserEntity recipient, Integer firstResult, Integer maxResults) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> messageJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);
    Join<CommunicatorMessage, CommunicatorMessageId> threadJoin = messageJoin.join(CommunicatorMessage_.communicatorMessageId);
    
    criteria.select(messageJoin);

    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), recipient.getId()),
        criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
      )
    );
    
    criteria.groupBy(threadJoin);
    criteria.orderBy(criteriaBuilder.desc(
      threadJoin.get(CommunicatorMessageId_.lastMessage)
    ));
    
    TypedQuery<CommunicatorMessage> query = entityManager.createQuery(criteria);
    
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    
    return query.getResultList();
  }
  
  public List<CommunicatorMessage> listFirstMessagesByRecipient(UserEntity recipient, CommunicatorLabel label, Integer firstResult, Integer maxResults) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> messageJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);
    Join<CommunicatorMessage, CommunicatorMessageId> threadJoin = messageJoin.join(CommunicatorMessage_.communicatorMessageId);
    
    Root<CommunicatorMessageIdLabel> labelRoot = criteria.from(CommunicatorMessageIdLabel.class);
    
    criteria.select(messageJoin);

    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), recipient.getId()),
        criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE),
        threadJoin.in(labelRoot.get(CommunicatorMessageIdLabel_.communicatorMessageId)),
        criteriaBuilder.equal(labelRoot.get(CommunicatorMessageIdLabel_.label), label)
      )
    );
    
    criteria.groupBy(threadJoin);
    criteria.orderBy(criteriaBuilder.desc(
      threadJoin.get(CommunicatorMessageId_.lastMessage)
    ));
    
    TypedQuery<CommunicatorMessage> query = entityManager.createQuery(criteria);
    
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    
    return query.getResultList();
  }
  
  public List<CommunicatorMessage> listFirstMessagesBySender(UserEntity sender, Integer firstResult, Integer maxResults) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessage> root = criteria.from(CommunicatorMessage.class);

    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessage_.sender), sender.getId()),
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

  public List<CommunicatorMessage> listMessagesByRecipientAndMessageId(UserEntity recipient, CommunicatorMessageId communicatorMessageId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);

    Root<CommunicatorMessage> root2 = criteria.from(CommunicatorMessage.class);
    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> msgJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);

    criteria.select(root2);
    criteria.where(
        criteriaBuilder.and(
            root2.in(msgJoin),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), recipient.getId()),
            criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<CommunicatorMessage> listByRecipientAndMessageId(UserEntity user, CommunicatorMessageId communicatorMessageId) {
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
                criteriaBuilder.equal(recipient.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)));
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<CommunicatorMessage> listFirstBySender(UserEntity sender) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessage> root = criteria.from(CommunicatorMessage.class);

    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessage_.sender), sender.getId()),
            criteriaBuilder.equal(root.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE)
        )
    );
    criteria.groupBy(root.get(CommunicatorMessage_.communicatorMessageId));
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public Long countMessagesByRecipientAndMessageId(UserEntity recipient, CommunicatorMessageId communicatorMessageId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> msgJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);

    criteria.select(criteriaBuilder.count(root));
    
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), recipient.getId()),
            criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId)
        )
    );
    
    return entityManager.createQuery(criteria).getSingleResult();
  }

  public List<CommunicatorMessage> listBySenderAndMessageId(UserEntity sender, CommunicatorMessageId communicatorMessageId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessage> root = criteria.from(CommunicatorMessage.class);

    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId),
            criteriaBuilder.equal(root.get(CommunicatorMessage_.sender), sender.getId()),
            criteriaBuilder.equal(root.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public CommunicatorMessage archiveSent(CommunicatorMessage msg) {
    msg.setArchivedBySender(true);
    
    getEntityManager().persist(msg);
    
    return msg;
  }

  @Override
  public void delete(CommunicatorMessage e) {
    super.delete(e);
  }
}