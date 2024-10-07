package fi.otavanopisto.muikku.schooldata;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.schooldata.entity.CourseLengthUnit;
import fi.otavanopisto.muikku.schooldata.entity.Curriculum;
import fi.otavanopisto.muikku.schooldata.entity.EducationType;
import fi.otavanopisto.muikku.schooldata.entity.Subject;

@ApplicationScoped
public class CourseMetaController {

  @Inject
  private Logger logger;

  @Inject
  @Any
  private Instance<CourseMetaSchoolDataBridge> courseMetaBridges;
  
  private ConcurrentHashMap<SchoolDataIdentifier, Subject> subjectIdentifierCache;
  private ConcurrentHashMap<String, Subject> subjectCodeCache;
  private ConcurrentHashMap<SchoolDataIdentifier, CourseLengthUnit> courseLengthUnitCache;
  private ConcurrentHashMap<SchoolDataIdentifier, Curriculum> curriculumCache;
  private ConcurrentHashMap<SchoolDataIdentifier, EducationType> educationTypeCache;
  
  @PostConstruct
  public void init() {
    subjectIdentifierCache = new ConcurrentHashMap<>();
    subjectCodeCache = new ConcurrentHashMap<>();
    courseLengthUnitCache = new ConcurrentHashMap<>();
    curriculumCache = new ConcurrentHashMap<>();
    educationTypeCache = new ConcurrentHashMap<>();
  }

  /* Subjects */

  public Subject findSubjectByCode(String schoolDataSource, String code) {
    if (!subjectCodeCache.containsKey(code)) {
      Subject subject = null;
      CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        subject = schoolDataBridge.findSubjectByCode(code);
        subjectCodeCache.put(code, subject);
        if (subject != null) {
          subjectIdentifierCache.put(subject.schoolDataIdentifier(), subject);
        }
      }
    }
    return subjectCodeCache.get(code);
  }
  
  public Subject findSubject(SchoolDataIdentifier identifier) {
    if (!subjectIdentifierCache.containsKey(identifier)) {
      Subject subject = null;
      CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(identifier.getDataSource());
      if (schoolDataBridge != null) {
        subject = schoolDataBridge.findSubject(identifier.getIdentifier());
        if (subject != null) {
          subjectCodeCache.put(subject.getCode(), subject);
        }
      }
      subjectIdentifierCache.put(identifier, subject);
    }
    return subjectIdentifierCache.get(identifier);
  }

  public List<Subject> listSubjects() {
    List<Subject> result = new ArrayList<>();

    for (CourseMetaSchoolDataBridge courseMetaBridge : getCourseMetaBridges()) {
      try {
        result.addAll(courseMetaBridge.listSubjects());
        for (Subject subject : result) {
          subjectIdentifierCache.put(subject.schoolDataIdentifier(), subject);
          subjectCodeCache.put(subject.getCode(), subject);
        }
      }
      catch (SchoolDataBridgeInternalException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing subjects", e);
      }
    }

    return result;
  }

  /* EducationType */

  public EducationType findEducationType(SchoolDataIdentifier identifier) {
    if (!educationTypeCache.containsKey(identifier)) {
      EducationType educationType = null;
      CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(identifier.getDataSource());
      if (schoolDataBridge != null) {
        educationType = schoolDataBridge.findEducationType(identifier.getIdentifier());
      }
      educationTypeCache.put(identifier, educationType);
    }
    return educationTypeCache.get(identifier);
  }

  public List<EducationType> listEducationTypes() {
    List<EducationType> result = new ArrayList<>();

    for (CourseMetaSchoolDataBridge courseMetaBridge : getCourseMetaBridges()) {
      result.addAll(courseMetaBridge.listEducationTypes());
      for (EducationType educationType : result) {
        educationTypeCache.put(educationType.getIdentifier(), educationType);
      }
    }

    return result;
  }

  /* CourseLenthUnit */

  public CourseLengthUnit findCourseLengthUnit(SchoolDataIdentifier identifier) {
    if (!courseLengthUnitCache.containsKey(identifier)) {
      CourseLengthUnit courseLengthUnit = null;
      CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(identifier.getDataSource());
      if (schoolDataBridge != null) {
        courseLengthUnit = schoolDataBridge.findCourseLengthUnit(identifier.getIdentifier());
      }
      courseLengthUnitCache.put(identifier, courseLengthUnit);
    }
    return courseLengthUnitCache.get(identifier);
  }

  private List<CourseMetaSchoolDataBridge> getCourseMetaBridges() {
    List<CourseMetaSchoolDataBridge> result = new ArrayList<>();

    Iterator<CourseMetaSchoolDataBridge> iterator = courseMetaBridges.iterator();
    while (iterator.hasNext()) {
      result.add(iterator.next());
    }

    return Collections.unmodifiableList(result);
  }
  
  private CourseMetaSchoolDataBridge getCourseMetaBridge(String schoolDataSource) {
    Iterator<CourseMetaSchoolDataBridge> iterator = courseMetaBridges.iterator();
    while (iterator.hasNext()) {
      CourseMetaSchoolDataBridge schoolDataBridge = iterator.next();
      if (schoolDataBridge.getSchoolDataSource().equals(schoolDataSource)) {
        return schoolDataBridge;
      }
    }
    return null;
  }

  /* Curriculum */

  public Curriculum findCurriculum(SchoolDataIdentifier identifier) {
    if (!curriculumCache.containsKey(identifier)) {
      Curriculum curriculum = null;
      CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(identifier.getDataSource());
      if (schoolDataBridge != null) {
        curriculum = schoolDataBridge.findCurriculum(identifier.getIdentifier());
      }
      curriculumCache.put(identifier, curriculum);
    }
    return curriculumCache.get(identifier);
  }

  public List<Curriculum> listCurriculums() {
    List<Curriculum> result = new ArrayList<>();

    for (CourseMetaSchoolDataBridge courseMetaBridge : getCourseMetaBridges()) {
      result.addAll(courseMetaBridge.listCurriculums());
      for (Curriculum curriculum : result) {
        curriculumCache.put(curriculum.getIdentifier(), curriculum);
      }
    }

    return result;
  }

  public String getCurriculumName(SchoolDataIdentifier curriculumIdentifier) {
    if (curriculumIdentifier != null) {
      Curriculum curriculum = findCurriculum(curriculumIdentifier);
      return curriculum == null ? null : curriculum.getName();
    }
    return null;
  }

}