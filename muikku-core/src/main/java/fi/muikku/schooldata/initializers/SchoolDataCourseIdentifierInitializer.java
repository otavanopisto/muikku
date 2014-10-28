package fi.muikku.schooldata.initializers;

import java.util.List;

import fi.muikku.schooldata.entity.CourseIdentifier;

public interface SchoolDataCourseIdentifierInitializer extends SchoolDataEntityInitializer {

	public List<CourseIdentifier> init(List<CourseIdentifier> courseIdentifiers);
	
}
