package fi.muikku.plugins.calendar.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.calendar.model.LocalEventType;
import fi.muikku.plugins.calendar.model.LocalEventType_;


public class LocalEventTypeDAO extends CorePluginsDAO<LocalEventType> {

	private static final long serialVersionUID = -947619202937557009L;

	public LocalEventType create(String name) {
		EntityManager entityManager = getEntityManager();
		
		LocalEventType eventType = new LocalEventType();
    eventType.setName(name);
    entityManager.persist(eventType);
    
    return eventType;
  }
  
  public LocalEventType findByName(String name) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<LocalEventType> criteria = criteriaBuilder.createQuery(LocalEventType.class);
    Root<LocalEventType> root = criteria.from(LocalEventType.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(LocalEventType_.name), name)
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}