package fi.otavanopisto.muikku.plugins.communicator.dao;

import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaDelete;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.VacationNotifications_;
import fi.otavanopisto.muikku.plugins.communicator.model.VacationNotifications;

public class VacationNotificationsDAO extends CorePluginsDAO<VacationNotifications> {

  private static final long serialVersionUID = 3790128454976388680L;

  public VacationNotifications create(UserEntity sender, UserEntity receiver, Date notificationDate) {
    VacationNotifications vacationNotification = new VacationNotifications();
    
    vacationNotification.setSender(sender.getId());
    vacationNotification.setReceiver(receiver.getId());
    vacationNotification.setNotificationDate(notificationDate);
    
    getEntityManager().persist(vacationNotification);
    
    return vacationNotification;
  }
  
  public VacationNotifications findNotification(UserEntity sender, UserEntity receiver) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<VacationNotifications> criteria = criteriaBuilder.createQuery(VacationNotifications.class);
    Root<VacationNotifications> root = criteria.from(VacationNotifications.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(VacationNotifications_.sender), sender.getId()),
        criteriaBuilder.equal(root.get(VacationNotifications_.receiver), receiver.getId())
      )
    );
    return getSingleResult(entityManager.createQuery(criteria));
  }
	
	public VacationNotifications updateNotificationDate(VacationNotifications vacationNotification,Date notificationDate) {
    vacationNotification.setNotificationDate(notificationDate);
    
    getEntityManager().persist(vacationNotification);
    
    return vacationNotification;
  }
	
	public int deleteNotificationsOlderThan(Date thresholdDate) {
    
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaDelete<VacationNotifications> criteria = criteriaBuilder.createCriteriaDelete(VacationNotifications.class);
    Root<VacationNotifications> root = criteria.from(VacationNotifications.class);

    criteria.where(
        criteriaBuilder.lessThan(root.get(VacationNotifications_.notificationDate), thresholdDate)
    );
    
    return entityManager.createQuery(criteria).executeUpdate();
  }
}