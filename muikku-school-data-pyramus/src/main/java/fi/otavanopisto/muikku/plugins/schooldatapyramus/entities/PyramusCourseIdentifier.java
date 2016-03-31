package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.CourseIdentifier;

public class PyramusCourseIdentifier implements CourseIdentifier {

	public PyramusCourseIdentifier(String identifier, String code, String subjectIdentifier) {
		this.identifier = identifier;
		this.code = code;
		this.subjectIdentifier = subjectIdentifier;
	}

	@Override
	public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
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
		return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
	}

	private String identifier;
	private String code;
	private String subjectIdentifier;
}
