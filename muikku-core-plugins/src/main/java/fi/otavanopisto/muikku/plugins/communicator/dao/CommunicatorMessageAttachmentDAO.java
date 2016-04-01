package fi.otavanopisto.muikku.plugins.communicator.dao;

import java.util.Date;
import java.util.List;

import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageAttachment_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageAttachment;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


public class CommunicatorMessageAttachmentDAO extends CorePluginsDAO<CommunicatorMessageAttachment> {

  private static final long serialVersionUID = -3086921796495147863L;

  public CommunicatorMessageAttachment create(CommunicatorMessage message, String contentType, byte[] data, Date created) {
	  CommunicatorMessageAttachment userPicture = new CommunicatorMessageAttachment();

    userPicture.setCommunicatorMessage(message);
    userPicture.setContentType(contentType);
    userPicture.setData(data);
    userPicture.setCreated(created);
    
    getEntityManager().persist(userPicture);
    return userPicture;
  }
 
  public List<CommunicatorMessageAttachment> listByMessage(CommunicatorMessage message) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessageAttachment> criteria = criteriaBuilder.createQuery(CommunicatorMessageAttachment.class);
    Root<CommunicatorMessageAttachment> root = criteria.from(CommunicatorMessageAttachment.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(CommunicatorMessageAttachment_.communicatorMessage), message));
    
    return entityManager.createQuery(criteria).getResultList();
  }

}
