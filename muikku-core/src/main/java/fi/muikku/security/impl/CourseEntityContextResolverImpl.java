package fi.muikku.security.impl;

import fi.muikku.model.security.CourseRolePermission;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.security.ContextReference;
import fi.muikku.security.CourseContextResolver;

public class CourseEntityContextResolverImpl implements CourseContextResolver {

  @Override
  public boolean handlesContextReference(ContextReference contextReference) {
    return 
        CourseRolePermission.class.isInstance(contextReference);
  }

  @Override
  public WorkspaceEntity resolveCourse(ContextReference contextReference) {
    if (CourseRolePermission.class.isInstance(contextReference)) {
      return ((CourseRolePermission) contextReference).getCourse();
    }
    
    return null;
  }
  
}
