package fi.muikku.data;

import java.util.List;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.UserTransaction;

import fi.muikku.model.security.Permission;
import fi.muikku.model.users.SystemUserRole;
import fi.muikku.model.users.SystemUserRoleType;
import fi.muikku.security.PermissionCollection;
import fi.muikku.security.PermissionScope;

@Startup
@Singleton
public class SeedDataImporter {

	@PersistenceContext
	private EntityManager em;

	@Inject
	private UserTransaction tx;

	@Inject
	@Any
	private Instance<PermissionCollection> permissionCollections;

	@PostConstruct
	public void importData() {
		for (SystemUserRoleType type : SystemUserRoleType.values()) {
			if (em.createQuery("from SystemUserRole where name = '" + type.name() + "'").getResultList().size() == 0) {
				SystemUserRole sur = new SystemUserRole();
				sur.setName(type.name());
				sur.setSystemUserRoleType(type);
				em.persist(sur);
			}
		}

		for (PermissionCollection collection : permissionCollections) {
			List<String> permissions = collection.listPermissions();

			for (String permission : permissions) {
				if (em.createQuery("from Permission where name = '" + permission + "'").getResultList().size() == 0) {
					try {
						String permissionScope = collection.getPermissionScope(permission);

						if (!PermissionScope.PERSONAL.equals(permissionScope)) {
							Permission per = new Permission();
							per.setName(permission);
							per.setScope(permissionScope);
							em.persist(per);
						}
						
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
		}

	}

}
