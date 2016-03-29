package fi.otavanopisto.muikku.dao.widgets;

import fi.otavanopisto.muikku.model.widgets.WidgetSpace_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.widgets.WidgetSpace;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


public class WidgetSpaceDAO extends CoreDAO<WidgetSpace> {

	private static final long serialVersionUID = 5216145752567305432L;

	public WidgetSpace create(String name) {
		WidgetSpace widgetSpace = new WidgetSpace();
		widgetSpace.setName(name);
		
		getEntityManager().persist(widgetSpace);
		
		return widgetSpace;
	}

	public WidgetSpace findByName(String name) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WidgetSpace> criteria = criteriaBuilder.createQuery(WidgetSpace.class);
    Root<WidgetSpace> root = criteria.from(WidgetSpace.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WidgetSpace_.name), name)
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
  }

}
