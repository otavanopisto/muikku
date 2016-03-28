package fi.otavanopisto.muikku.plugins.communicator.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageTemplate_;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageTemplate;


public class CommunicatorMessageTemplateDAO extends CorePluginsDAO<CommunicatorMessageTemplate> {
	
  private static final long serialVersionUID = -7830619828801454118L;

  public CommunicatorMessageTemplate create(String name, String content, UserEntity user) {
    CommunicatorMessageTemplate messageTemplate = new CommunicatorMessageTemplate();
    
    messageTemplate.setName(name);
    messageTemplate.setContent(content);
    messageTemplate.setUser(user.getId());
    
    getEntityManager().persist(messageTemplate);
    
    return messageTemplate;
  }
  
  public List<CommunicatorMessageTemplate> listByUser(UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessageTemplate> criteria = criteriaBuilder.createQuery(CommunicatorMessageTemplate.class);
    Root<CommunicatorMessageTemplate> root = criteria.from(CommunicatorMessageTemplate.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(CommunicatorMessageTemplate_.user), user.getId())
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  @Override
  public void delete(CommunicatorMessageTemplate messageTemplate) {
    super.delete(messageTemplate);
  }

  public CommunicatorMessageTemplate update(CommunicatorMessageTemplate messageTemplate, String name, String content) {
    messageTemplate.setName(name);
    messageTemplate.setContent(content);
    
    getEntityManager().persist(messageTemplate);
    
    return messageTemplate;
  }
}
