package fi.muikku.security;

import fi.muikku.model.stub.courses.CourseEntity;

public interface CourseContextResolver extends ContextResolver {

  CourseEntity resolveCourse(ContextReference contextReference);
}
