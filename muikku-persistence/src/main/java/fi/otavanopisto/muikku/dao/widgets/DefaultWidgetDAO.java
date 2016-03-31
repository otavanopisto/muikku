package fi.otavanopisto.muikku.dao.widgets;

import java.util.List;

import fi.otavanopisto.muikku.model.widgets.DefaultWidget_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.widgets.DefaultWidget;
import fi.otavanopisto.muikku.model.widgets.Widget;
import fi.otavanopisto.muikku.model.widgets.WidgetSpace;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


public class DefaultWidgetDAO extends CoreDAO<DefaultWidget> {

	private static final long serialVersionUID = -7622310449871596550L;

	public DefaultWidget create(Widget widget, WidgetSpace widgetSpace) {
    DefaultWidget defaultWidget = new DefaultWidget();
    defaultWidget.setWidgetSpace(widgetSpace);
    defaultWidget.setWidget(widget);
    
    getEntityManager().persist(defaultWidget);
    
    return defaultWidget;
  }

	public DefaultWidget findByWidgetAndWidgetSpace(Widget widget, WidgetSpace widgetSpace) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<DefaultWidget> criteria = criteriaBuilder.createQuery(DefaultWidget.class);
    Root<DefaultWidget> root = criteria.from(DefaultWidget.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(          
          criteriaBuilder.equal(root.get(DefaultWidget_.widget), widget),
          criteriaBuilder.equal(root.get(DefaultWidget_.widgetSpace), widgetSpace)
        )
    );
   
    return getSingleResult( entityManager.createQuery(criteria) );
  }

  public List<DefaultWidget> listByWidgetSpace(WidgetSpace widgetSpace) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<DefaultWidget> criteria = criteriaBuilder.createQuery(DefaultWidget.class);
    Root<DefaultWidget> root = criteria.from(DefaultWidget.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(DefaultWidget_.widgetSpace), widgetSpace)
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

	public Long countByWidgetSpace(WidgetSpace widgetSpace) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<DefaultWidget> root = criteria.from(DefaultWidget.class);
    criteria.select(criteriaBuilder.count(root));
    
    criteria.where(
      criteriaBuilder.equal(root.get(DefaultWidget_.widgetSpace), widgetSpace)
    );
   
    return entityManager.createQuery(criteria).getSingleResult();
  }

}
