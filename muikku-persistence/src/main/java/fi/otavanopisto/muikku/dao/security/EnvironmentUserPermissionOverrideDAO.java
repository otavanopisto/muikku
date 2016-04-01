package fi.otavanopisto.muikku.dao.security;

import fi.otavanopisto.muikku.model.security.EnvironmentUserPermissionOverride_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.security.EnvironmentUserPermissionOverride;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.PermissionOverrideState;
import fi.otavanopisto.muikku.model.users.EnvironmentUser;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


public class EnvironmentUserPermissionOverrideDAO extends CoreDAO<EnvironmentUserPermissionOverride> {

	private static final long serialVersionUID = -8147406055940995152L;

	public EnvironmentUserPermissionOverride create(EnvironmentUser environmentUser, Permission permission, PermissionOverrideState state) {
    EnvironmentUserPermissionOverride override = new EnvironmentUserPermissionOverride();
    
    override.setEnvironmentUser(environmentUser);
    override.setPermission(permission);
    override.setState(state);
    
    getEntityManager().persist(override);
    
    return override;
  }
  
  public EnvironmentUserPermissionOverride findByEnvironmentUserAndPermission(EnvironmentUser environmentUser, Permission permission) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<EnvironmentUserPermissionOverride> criteria = criteriaBuilder.createQuery(EnvironmentUserPermissionOverride.class);
    Root<EnvironmentUserPermissionOverride> root = criteria.from(EnvironmentUserPermissionOverride.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(EnvironmentUserPermissionOverride_.environmentUser), environmentUser),
            criteriaBuilder.equal(root.get(EnvironmentUserPermissionOverride_.permission), permission)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  @Override
  public void delete(EnvironmentUserPermissionOverride override) {
    super.delete(override);
  }
}
