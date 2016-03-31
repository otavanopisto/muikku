package fi.otavanopisto.muikku.dao.notifier;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.notifier.NotifierActionEntity_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.notifier.NotifierActionEntity;

public class NotifierActionEntityDAO extends CoreDAO<NotifierActionEntity> {

  private static final long serialVersionUID = 3410789594996024766L;

  public NotifierActionEntity create(String name) {
    NotifierActionEntity notifierActionEntity = new NotifierActionEntity();

		notifierActionEntity.setName(name);
		
		persist(notifierActionEntity);

		return notifierActionEntity;
	}

  public NotifierActionEntity findByName(String name) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<NotifierActionEntity> criteria = criteriaBuilder.createQuery(NotifierActionEntity.class);
    Root<NotifierActionEntity> root = criteria.from(NotifierActionEntity.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(NotifierActionEntity_.name), name)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

}
