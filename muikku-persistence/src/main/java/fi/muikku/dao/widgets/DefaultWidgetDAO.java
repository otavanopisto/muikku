package fi.muikku.dao.widgets;

import java.util.List;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.widgets.DefaultWidget;
import fi.muikku.model.widgets.DefaultWidget_;
import fi.muikku.model.widgets.Widget;
import fi.muikku.model.widgets.WidgetLocation;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class DefaultWidgetDAO extends CoreDAO<DefaultWidget> {

	private static final long serialVersionUID = -7622310449871596550L;

	public DefaultWidget create(Widget widget, WidgetLocation location) {
    DefaultWidget defaultWidget = new DefaultWidget();
    defaultWidget.setLocation(location);
    defaultWidget.setWidget(widget);
    
    getEntityManager().persist(defaultWidget);
    
    return defaultWidget;
  }

	public DefaultWidget findByWidgetAndLocation(Widget widget, WidgetLocation location) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<DefaultWidget> criteria = criteriaBuilder.createQuery(DefaultWidget.class);
    Root<DefaultWidget> root = criteria.from(DefaultWidget.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(          
          criteriaBuilder.equal(root.get(DefaultWidget_.widget), widget),
          criteriaBuilder.equal(root.get(DefaultWidget_.location), location)
        )
    );
   
    return getSingleResult( entityManager.createQuery(criteria) );
  }

  public List<DefaultWidget> listByLocation(WidgetLocation location) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<DefaultWidget> criteria = criteriaBuilder.createQuery(DefaultWidget.class);
    Root<DefaultWidget> root = criteria.from(DefaultWidget.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(DefaultWidget_.location), location)
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

	public Long countByLocation(WidgetLocation location) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<DefaultWidget> root = criteria.from(DefaultWidget.class);
    criteria.select(criteriaBuilder.count(root));
    
    criteria.where(
      criteriaBuilder.equal(root.get(DefaultWidget_.location), location)
    );
   
    return entityManager.createQuery(criteria).getSingleResult();
  }

}
