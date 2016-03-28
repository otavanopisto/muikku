package fi.otavanopisto.muikku.security;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.security.ContextReference;

public interface WorkspaceContextResolver extends ContextResolver {

  WorkspaceEntity resolveWorkspace(ContextReference contextReference);
}
