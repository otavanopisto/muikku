package fi.otavanopisto.muikku.schooldata;

import java.util.List;

import fi.otavanopisto.muikku.schooldata.entity.CourseIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.CourseLengthUnit;
import fi.otavanopisto.muikku.schooldata.entity.Curriculum;
import fi.otavanopisto.muikku.schooldata.entity.EducationType;
import fi.otavanopisto.muikku.schooldata.entity.Subject;

public interface CourseMetaSchoolDataBridge {
	
	public String getSchoolDataSource();
	
	/* Subjects */
	
	public Subject findSubject(String identifier);
	public List<Subject> listSubjects();
	
	/* CourseIdentifier */

	public CourseIdentifier findCourseIdentifier(String identifier);
	public List<CourseIdentifier> listCourseIdentifiers();
	public List<CourseIdentifier> listCourseIdentifiersBySubject(String subjectIdentifier);
	
	/* EducationType */
	
	public EducationType findEducationType(String identifier);
	public List<EducationType> listEducationTypes();
  
	/* CourseLengthUnit */

  public CourseLengthUnit findCourseLengthUnit(String identifier);
  
  /* Curriculum */
  
  public Curriculum findCurriculum(String identifier);
  public List<Curriculum> listCurriculums();

}