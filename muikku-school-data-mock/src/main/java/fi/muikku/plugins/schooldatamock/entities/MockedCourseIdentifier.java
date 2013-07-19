package fi.muikku.plugins.schooldatamock.entities;

import fi.muikku.plugins.schooldatamock.SchoolDataMockPluginDescriptor;
import fi.muikku.schooldata.entity.CourseIdentifier;

public class MockedCourseIdentifier implements CourseIdentifier {

	public MockedCourseIdentifier(String identifier, String code, String subjectIdentifier) {
		this.identifier = identifier;
		this.code = code;
		this.subjectIdentifier = subjectIdentifier;
	}

	@Override
	public String getSchoolDataSource() {
		return SchoolDataMockPluginDescriptor.SCHOOL_DATA_SOURCE;
	}

	@Override
	public String getIdentifier() {
		return identifier;
	}

	@Override
	public String getCode() {
		return code;
	}

	@Override
	public String getSubjectIdentifier() {
		return subjectIdentifier;
	}

	@Override
	public String getSubjectSchoolDataSource() {
		return SchoolDataMockPluginDescriptor.SCHOOL_DATA_SOURCE;
	}

	private String identifier;
	private String code;
	private String subjectIdentifier;
}
