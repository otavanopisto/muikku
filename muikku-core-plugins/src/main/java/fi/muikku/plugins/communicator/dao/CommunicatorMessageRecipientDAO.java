package fi.muikku.plugins.communicator.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.muikku.plugins.communicator.model.CommunicatorMessageRecipient_;

@DAO
public class CommunicatorMessageRecipientDAO extends PluginDAO<CommunicatorMessageRecipient> {
	
  private static final long serialVersionUID = -7830619828801454118L;

  public CommunicatorMessageRecipient create(CommunicatorMessage communicatorMessage, Long recipient) {
    CommunicatorMessageRecipient msg = new CommunicatorMessageRecipient();
    
    msg.setCommunicatorMessage(communicatorMessage);
    msg.setRecipient(recipient);
    
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
  
}
