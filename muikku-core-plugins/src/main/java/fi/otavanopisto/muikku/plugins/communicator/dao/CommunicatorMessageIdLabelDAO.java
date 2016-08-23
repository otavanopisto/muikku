package fi.otavanopisto.muikku.plugins.communicator.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel_;

public class CommunicatorMessageIdLabelDAO extends CorePluginsDAO<CommunicatorMessageIdLabel> {
	
  private static final long serialVersionUID = -7513353900590903561L;

  public CommunicatorMessageIdLabel create(UserEntity userEntity, CommunicatorMessageId messageId, CommunicatorLabel label) {
    CommunicatorMessageIdLabel communicatorUserLabel = new CommunicatorMessageIdLabel();
    
    communicatorUserLabel.setUserEntity(userEntity.getId());
    communicatorUserLabel.setCommunicatorMessageId(messageId);
    communicatorUserLabel.setLabel(label);
    
    getEntityManager().persist(communicatorUserLabel);
    
    return communicatorUserLabel;
  }

  public List<CommunicatorMessageIdLabel> listByUserAndMessageId(UserEntity userEntity, CommunicatorMessageId messageId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessageIdLabel> criteria = criteriaBuilder.createQuery(CommunicatorMessageIdLabel.class);
    Root<CommunicatorMessageIdLabel> root = criteria.from(CommunicatorMessageIdLabel.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessageIdLabel_.userEntity), userEntity.getId()),
            criteriaBuilder.equal(root.get(CommunicatorMessageIdLabel_.communicatorMessageId), messageId)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  @Override
  public void delete(CommunicatorMessageIdLabel communicatorUserLabel) {
    super.delete(communicatorUserLabel);
  }
}
