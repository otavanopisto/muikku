package fi.muikku.security;

import fi.muikku.model.base.Environment;

public interface EnvironmentContextResolver extends ContextResolver {

  Environment resolveEnvironment(ContextReference contextReference);
}
