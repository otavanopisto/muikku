package fi.muikku.plugins.communicator.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.communicator.model.CommunicatorMessageTemplate;
import fi.muikku.plugins.communicator.model.CommunicatorMessageTemplate_;

@DAO
public class CommunicatorMessageTemplateDAO extends PluginDAO<CommunicatorMessageTemplate> {
	
  private static final long serialVersionUID = -7830619828801454118L;

  public CommunicatorMessageTemplate create(String name, String content, UserEntity user) {
    CommunicatorMessageTemplate sig = new CommunicatorMessageTemplate();
    
    sig.setName(name);
    sig.setContent(content);
    sig.setUser(user.getId());
    
    getEntityManager().persist(sig);
    
    return sig;
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
  
}
