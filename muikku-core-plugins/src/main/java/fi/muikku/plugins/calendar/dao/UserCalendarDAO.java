package fi.muikku.plugins.calendar.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.calendar.model.UserCalendar;
import fi.muikku.plugins.calendar.model.UserCalendar_;

public class UserCalendarDAO extends CorePluginsDAO<UserCalendar> {

  private static final long serialVersionUID = -4015334453127961131L;

  public UserCalendar create(String calendarId, String calendarProvider, Long userId, Boolean visible) {
    UserCalendar userCalendar = new UserCalendar();

    userCalendar.setCalendarId(calendarId);
    userCalendar.setCalendarProvider(calendarProvider);
    userCalendar.setUserId(userId);
    userCalendar.setVisible(visible);

    return persist(userCalendar);
  }

  public UserCalendar findByUserIdAndCalendarProvider(Long userId, String calendarProvider) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserCalendar> criteria = criteriaBuilder.createQuery(UserCalendar.class);
    Root<UserCalendar> root = criteria.from(UserCalendar.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.and(criteriaBuilder.equal(root.get(UserCalendar_.userId), userId),
        criteriaBuilder.equal(root.get(UserCalendar_.calendarProvider), calendarProvider)));

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<UserCalendar> listByUserId(Long userId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserCalendar> criteria = criteriaBuilder.createQuery(UserCalendar.class);
    Root<UserCalendar> root = criteria.from(UserCalendar.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.and(criteriaBuilder.equal(root.get(UserCalendar_.userId), userId)));

    return entityManager.createQuery(criteria).getResultList();
  }

  public List<Long> listIdsByUserId(Long userId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<UserCalendar> root = criteria.from(UserCalendar.class);
    criteria.select(root.get(UserCalendar_.id));
    criteria.where(criteriaBuilder.and(criteriaBuilder.equal(root.get(UserCalendar_.userId), userId)));

    return entityManager.createQuery(criteria).getResultList();
  }

  public UserCalendar updateVisible(UserCalendar userCalendar, Boolean visible) {
    userCalendar.setVisible(visible);
    return persist(userCalendar);
  }
}