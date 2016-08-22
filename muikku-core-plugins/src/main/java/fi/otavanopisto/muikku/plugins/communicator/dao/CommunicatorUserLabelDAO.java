package fi.otavanopisto.muikku.plugins.communicator.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorUserLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorUserLabel_;

public class CommunicatorUserLabelDAO extends CorePluginsDAO<CommunicatorUserLabel> {
	
  private static final long serialVersionUID = -7513353900590903561L;

  public CommunicatorUserLabel create(String name, Long color, UserEntity userEntity) {
    CommunicatorUserLabel communicatorUserLabel = new CommunicatorUserLabel();
    
    communicatorUserLabel.setName(name);
    communicatorUserLabel.setColor(color);
    communicatorUserLabel.setUserEntity(userEntity.getId());
    communicatorUserLabel.setArchived(false);
    
    getEntityManager().persist(communicatorUserLabel);
    
    return communicatorUserLabel;
  }

  public List<CommunicatorUserLabel> listByUser(UserEntity userEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorUserLabel> criteria = criteriaBuilder.createQuery(CommunicatorUserLabel.class);
    Root<CommunicatorUserLabel> root = criteria.from(CommunicatorUserLabel.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorUserLabel_.userEntity), userEntity.getId()),
            criteriaBuilder.equal(root.get(CommunicatorUserLabel_.archived), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public CommunicatorUserLabel update(CommunicatorUserLabel communicatorUserLabel, String name, Long color) {
    communicatorUserLabel.setName(name);
    communicatorUserLabel.setColor(color);
    
    getEntityManager().persist(communicatorUserLabel);
    
    return communicatorUserLabel;
  }
  
  public CommunicatorUserLabel updateArchived(CommunicatorUserLabel communicatorUserLabel, Boolean archived) {
    communicatorUserLabel.setArchived(archived);
    
    getEntityManager().persist(communicatorUserLabel);
    
    return communicatorUserLabel;
  }
  
  @Override
  public void delete(CommunicatorUserLabel communicatorUserLabel) {
    super.delete(communicatorUserLabel);
  }
}
