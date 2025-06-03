package fi.otavanopisto.muikku.schooldata;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentSkipListSet;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

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
  private ConcurrentSkipListSet<String> unknownSubjectCodes;
  private ConcurrentSkipListSet<SchoolDataIdentifier> unknownSubjects;
  private ConcurrentSkipListSet<SchoolDataIdentifier> unknownCurriculums;
  private ConcurrentSkipListSet<SchoolDataIdentifier> unknownEducationTypes;
  private ConcurrentSkipListSet<SchoolDataIdentifier> unknownCourseLengthUnits;
  
  @PostConstruct
  public void init() {
    subjectIdentifierCache = new ConcurrentHashMap<>();
    subjectCodeCache = new ConcurrentHashMap<>();
    courseLengthUnitCache = new ConcurrentHashMap<>();
    curriculumCache = new ConcurrentHashMap<>();
    educationTypeCache = new ConcurrentHashMap<>();
    unknownSubjectCodes = new ConcurrentSkipListSet<>();
    unknownSubjects = new ConcurrentSkipListSet<>();
    unknownCurriculums = new ConcurrentSkipListSet<>();
    unknownEducationTypes = new ConcurrentSkipListSet<>();
    unknownCourseLengthUnits = new ConcurrentSkipListSet<>();
  }
  
  public List<SchoolDataIdentifier> educationTypeCodeToIdentifiers(String code) {
    listEducationTypes(); // populate cache
    List<SchoolDataIdentifier> identifiers = new ArrayList<>();
    Enumeration<SchoolDataIdentifier> e = educationTypeCache.keys();
    while (e.hasMoreElements()) {
      SchoolDataIdentifier sdi = e.nextElement();
      EducationType et = educationTypeCache.get(sdi);
      if (StringUtils.equals(code, et.getCode())) {
        identifiers.add(sdi);
      }
    }
    return identifiers;
  }

  public SchoolDataIdentifier opsNameToIdentifier(String ops) {
    listCurriculums(); // populate cache
    Enumeration<SchoolDataIdentifier> e = curriculumCache.keys();
    while (e.hasMoreElements()) {
      SchoolDataIdentifier sdi = e.nextElement();
      Curriculum c = curriculumCache.get(sdi);
      if (StringUtils.equals(ops, c.getName())) {
        return sdi;
      }
    }
    return null;
  }

  /* Subjects */

  public Subject findSubjectByCode(String schoolDataSource, String code) {
    if (StringUtils.isAnyEmpty(schoolDataSource, code) || unknownSubjectCodes.contains(code)) {
      return null;
    }
    if (!subjectCodeCache.containsKey(code)) {
      Subject subject = null;
      CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        subject = schoolDataBridge.findSubjectByCode(code);
        if (subject != null) {
          subjectCodeCache.put(code, subject);
          subjectIdentifierCache.put(subject.schoolDataIdentifier(), subject);
        }
        else {
          unknownSubjectCodes.add(code);
        }
      }
    }
    return subjectCodeCache.get(code);
  }
  
  public Subject findSubject(SchoolDataIdentifier identifier) {
    if (identifier == null || unknownSubjects.contains(identifier)) {
      return null;
    }
    if (!subjectIdentifierCache.containsKey(identifier)) {
      Subject subject = null;
      CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(identifier.getDataSource());
      if (schoolDataBridge != null) {
        subject = schoolDataBridge.findSubject(identifier.getIdentifier());
        if (subject != null) {
          subjectCodeCache.put(subject.getCode(), subject);
          subjectIdentifierCache.put(identifier, subject);
        }
        else {
          unknownSubjects.add(identifier);
        }
      }
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
    if (identifier == null || unknownEducationTypes.contains(identifier)) {
      return null;
    }
    if (!educationTypeCache.containsKey(identifier)) {
      EducationType educationType = null;
      CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(identifier.getDataSource());
      if (schoolDataBridge != null) {
        educationType = schoolDataBridge.findEducationType(identifier.getIdentifier());
        if (educationType != null) {
          educationTypeCache.put(identifier, educationType);
        }
        else {
          unknownEducationTypes.add(identifier);
        }
      }
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
    if (identifier == null || unknownCourseLengthUnits.contains(identifier)) {
      return null;
    }
    if (!courseLengthUnitCache.containsKey(identifier)) {
      CourseLengthUnit courseLengthUnit = null;
      CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(identifier.getDataSource());
      if (schoolDataBridge != null) {
        courseLengthUnit = schoolDataBridge.findCourseLengthUnit(identifier.getIdentifier());
        if (courseLengthUnit != null) {
          courseLengthUnitCache.put(identifier, courseLengthUnit);
        }
        else {
          unknownCourseLengthUnits.add(identifier);
        }
      }
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
    if (identifier == null || unknownCurriculums.contains(identifier)) {
      return null;
    }
    if (!curriculumCache.containsKey(identifier)) {
      Curriculum curriculum = null;
      CourseMetaSchoolDataBridge schoolDataBridge = getCourseMetaBridge(identifier.getDataSource());
      if (schoolDataBridge != null) {
        curriculum = schoolDataBridge.findCurriculum(identifier.getIdentifier());
        if (curriculum != null) {
          curriculumCache.put(identifier, curriculum);
        }
        else {
          unknownCurriculums.add(identifier);
        }
      }
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

  public String getCurriculumName(SchoolDataIdentifier identifier) {
    if (identifier != null) {
      Curriculum curriculum = findCurriculum(identifier);
      return curriculum == null ? null : curriculum.getName();
    }
    return null;
  }

}