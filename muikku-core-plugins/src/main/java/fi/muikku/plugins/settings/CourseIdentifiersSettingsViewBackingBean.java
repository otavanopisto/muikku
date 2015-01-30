package fi.muikku.plugins.settings;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.schooldata.CourseMetaController;
import fi.muikku.schooldata.entity.CourseIdentifier;
import fi.muikku.schooldata.entity.Subject;

@Named
@Stateful
@RequestScoped
public class CourseIdentifiersSettingsViewBackingBean {

	@Inject
	private CourseMetaController courseMetaController; 
  
	// Subjects
	
	public List<Subject> getSubjects() {
		return courseMetaController.listSubjects();
	}
	
	public Subject getSubjectBySchoolDataSourceAndIdentifier(String schoolDataSource, String identifier) {
		return courseMetaController.findSubject(schoolDataSource, identifier);
	}
	
	// CourseIdentifiers
	
	public List<CourseIdentifier> getCourseIdentifiers() {
		return courseMetaController.listCourseIdentifiers();
	}

}