package fi.muikku.security.impl;

import fi.muikku.model.security.WorkspaceRolePermission;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.security.WorkspaceContextResolver;
import fi.otavanopisto.security.ContextReference;

public class WorkspaceEntityContextResolverImpl implements WorkspaceContextResolver {

  @Override
  public boolean handlesContextReference(ContextReference contextReference) {
    return 
        WorkspaceEntity.class.isInstance(contextReference) ||
        WorkspaceRolePermission.class.isInstance(contextReference);
  }

  @Override
  public WorkspaceEntity resolveWorkspace(ContextReference contextReference) {
    if (WorkspaceEntity.class.isInstance(contextReference)) {
      return (WorkspaceEntity) contextReference;
    }
    
    if (WorkspaceRolePermission.class.isInstance(contextReference)) {
      return ((WorkspaceRolePermission) contextReference).getWorkspace();
    }
    
    return null;
  }
  
}
