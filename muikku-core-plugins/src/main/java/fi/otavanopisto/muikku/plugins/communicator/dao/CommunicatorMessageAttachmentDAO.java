package fi.otavanopisto.muikku.plugins.communicator.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageAttachment;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageAttachment_;


public class CommunicatorMessageAttachmentDAO extends CorePluginsDAO<CommunicatorMessageAttachment> {

  private static final long serialVersionUID = -3086921796495147863L;

  public CommunicatorMessageAttachment create(String name, String contentType, byte[] content) {
    CommunicatorMessageAttachment communicatorMessageAttachment = new CommunicatorMessageAttachment();
    communicatorMessageAttachment.setName(name);
    communicatorMessageAttachment.setContentType(contentType);
    communicatorMessageAttachment.setContent(content);
    
    return persist(communicatorMessageAttachment);
  }
 
  public CommunicatorMessageAttachment findByName(String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessageAttachment> criteria = criteriaBuilder.createQuery(CommunicatorMessageAttachment.class);
    Root<CommunicatorMessageAttachment> root = criteria.from(CommunicatorMessageAttachment.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(CommunicatorMessageAttachment_.name), name)
    );
    return getSingleResult(entityManager.createQuery(criteria));
  }
}
