package fi.muikku.dao.widgets;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.widgets.WidgetLocation;
import fi.muikku.model.widgets.WidgetLocation_;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class WidgetLocationDAO extends CoreDAO<WidgetLocation> {

	private static final long serialVersionUID = 5216145752567305432L;

	public WidgetLocation create(String name) {
		WidgetLocation widgetLocation = new WidgetLocation();
		widgetLocation.setName(name);
		
		getEntityManager().persist(widgetLocation);
		
		return widgetLocation;
	}

	public WidgetLocation findByName(String name) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WidgetLocation> criteria = criteriaBuilder.createQuery(WidgetLocation.class);
    Root<WidgetLocation> root = criteria.from(WidgetLocation.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WidgetLocation_.name), name)
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
  }

}
