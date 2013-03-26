package fi.muikku.security.impl;

import fi.muikku.model.base.Environment;
import fi.muikku.model.security.EnvironmentUserRolePermission;
import fi.muikku.security.ContextReference;
import fi.muikku.security.EnvironmentContextResolver;

public class EnvironmentEntityContextResolverImpl implements EnvironmentContextResolver {

  @Override
  public boolean handlesContextReference(ContextReference contextReference) {
    return 
        EnvironmentUserRolePermission.class.isInstance(contextReference);
  }

  @Override
  public Environment resolveEnvironment(ContextReference contextReference) {
    if (EnvironmentUserRolePermission.class.isInstance(contextReference)) {
      return ((EnvironmentUserRolePermission) contextReference).getEnvironment();
    }
    
    return null;
  }
  
}
