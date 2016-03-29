package fi.otavanopisto.muikku.dao.widgets;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.widgets.Widget_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.widgets.Widget;
import fi.otavanopisto.muikku.model.widgets.WidgetVisibility;

public class WidgetDAO extends CoreDAO<Widget> {

	private static final long serialVersionUID = 536153345356856021L;

	public Widget create(String name, Integer minimumSize, WidgetVisibility visibility) {
		
		Widget widget = new Widget();
		widget.setName(name);
		widget.setVisibility(visibility);
		widget.setMinimumSize(minimumSize);
		
		getEntityManager().persist(widget);
		
		return widget;
	}
	
	public Widget findByName(String name) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Widget> criteria = criteriaBuilder.createQuery(Widget.class);
    Root<Widget> root = criteria.from(Widget.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(Widget_.name), name)
    );
   
    return getSingleResult( entityManager.createQuery(criteria) );
	}
}
