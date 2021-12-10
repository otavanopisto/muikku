package fi.otavanopisto.muikku.schooldata;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.schooldata.entity.CourseIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.CourseLengthUnit;
import fi.otavanopisto.muikku.schooldata.entity.Curriculum;
import fi.otavanopisto.muikku.schooldata.entity.EducationType;
import fi.otavanopisto.muikku.schooldata.entity.Subject;

public class CourseMetaController {
  
  // TODO: Caching 
  // TODO: Events
  
  @Inject
  private Logger logger;
  
  @Inject
  @Any
  private Instance<CourseMetaSchoolDataBridge> courseMetaBridges;

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
      return schoolDataBridge.findSubject(identifier);
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
      } catch (SchoolDataBridgeInternalException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing subjects", e);
      }
    }
    
    return result;
  }
  
  /* EducationType */

  public EducationType findEducationType(SchoolDataIdentifier identifier) {
    return findEducationType(identifier.getDataSource(), identifier.getIdentifier());
  }
   
  public EducationType findEducationType(String schoolDataSource, String identifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource != null) {
      return findEducationType(dataSource, identifier);
    } else {
      logger.log(Level.SEVERE, "School Data Source could not be found by identifier:  " + schoolDataSource);
    }

    return null;
  }

  public EducationType findEducationType(SchoolDataSource schoolDataSource, String identifier) {
    CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.findEducationType(identifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + schoolDataSource.getIdentifier());
    }
  
    return null;
  }

  public List<EducationType> listEducationTypes() {
    List<EducationType> result = new ArrayList<>();
    
    for (CourseMetaSchoolDataBridge courseMetaBridge : getCourseMetaBridges()) {
      result.addAll(courseMetaBridge.listEducationTypes());
    }

    return result;
  }
  
  /* CourseLenthUnit */
  
  public CourseLengthUnit findCourseLengthUnit(String schoolDataSource, String identifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource != null) {
      return findCourseLengthUnit(dataSource, identifier);
    } else {
      logger.log(Level.SEVERE, "School Data Source could not be found by identifier:  " + schoolDataSource);
    }

    return null;
  }

  public CourseLengthUnit findCourseLengthUnit(SchoolDataSource schoolDataSource, String identifier) {
    CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.findCourseLengthUnit(identifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + schoolDataSource.getIdentifier());
    }
  
    return null;
  }
  
  /* CourseIdentifier */
  
  public CourseIdentifier findCourseIdentifier(SchoolDataSource schoolDataSource, String identifier) {
    CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.findCourseIdentifier(identifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + schoolDataSource.getIdentifier());
    }
  
    return null;
  }

  public CourseIdentifier findCourseIdentifier(String schoolDataSource, String identifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource != null) {
      return findCourseIdentifier(dataSource, identifier);
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
      } catch (SchoolDataBridgeInternalException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing course identifiers", e);
      } 
    }

    return result;
  }
  
  public List<CourseIdentifier> listCourseIdentifiersBySubject(Subject subject) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(subject.getSchoolDataSource());
    if (schoolDataSource != null) {
      CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        return schoolDataBridge.listCourseIdentifiersBySubject(subject.getIdentifier());
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

  /* Curriculum */

  public Curriculum findCurriculum(SchoolDataIdentifier identifier) {
    return findCurriculum(identifier.getDataSource(), identifier.getIdentifier());
  }
   
  public Curriculum findCurriculum(String schoolDataSource, String identifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource != null) {
      return findCurriculum(dataSource, identifier);
    } else {
      logger.log(Level.SEVERE, "School Data Source could not be found by identifier:  " + schoolDataSource);
    }

    return null;
  }

  public Curriculum findCurriculum(SchoolDataSource schoolDataSource, String identifier) {
    CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.findCurriculum(identifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + schoolDataSource.getIdentifier());
    }
  
    return null;
  }

  public List<Curriculum> listCurriculums() {
    List<Curriculum> result = new ArrayList<>();
    
    for (CourseMetaSchoolDataBridge courseMetaBridge : getCourseMetaBridges()) {
      result.addAll(courseMetaBridge.listCurriculums());
    }

    return result;
  }
  
}
