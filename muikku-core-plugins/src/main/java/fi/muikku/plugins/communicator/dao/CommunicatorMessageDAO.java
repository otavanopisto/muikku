package fi.muikku.plugins.communicator.dao;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.model.base.Tag;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.muikku.plugins.communicator.model.CommunicatorMessageRecipient_;
import fi.muikku.plugins.communicator.model.CommunicatorMessage_;

@DAO
public class CommunicatorMessageDAO extends PluginDAO<CommunicatorMessage> {
	
  private static final long serialVersionUID = -8721990589622544635L;

  public CommunicatorMessage create(CommunicatorMessageId communicatorMessageId, Long sender,
      String caption, String content, Date created, List<Tag> tags) {
    CommunicatorMessage msg = new CommunicatorMessage();
    
    List<Long> tagIds = new ArrayList<Long>(tags.size());
    for (Tag t : tags)
      tagIds.add(t.getId());

    msg.setCommunicatorMessageId(communicatorMessageId);
    msg.setSender(sender);
    msg.setCaption(caption);
    msg.setContent(content);
    msg.setCreated(created);
    msg.setTags(tagIds);
    
    getEntityManager().persist(msg);
    
    return msg;
  }
 
  public List<CommunicatorMessage> listFirstMessagesByRecipient(UserEntity recipient) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> msgJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);

    criteria.select(msgJoin);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), recipient.getId()),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
        )
    );
    criteria.groupBy(msgJoin.get(CommunicatorMessage_.communicatorMessageId));
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<CommunicatorMessage> listMessagesByRecipientAndMessageId(UserEntity recipient, CommunicatorMessageId communicatorMessageId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> msgJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);

    criteria.select(msgJoin);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), recipient.getId()),
            criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
        )
    );
    
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
            criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getSingleResult();
  }
  
}
