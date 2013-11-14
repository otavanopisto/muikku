package fi.muikku.security.impl;

import fi.muikku.model.security.WorkspaceRolePermission;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.security.ContextReference;
import fi.muikku.security.CourseContextResolver;

public class CourseEntityContextResolverImpl implements CourseContextResolver {

  @Override
  public boolean handlesContextReference(ContextReference contextReference) {
    return 
        WorkspaceRolePermission.class.isInstance(contextReference);
  }

  @Override
  public WorkspaceEntity resolveCourse(ContextReference contextReference) {
    if (WorkspaceRolePermission.class.isInstance(contextReference)) {
      return ((WorkspaceRolePermission) contextReference).getWorkspace();
    }
    
    return null;
  }
  
}
