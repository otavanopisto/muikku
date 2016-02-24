package fi.muikku.plugins.communicator.dao;

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

import fi.muikku.model.base.Tag;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.muikku.plugins.communicator.model.CommunicatorMessageRecipient_;
import fi.muikku.plugins.communicator.model.CommunicatorMessage_;
import fi.muikku.plugins.communicator.model.InboxCommunicatorMessage;
import fi.muikku.plugins.communicator.model.InboxCommunicatorMessage_;


public class InboxCommunicatorMessageDAO extends CorePluginsDAO<InboxCommunicatorMessage> {
	
  private static final long serialVersionUID = -8721990589622544635L;

  public InboxCommunicatorMessage create(CommunicatorMessageId communicatorMessageId, Long sender,
      CommunicatorMessageCategory category, String caption, String content, Date created, Set<Tag> tags) {
    InboxCommunicatorMessage msg = new InboxCommunicatorMessage();
    
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
 
  public List<InboxCommunicatorMessage> listFirstMessagesByRecipient(UserEntity recipient) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<InboxCommunicatorMessage> criteria = criteriaBuilder.createQuery(InboxCommunicatorMessage.class);
    
    Root<InboxCommunicatorMessage> root2 = criteria.from(InboxCommunicatorMessage.class);
    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> msgJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);
    
    criteria.select(root2);
    criteria.where(
        criteriaBuilder.and(
            root2.in(msgJoin),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), recipient.getId()),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
        )
    );
    criteria.groupBy(msgJoin.get(CommunicatorMessage_.communicatorMessageId));
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<InboxCommunicatorMessage> listFirstMessagesBySender(UserEntity sender, Integer firstResult, Integer maxResults) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<InboxCommunicatorMessage> criteria = criteriaBuilder.createQuery(InboxCommunicatorMessage.class);
    Root<InboxCommunicatorMessage> root = criteria.from(InboxCommunicatorMessage.class);

    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessage_.sender), sender.getId()),
            criteriaBuilder.equal(root.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE)
        )
    );
    criteria.groupBy(root.get(CommunicatorMessage_.communicatorMessageId));
    
    criteria.orderBy(criteriaBuilder.desc(root.get(CommunicatorMessage_.created)));
    
    TypedQuery<InboxCommunicatorMessage> query = entityManager.createQuery(criteria);
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    
    return query.getResultList();
  }

  public List<InboxCommunicatorMessage> listMessagesByRecipientAndMessageId(UserEntity recipient, CommunicatorMessageId communicatorMessageId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<InboxCommunicatorMessage> criteria = criteriaBuilder.createQuery(InboxCommunicatorMessage.class);

    Root<InboxCommunicatorMessage> root2 = criteria.from(InboxCommunicatorMessage.class);
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
  
  public List<InboxCommunicatorMessage> listByRecipientAndMessageId(UserEntity user, CommunicatorMessageId communicatorMessageId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();

    CriteriaQuery<InboxCommunicatorMessage> criteria;
    Root<InboxCommunicatorMessage> inboxCommunicatorMessage;
    criteria = criteriaBuilder.createQuery(InboxCommunicatorMessage.class);
    inboxCommunicatorMessage = criteria.from(InboxCommunicatorMessage.class);
    Root<CommunicatorMessageRecipient> recipient = criteria.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, InboxCommunicatorMessage> recipientMessage = 
        criteriaBuilder.treat(recipient.join(CommunicatorMessageRecipient_.communicatorMessage), InboxCommunicatorMessage.class);
    criteria.select(inboxCommunicatorMessage);
    criteria.where(
            criteriaBuilder.and(
                criteriaBuilder.equal(inboxCommunicatorMessage.get(InboxCommunicatorMessage_.id), recipientMessage.get(InboxCommunicatorMessage_.id)),
                criteriaBuilder.equal(recipientMessage.get(InboxCommunicatorMessage_.communicatorMessageId), communicatorMessageId),
                criteriaBuilder.equal(recipient.get(CommunicatorMessageRecipient_.recipient), user.getId()),
                criteriaBuilder.equal(recipient.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)));
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<InboxCommunicatorMessage> listFirstBySender(UserEntity sender) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<InboxCommunicatorMessage> criteria = criteriaBuilder.createQuery(InboxCommunicatorMessage.class);
    Root<InboxCommunicatorMessage> root = criteria.from(InboxCommunicatorMessage.class);

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
            criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getSingleResult();
  }

  public List<InboxCommunicatorMessage> listBySenderAndMessageId(UserEntity sender, CommunicatorMessageId communicatorMessageId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<InboxCommunicatorMessage> criteria = criteriaBuilder.createQuery(InboxCommunicatorMessage.class);
    Root<InboxCommunicatorMessage> root = criteria.from(InboxCommunicatorMessage.class);

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
  public void delete(InboxCommunicatorMessage e) {
    super.delete(e);
  }
}
