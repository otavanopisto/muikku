package fi.muikku.security;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.security.ContextReference;

public interface WorkspaceContextResolver extends ContextResolver {

  WorkspaceEntity resolveWorkspace(ContextReference contextReference);
}
