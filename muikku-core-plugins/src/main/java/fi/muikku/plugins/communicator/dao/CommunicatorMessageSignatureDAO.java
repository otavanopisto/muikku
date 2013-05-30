package fi.muikku.plugins.communicator.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.communicator.model.CommunicatorMessageSignature;
import fi.muikku.plugins.communicator.model.CommunicatorMessageSignature_;

@DAO
public class CommunicatorMessageSignatureDAO extends PluginDAO<CommunicatorMessageSignature> {
	
  private static final long serialVersionUID = -7830619828801454118L;

  public CommunicatorMessageSignature create(String name, String content, UserEntity user) {
    CommunicatorMessageSignature sig = new CommunicatorMessageSignature();
    
    sig.setName(name);
    sig.setSignature(content);
    sig.setUser(user.getId());
    
    getEntityManager().persist(sig);
    
    return sig;
  }
  
  public List<CommunicatorMessageSignature> listByUser(UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessageSignature> criteria = criteriaBuilder.createQuery(CommunicatorMessageSignature.class);
    Root<CommunicatorMessageSignature> root = criteria.from(CommunicatorMessageSignature.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(CommunicatorMessageSignature_.user), user.getId())
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
