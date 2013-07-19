package fi.muikku.schooldata;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.schooldata.entity.CourseIdentifier;
import fi.muikku.schooldata.entity.Subject;

@Dependent
@Stateful
public class CourseMetaController {
	
	// TODO: Caching 
	// TODO: Events
	
	@Inject
	private Logger logger;
	
	@Inject
	@Any
	private Instance<CourseMetaSchoolDataBridge> courseMetaBridges;

	@Inject
	@SchoolDataBridgeEntityInitiator ( entity = Subject.class )
	private Instance<SchoolDataEntityInitiator<Subject>> subjectInitiators;
	
	@Inject
	@SchoolDataBridgeEntityInitiator ( entity = CourseIdentifier.class )
	private Instance<SchoolDataEntityInitiator<CourseIdentifier>> courseIdentifierInitiators;
	
	@Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;
	
	/* Subjects */

	public Subject findSubject(String schoolDataSource, String identifier) {
		SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
		if (dataSource != null) {
		  return findSubject(dataSource, identifier);
		} else {
  		logger.log(Level.SEVERE, "School Data Source could not be found by identifier:  " + schoolDataSource);
		}

		return null;
	}

	public Subject findSubject(SchoolDataSource schoolDataSource, String identifier) {
		CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(schoolDataSource);
		if (schoolDataBridge != null) {
			try {
				return initSubject(schoolDataBridge.findSubject(identifier));
			} catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
				logger.log(Level.SEVERE, "School Data Bridge reported a problem while findin a subject", e);
			}
		} else {
  		logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + schoolDataSource.getIdentifier());
		}
	
		return null;
  }
	
	public List<Subject> listSubjects() {
		List<Subject> result = new ArrayList<>();
		
		for (CourseMetaSchoolDataBridge courseMetaBridge : getCourseMetaBridges()) {
			try {
				result.addAll(courseMetaBridge.listSubjects());
			} catch (UnexpectedSchoolDataBridgeException e) {
				logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing subjects", e);
			}
		}
		
		return initSubjects(result);
	}
	
	/* CourseIdentifier */
	
	public CourseIdentifier findCourseIdentifier(SchoolDataSource schoolDataSource, String identifier) {
		CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(schoolDataSource);
		if (schoolDataBridge != null) {
			try {
				return initCourseIdentifier(schoolDataBridge.findCourseIdentifier(identifier));
			} catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
				logger.log(Level.SEVERE, "School Data Bridge reported a problem while finding a course identifier", e);
			}
		} else {
  		logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + schoolDataSource.getIdentifier());
		}
	
		return null;
  }

	public CourseIdentifier findCourseIdentifier(String schoolDataSource, String identifier) {
		SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
		if (dataSource != null) {
			 return initCourseIdentifier(findCourseIdentifier(dataSource, identifier));
		} else {
  		logger.log(Level.SEVERE, "School Data Source could not be found by identifier:  " + schoolDataSource);
		}

		return null;
	}
	
	public List<CourseIdentifier> listCourseIdentifiers() {
		List<CourseIdentifier> result = new ArrayList<>();
		
		for (CourseMetaSchoolDataBridge courseMetaBridge : getCourseMetaBridges()) {
			try {
				result.addAll(courseMetaBridge.listCourseIdentifiers());
			} catch (UnexpectedSchoolDataBridgeException e) {
				logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing course identifiers", e);
			} 
		}

		return initCourseIdentifiers(result);
	}
	
	public List<CourseIdentifier> listCourseIdentifiersBySubject(Subject subject) {
		SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(subject.getSchoolDataSource());
		if (schoolDataSource != null) {
			CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(schoolDataSource);
			if (schoolDataBridge != null) {
				try {
					return initCourseIdentifiers(schoolDataBridge.listCourseIdentifiersBySubject(subject.getIdentifier()));
				} catch (UnexpectedSchoolDataBridgeException e) {
					logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing course identifiers", e);
				} catch (SchoolDataBridgeRequestException e) {
					logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing course identifiers", e);
				}
			} else {
				logger.log(Level.SEVERE, "School Data Bridge not found: " + schoolDataSource.getIdentifier());
			}
		}

		return null;
	}
	
	private List<CourseMetaSchoolDataBridge> getCourseMetaBridges() {
		List<CourseMetaSchoolDataBridge> result = new ArrayList<>();
		
		Iterator<CourseMetaSchoolDataBridge> iterator = courseMetaBridges.iterator();
		while (iterator.hasNext()) {
			result.add(iterator.next());
		}
		
		return Collections.unmodifiableList(result);
	}
	
	private CourseMetaSchoolDataBridge getCourseMetaBridge(SchoolDataSource schoolDataSource) {
		Iterator<CourseMetaSchoolDataBridge> iterator = courseMetaBridges.iterator();
		while (iterator.hasNext()) {
			CourseMetaSchoolDataBridge schoolDataBridge = iterator.next();
			if (schoolDataBridge.getSchoolDataSource().equals(schoolDataSource.getIdentifier())) {
				return schoolDataBridge;
			}
		}
		
		return null;
	}

	/* Initiators */

	private Subject initSubject(Subject subject) {
		if (subject == null) {
			return null;
		}
		
		Iterator<SchoolDataEntityInitiator<Subject>> initiatorIterator = subjectInitiators.iterator();
		while (initiatorIterator.hasNext()) {
			subject = initiatorIterator.next().single(subject);
		}
		
		return subject;
	};
	
	private List<Subject> initSubjects(List<Subject> subjects) {
		if (subjects == null) {
			return null;
		}
		
		if (subjects.size() == 0) {
			return subjects;
		}
		
		Iterator<SchoolDataEntityInitiator<Subject>> initiatorIterator = subjectInitiators.iterator();
		while (initiatorIterator.hasNext()) {
			subjects = initiatorIterator.next().list(subjects);
		}
		
		return subjects;
	};

	private CourseIdentifier initCourseIdentifier(CourseIdentifier courseIdentifier) {
		if (courseIdentifier == null) {
			return null;
		}
		
		Iterator<SchoolDataEntityInitiator<CourseIdentifier>> initiatorIterator = courseIdentifierInitiators.iterator();
		while (initiatorIterator.hasNext()) {
			courseIdentifier = initiatorIterator.next().single(courseIdentifier);
		}
		
		return courseIdentifier;
	};
	
	private List<CourseIdentifier> initCourseIdentifiers(List<CourseIdentifier> courseIdentifiers) {
		if (courseIdentifiers == null) {
			return null;
		}
		
		if (courseIdentifiers.size() == 0) {
			return courseIdentifiers;
		}
		
		Iterator<SchoolDataEntityInitiator<CourseIdentifier>> initiatorIterator = courseIdentifierInitiators.iterator();
		while (initiatorIterator.hasNext()) {
			courseIdentifiers = initiatorIterator.next().list(courseIdentifiers);
		}
		
		return courseIdentifiers;
	};
}
