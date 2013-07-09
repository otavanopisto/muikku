package fi.muikku.security.impl;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.security.ContextReference;
import fi.muikku.security.CourseContextResolver;

public class CourseContextResolverImpl implements CourseContextResolver {

  @Override
  public boolean handlesContextReference(ContextReference contextReference) {
    return 
        WorkspaceEntity.class.isInstance(contextReference);
  }

  @Override
  public WorkspaceEntity resolveCourse(ContextReference contextReference) {
    return (WorkspaceEntity) contextReference;
  }
  
}
