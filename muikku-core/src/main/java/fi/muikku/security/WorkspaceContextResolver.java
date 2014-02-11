package fi.muikku.security;

import fi.muikku.model.workspace.WorkspaceEntity;

public interface WorkspaceContextResolver extends ContextResolver {

  WorkspaceEntity resolveWorkspace(ContextReference contextReference);
}
