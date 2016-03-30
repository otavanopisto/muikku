package fi.otavanopisto.muikku.dao.notifier;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.notifier.NotifierUserAction_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.notifier.NotifierActionEntity;
import fi.otavanopisto.muikku.model.notifier.NotifierMethodEntity;
import fi.otavanopisto.muikku.model.notifier.NotifierUserAction;
import fi.otavanopisto.muikku.model.notifier.NotifierUserActionAllowance;
import fi.otavanopisto.muikku.model.users.UserEntity;

public class NotifierUserActionDAO extends CoreDAO<NotifierUserAction> {

  private static final long serialVersionUID = 3410789594996024766L;

  public NotifierUserAction create(NotifierActionEntity action, NotifierMethodEntity method, UserEntity user, NotifierUserActionAllowance allowance) {
    NotifierUserAction notifierUserAction = new NotifierUserAction();

		notifierUserAction.setAction(action);
		notifierUserAction.setAllowance(allowance);
		notifierUserAction.setMethod(method);
		notifierUserAction.setUser(user.getId());
		
		persist(notifierUserAction);

		return notifierUserAction;
	}

  public NotifierUserAction findByActionAndMethodAndRecipient(NotifierActionEntity action, NotifierMethodEntity method, UserEntity recipient) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<NotifierUserAction> criteria = criteriaBuilder.createQuery(NotifierUserAction.class);
    Root<NotifierUserAction> root = criteria.from(NotifierUserAction.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(NotifierUserAction_.action), action),
            criteriaBuilder.equal(root.get(NotifierUserAction_.method), method),
            criteriaBuilder.equal(root.get(NotifierUserAction_.user), recipient.getId())
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public NotifierUserAction updateAllowance(NotifierUserAction notifierUserAction, NotifierUserActionAllowance allowance) {
    notifierUserAction.setAllowance(allowance);
    
    persist(notifierUserAction);
    
    return notifierUserAction;
  }

}
