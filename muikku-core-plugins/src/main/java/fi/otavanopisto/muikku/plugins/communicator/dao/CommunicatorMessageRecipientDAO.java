package fi.otavanopisto.muikku.plugins.communicator.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient_;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage_;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;


public class CommunicatorMessageRecipientDAO extends CorePluginsDAO<CommunicatorMessageRecipient> {
	
  private static final long serialVersionUID = -7830619828801454118L;

  public CommunicatorMessageRecipient create(CommunicatorMessage communicatorMessage, UserEntity recipient) {
    CommunicatorMessageRecipient msg = new CommunicatorMessageRecipient();
    
    msg.setCommunicatorMessage(communicatorMessage);
    msg.setRecipient(recipient.getId());
    msg.setReadByReceiver(false);
    msg.setArchivedByReceiver(false);
    msg.setTrashedByReceiver(false);
    
    getEntityManager().persist(msg);
    
    return msg;
  }
  
  public List<CommunicatorMessageRecipient> listByMessage(CommunicatorMessage communicatorMessage) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessageRecipient> criteria = criteriaBuilder.createQuery(CommunicatorMessageRecipient.class);
    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.communicatorMessage), communicatorMessage)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<CommunicatorMessageRecipient> listByUserAndMessageId(UserEntity user, CommunicatorMessageId messageId, boolean trashed, boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessageRecipient> criteria = criteriaBuilder.createQuery(CommunicatorMessageRecipient.class);
    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
    
    Join<CommunicatorMessageRecipient, CommunicatorMessage> msgJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.communicatorMessageId), messageId),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), user.getId()),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.trashedByReceiver), trashed),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), archived)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<CommunicatorMessageRecipient> listByUserAndRead(UserEntity user, boolean read, boolean trashed) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessageRecipient> criteria = criteriaBuilder.createQuery(CommunicatorMessageRecipient.class);
    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), user.getId()),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.readByReceiver), read),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.trashedByReceiver), trashed),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public CommunicatorMessageRecipient updateRecipientRead(CommunicatorMessageRecipient recipient, Boolean value) {
    recipient.setReadByReceiver(value);
    
    getEntityManager().persist(recipient);
    
    return recipient;
  }
  
  public CommunicatorMessageRecipient updateArchivedByReceiver(CommunicatorMessageRecipient recipient, boolean value) {
    recipient.setArchivedByReceiver(value);
    
    getEntityManager().persist(recipient);
    
    return recipient;
  }

  public CommunicatorMessageRecipient updateTrashedByReceiver(CommunicatorMessageRecipient recipient, boolean value) {
    recipient.setTrashedByReceiver(value);
    
    getEntityManager().persist(recipient);
    
    return recipient;
  }

  @Override
  public void delete(CommunicatorMessageRecipient e) {
    super.delete(e);
  }
}
