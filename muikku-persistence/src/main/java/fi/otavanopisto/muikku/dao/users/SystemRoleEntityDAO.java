package fi.otavanopisto.muikku.dao.users;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.users.SystemRoleEntity_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.users.SystemRoleEntity;
import fi.otavanopisto.muikku.model.users.SystemRoleType;

public class SystemRoleEntityDAO extends CoreDAO<SystemRoleEntity> {

	private static final long serialVersionUID = 7781839501190084061L;

  public SystemRoleEntity create(String name, SystemRoleType roleType) {
    SystemRoleEntity systemRoleEntity = new SystemRoleEntity();
    systemRoleEntity.setName(name);
    systemRoleEntity.setRoleType(roleType);
    return persist(systemRoleEntity);
  }

  public SystemRoleEntity findByRoleType(SystemRoleType roleType) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SystemRoleEntity> criteria = criteriaBuilder.createQuery(SystemRoleEntity.class);
    Root<SystemRoleEntity> root = criteria.from(SystemRoleEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(SystemRoleEntity_.roleType), roleType)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

}
