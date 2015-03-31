package fi.muikku.schooldata;

import java.util.List;

import fi.muikku.schooldata.entity.CourseIdentifier;
import fi.muikku.schooldata.entity.CourseLengthUnit;
import fi.muikku.schooldata.entity.EducationType;
import fi.muikku.schooldata.entity.Subject;

public interface CourseMetaSchoolDataBridge {
	
	/**
	 * Returns school data source identifier
	 * 
	 * @return school data source identifier
	 */
	public String getSchoolDataSource();
	
	/* Subjects */
	
	public Subject findSubject(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	public List<Subject> listSubjects() throws UnexpectedSchoolDataBridgeException;
	
	/* CourseIdentifier */

	public CourseIdentifier findCourseIdentifier(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

	public List<CourseIdentifier> listCourseIdentifiers() throws UnexpectedSchoolDataBridgeException;

	public List<CourseIdentifier> listCourseIdentifiersBySubject(String subjectIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/* EducationType */
	
	public EducationType findEducationType(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/* CourseLengthUnit */

  public CourseLengthUnit findCourseLengthUnit(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
}