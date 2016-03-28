package fi.otavanopisto.muikku.dao.notifier;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.notifier.NotifierMethodEntity_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.notifier.NotifierMethodEntity;

public class NotifierMethodEntityDAO extends CoreDAO<NotifierMethodEntity> {

  private static final long serialVersionUID = 2986882765507692954L;

  public NotifierMethodEntity create(String name) {
    NotifierMethodEntity notifierMethodEntity = new NotifierMethodEntity();

		notifierMethodEntity.setName(name);
		
		persist(notifierMethodEntity);

		return notifierMethodEntity;
	}

  public NotifierMethodEntity findByName(String name) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<NotifierMethodEntity> criteria = criteriaBuilder.createQuery(NotifierMethodEntity.class);
    Root<NotifierMethodEntity> root = criteria.from(NotifierMethodEntity.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(NotifierMethodEntity_.name), name)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

}
