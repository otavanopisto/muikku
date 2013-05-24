package fi.muikku.plugins.calendar.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.calendar.model.Calendar;
import fi.muikku.plugins.calendar.model.UserCalendar;
import fi.muikku.plugins.calendar.model.UserCalendar_;

@DAO
public class UserCalendarDAO extends PluginDAO<UserCalendar> {
	
	private static final long serialVersionUID = -4015334453127961131L;

	public UserCalendar create(Calendar calendar, Long userId, Boolean visible) {
    UserCalendar userCalendar = new UserCalendar();
    
    userCalendar.setCalendar(calendar);
    userCalendar.setUserId(userId);
    userCalendar.setVisible(visible);
    
    getEntityManager().persist(userCalendar);
    
    return userCalendar;
  }

	public UserCalendar findByCalendarAndUser(Calendar calendar, Long userId) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserCalendar> criteria = criteriaBuilder.createQuery(UserCalendar.class);
    Root<UserCalendar> root = criteria.from(UserCalendar.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(UserCalendar_.calendar), calendar),
        criteriaBuilder.equal(root.get(UserCalendar_.userId), userId)
      )
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
	}

	public List<UserCalendar> listByUserId(Long userId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserCalendar> criteria = criteriaBuilder.createQuery(UserCalendar.class);
    Root<UserCalendar> root = criteria.from(UserCalendar.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(UserCalendar_.userId), userId)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }
	
	public UserCalendar updateVisible(UserCalendar userCalendar, Boolean visible) {
		userCalendar.setVisible(visible);
		getEntityManager().persist(userCalendar);
		return userCalendar;
	}
	
}