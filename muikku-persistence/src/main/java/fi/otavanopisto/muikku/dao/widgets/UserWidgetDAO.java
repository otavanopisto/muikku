package fi.otavanopisto.muikku.dao.widgets;

import java.util.List;

import fi.otavanopisto.muikku.model.widgets.UserWidget_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.widgets.UserWidget;
import fi.otavanopisto.muikku.model.widgets.Widget;
import fi.otavanopisto.muikku.model.widgets.WidgetSpace;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


public class UserWidgetDAO extends CoreDAO<UserWidget> {

	private static final long serialVersionUID = -6906701705459034005L;

	public UserWidget create(Widget widget, WidgetSpace widgetSpace, UserEntity userEntity) {
		UserWidget userWidget = new UserWidget();
		userWidget.setWidgetSpace(widgetSpace);
		userWidget.setUser(userEntity);
		userWidget.setWidget(widget);
		
		getEntityManager().persist(userWidget);
		
		return userWidget;
	}

	public UserWidget findByWidgetSpaceAndUser(Widget widget, WidgetSpace widgetSpace, UserEntity user) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserWidget> criteria = criteriaBuilder.createQuery(UserWidget.class);
    Root<UserWidget> root = criteria.from(UserWidget.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(          
          criteriaBuilder.equal(root.get(UserWidget_.widgetSpace), widgetSpace),
          criteriaBuilder.equal(root.get(UserWidget_.user), user),
          criteriaBuilder.equal(root.get(UserWidget_.widget), widget)
        )
    );
   
    return getSingleResult( entityManager.createQuery(criteria) );
  }
	
	public List<UserWidget> listByWidgetSpaceAndUser(WidgetSpace location, UserEntity user) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserWidget> criteria = criteriaBuilder.createQuery(UserWidget.class);
    Root<UserWidget> root = criteria.from(UserWidget.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(          
          criteriaBuilder.equal(root.get(UserWidget_.widgetSpace), location),
          criteriaBuilder.equal(root.get(UserWidget_.user), user)
        )
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

	public Long countByWidgetSpaceAndUser(WidgetSpace location, UserEntity user) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<UserWidget> root = criteria.from(UserWidget.class);
    criteria.select(criteriaBuilder.count(root));
    criteria.where(
        criteriaBuilder.and(          
          criteriaBuilder.equal(root.get(UserWidget_.widgetSpace), location),
          criteriaBuilder.equal(root.get(UserWidget_.user), user)
        )
    );
   
    return entityManager.createQuery(criteria).getSingleResult();
  }

}
