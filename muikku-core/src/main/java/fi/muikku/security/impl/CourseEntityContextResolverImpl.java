package fi.muikku.security.impl;

import fi.muikku.model.security.CourseUserRolePermission;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.security.ContextReference;
import fi.muikku.security.CourseContextResolver;

public class CourseEntityContextResolverImpl implements CourseContextResolver {

  @Override
  public boolean handlesContextReference(ContextReference contextReference) {
    return 
        CourseUserRolePermission.class.isInstance(contextReference);
  }

  @Override
  public CourseEntity resolveCourse(ContextReference contextReference) {
    if (CourseUserRolePermission.class.isInstance(contextReference)) {
      return ((CourseUserRolePermission) contextReference).getCourse();
    }
    
    return null;
  }
  
}
