package fi.muikku.security.impl;

import fi.muikku.model.base.Environment;
import fi.muikku.security.ContextReference;
import fi.muikku.security.EnvironmentContextResolver;

public class EnvironmentContextResolverImpl implements EnvironmentContextResolver {

  @Override
  public boolean handlesContextReference(ContextReference contextReference) {
    return 
        Environment.class.isInstance(contextReference);
  }

  @Override
  public Environment resolveEnvironment(ContextReference contextReference) {
    return (Environment) contextReference;
  }
  
}
