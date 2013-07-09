package fi.muikku.dao.widgets;

import java.util.List;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.widgets.UserWidget;
import fi.muikku.model.widgets.UserWidget_;
import fi.muikku.model.widgets.Widget;
import fi.muikku.model.widgets.WidgetLocation;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class UserWidgetDAO extends CoreDAO<UserWidget> {

	private static final long serialVersionUID = -6906701705459034005L;

	public UserWidget create(Widget widget, WidgetLocation widgetLocation, UserEntity userEntity) {
		UserWidget userWidget = new UserWidget();
		userWidget.setLocation(widgetLocation);
		userWidget.setUser(userEntity);
		userWidget.setWidget(widget);
		
		getEntityManager().persist(userWidget);
		
		return userWidget;
	}

	public UserWidget findByWidgetLocationAndUser(Widget widget, WidgetLocation location, UserEntity user) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserWidget> criteria = criteriaBuilder.createQuery(UserWidget.class);
    Root<UserWidget> root = criteria.from(UserWidget.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(          
          criteriaBuilder.equal(root.get(UserWidget_.location), location),
          criteriaBuilder.equal(root.get(UserWidget_.user), user),
          criteriaBuilder.equal(root.get(UserWidget_.widget), widget)
        )
    );
   
    return getSingleResult( entityManager.createQuery(criteria) );
  }
	
	public List<UserWidget> listByLocationAndUser(WidgetLocation location, UserEntity user) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserWidget> criteria = criteriaBuilder.createQuery(UserWidget.class);
    Root<UserWidget> root = criteria.from(UserWidget.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(          
          criteriaBuilder.equal(root.get(UserWidget_.location), location),
          criteriaBuilder.equal(root.get(UserWidget_.user), user)
        )
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

	public Long countByLocationAndUser(WidgetLocation location, UserEntity user) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<UserWidget> root = criteria.from(UserWidget.class);
    criteria.select(criteriaBuilder.count(root));
    criteria.where(
        criteriaBuilder.and(          
          criteriaBuilder.equal(root.get(UserWidget_.location), location),
          criteriaBuilder.equal(root.get(UserWidget_.user), user)
        )
    );
   
    return entityManager.createQuery(criteria).getSingleResult();
  }

}
