package fi.muikku.dao.security;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.security.ResourceRights;


@DAO
public class ResourceRightsDAO extends CoreDAO<ResourceRights> {

	private static final long serialVersionUID = 2279679079659071649L;

  public ResourceRights create() {
    ResourceRights rights = new ResourceRights();
    getEntityManager().persist(rights);
    
    return rights;
  }

  
}
