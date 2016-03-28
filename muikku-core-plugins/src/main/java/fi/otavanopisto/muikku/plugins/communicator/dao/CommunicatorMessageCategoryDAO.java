package fi.otavanopisto.muikku.plugins.communicator.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageCategory_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageCategory;


public class CommunicatorMessageCategoryDAO extends CorePluginsDAO<CommunicatorMessageCategory> {
	
  private static final long serialVersionUID = -4040291941730793204L;

  public CommunicatorMessageCategory create(String name) {
    CommunicatorMessageCategory category = new CommunicatorMessageCategory();
    category.setName(name);
    getEntityManager().persist(category);
    return category;
  }
  
  public CommunicatorMessageCategory findByName(String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessageCategory> criteria = criteriaBuilder.createQuery(CommunicatorMessageCategory.class);
    Root<CommunicatorMessageCategory> root = criteria.from(CommunicatorMessageCategory.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(CommunicatorMessageCategory_.name), name));

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
