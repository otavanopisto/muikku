package fi.otavanopisto.muikku.dao.security;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.security.ResourceRights;


public class ResourceRightsDAO extends CoreDAO<ResourceRights> {

	private static final long serialVersionUID = 2279679079659071649L;

  public ResourceRights create() {
    ResourceRights rights = new ResourceRights();
    getEntityManager().persist(rights);
    
    return rights;
  }

  
}
