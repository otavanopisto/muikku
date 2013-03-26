package fi.muikku.security.impl;

import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.security.ContextReference;
import fi.muikku.security.CourseContextResolver;

public class CourseContextResolverImpl implements CourseContextResolver {

  @Override
  public boolean handlesContextReference(ContextReference contextReference) {
    return 
        CourseEntity.class.isInstance(contextReference);
  }

  @Override
  public CourseEntity resolveCourse(ContextReference contextReference) {
    return (CourseEntity) contextReference;
  }
  
}
