package fi.otavanopisto.muikku.schooldata.entity;

public interface CourseIdentifier extends SchoolDataEntity {

	public String getIdentifier();
	
	public String getCode();
	
	public String getSubjectIdentifier();
	
	public String getSubjectSchoolDataSource();
	
}