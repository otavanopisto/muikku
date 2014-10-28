package fi.muikku.dao.users;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.model.users.EnvironmentRoleEntity_;

public class EnvironmentRoleEntityDAO extends CoreDAO<EnvironmentRoleEntity> {

	private static final long serialVersionUID = 7781839501190084061L;

  public EnvironmentRoleEntity create(EnvironmentRoleArchetype archetype, String name) {
    EnvironmentRoleEntity environmentRoleEntity = new EnvironmentRoleEntity();
    environmentRoleEntity.setArchetype(archetype);
    environmentRoleEntity.setName(name);
    return persist(environmentRoleEntity);
  }

  public List<EnvironmentRoleEntity> listByArchetype(EnvironmentRoleArchetype archetype) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<EnvironmentRoleEntity> criteria = criteriaBuilder.createQuery(EnvironmentRoleEntity.class);
    Root<EnvironmentRoleEntity> root = criteria.from(EnvironmentRoleEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(EnvironmentRoleEntity_.archetype), archetype)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

}
