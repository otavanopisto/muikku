package fi.muikku.plugins.calendar.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.calendar.model.SubscribedCalendar;
import fi.muikku.plugins.calendar.model.SubscribedCalendar_;

@DAO
public class SubscribedCalendarDAO extends PluginDAO<SubscribedCalendar> {

	private static final long serialVersionUID = -4015334453127961131L;

	public SubscribedCalendar create(String name, String url, String color, Date lastSynchronized) {
		SubscribedCalendar subscribedCalendar = new SubscribedCalendar();
		subscribedCalendar.setName(name);
		subscribedCalendar.setUrl(url);
		subscribedCalendar.setColor(color);
		subscribedCalendar.setLastSynchronized(lastSynchronized);
		
		getEntityManager().persist(subscribedCalendar);

		return subscribedCalendar;
	}

	public List<SubscribedCalendar> listAllOrderByLastSynchronizedAsc(int firstResult, int maxResults) {
		EntityManager entityManager = getEntityManager();
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<SubscribedCalendar> criteria = criteriaBuilder.createQuery(SubscribedCalendar.class);
		Root<SubscribedCalendar> root = criteria.from(SubscribedCalendar.class);
		criteria.select(root);
		criteria.orderBy(criteriaBuilder.asc(root.get(SubscribedCalendar_.lastSynchronized)));

		TypedQuery<SubscribedCalendar> query = entityManager.createQuery(criteria);
		query.setFirstResult(firstResult);
		query.setMaxResults(maxResults);

		return query.getResultList();
	}
	
	public SubscribedCalendar updateLastSynchronized(SubscribedCalendar subscribedCalendar, Date lastSynchronized) {
		subscribedCalendar.setLastSynchronized(lastSynchronized);
		getEntityManager().persist(subscribedCalendar);
		return subscribedCalendar;
	}

}