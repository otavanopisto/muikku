package fi.muikku.security;

import fi.muikku.model.workspace.WorkspaceEntity;

public interface CourseContextResolver extends ContextResolver {

  WorkspaceEntity resolveCourse(ContextReference contextReference);
}
