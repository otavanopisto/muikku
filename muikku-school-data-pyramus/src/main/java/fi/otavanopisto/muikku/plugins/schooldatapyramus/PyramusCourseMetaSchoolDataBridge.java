package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusCourseIdentifier;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusCurriculum;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusEducationType;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusSubject;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.otavanopisto.muikku.schooldata.CourseMetaSchoolDataBridge;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeInternalException;
import fi.otavanopisto.muikku.schooldata.entity.CourseIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.CourseLengthUnit;
import fi.otavanopisto.muikku.schooldata.entity.Curriculum;
import fi.otavanopisto.muikku.schooldata.entity.EducationType;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.pyramus.rest.model.Course;

public class PyramusCourseMetaSchoolDataBridge implements CourseMetaSchoolDataBridge {

  @Inject
  private PyramusClient pyramusClient;

  @Inject
  private PyramusIdentifierMapper pyramusIdentifierMapper;

  @Inject
  private PyramusSchoolDataEntityFactory pyramusSchoolDataEntityFactory;

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public Subject findSubject(String identifier) {
    Long subjectId = pyramusIdentifierMapper.getPyramusSubjectId(identifier);

    return createSubjectEntity(pyramusClient.get("/common/subjects/" + subjectId, fi.otavanopisto.pyramus.rest.model.Subject.class));
  }

  @Override
  public List<Subject> listSubjects() {
    fi.otavanopisto.pyramus.rest.model.Subject[] subjects = pyramusClient.get("/common/subjects/",
        fi.otavanopisto.pyramus.rest.model.Subject[].class);
    if (subjects == null) {
      throw new SchoolDataBridgeInternalException("Null response");
    }

    return createSubjectEntities(subjects);
  }

  @Override
  public CourseIdentifier findCourseIdentifier(String identifier) {
    
    if (StringUtils.isBlank(identifier)) {
      return null;
    }

    if (identifier.indexOf("/") == -1)
      throw new SchoolDataBridgeInternalException("Invalid CourseIdentifierId");
    
    String[] idParts = identifier.split("/");
  
    fi.otavanopisto.pyramus.rest.model.Subject subject = pyramusClient.get("/common/subjects/" + idParts[0],
        fi.otavanopisto.pyramus.rest.model.Subject.class);

    return new PyramusCourseIdentifier(identifier, subject.getCode() + idParts[1], subject.getId().toString());
  }

  @Override
  public List<CourseIdentifier> listCourseIdentifiers() {
    List<CourseIdentifier> result = new ArrayList<>();

    fi.otavanopisto.pyramus.rest.model.Subject[] subjects = pyramusClient.get("/common/subjects/",
        fi.otavanopisto.pyramus.rest.model.Subject[].class);
    if (subjects == null) {
      throw new SchoolDataBridgeInternalException("Null response");
    }

    // TODO Ugly workaround to Pyramus Course IDs

    for (fi.otavanopisto.pyramus.rest.model.Subject subject : subjects) {
      List<String> courseNumbers = new ArrayList<String>();
      String identifier = subject.getId().toString();
      Course[] courses = pyramusClient.get("/common/subjects/" + identifier + "/courses",
          fi.otavanopisto.pyramus.rest.model.Course[].class);

      for (Course course : courses) {
        String courseNumber = course.getCourseNumber() != null ? course.getCourseNumber().toString() : "null";

        if (!courseNumbers.contains(courseNumber))
          courseNumbers.add(courseNumber);
      }

      for (String cn : courseNumbers) {
        result.add(new PyramusCourseIdentifier(subject.getId().toString() + "/" + cn, subject.getCode(), subject
            .getId().toString()));
      }
    }

    return result;
  }

  @Override
  public List<CourseIdentifier> listCourseIdentifiersBySubject(String subjectIdentifier) {
    if (!StringUtils.isNumeric(subjectIdentifier)) {
      throw new SchoolDataBridgeInternalException("Identifier has to be numeric");
    }

    // TODO Fix workaround

    fi.otavanopisto.pyramus.rest.model.Subject subject = pyramusClient.get("/common/subjects/" + subjectIdentifier,
        fi.otavanopisto.pyramus.rest.model.Subject.class);

    List<CourseIdentifier> result = new ArrayList<>();
    List<String> courseNumbers = new ArrayList<String>();
    String identifier = subject.getId().toString();
    Course[] courses = pyramusClient.get("/common/subjects/" + identifier + "/courses",
        fi.otavanopisto.pyramus.rest.model.Course[].class);

    for (Course course : courses) {
      String courseNumber = course.getCourseNumber() != null ? course.getCourseNumber().toString() : "null";

      if (!courseNumbers.contains(courseNumber))
        courseNumbers.add(courseNumber);
    }

    for (String cn : courseNumbers) {
      result.add(new PyramusCourseIdentifier(subject.getId().toString() + "/" + cn, subject.getCode(), subject.getId()
          .toString()));
    }

    return result;
  }

  private Subject createSubjectEntity(fi.otavanopisto.pyramus.rest.model.Subject s) {
    if (s == null) {
      return null;
    }

    return new PyramusSubject(s.getId().toString(), s.getName());
  }

  private List<Subject> createSubjectEntities(fi.otavanopisto.pyramus.rest.model.Subject[] subjects) {
    List<Subject> subs = new ArrayList<Subject>();

    for (fi.otavanopisto.pyramus.rest.model.Subject s : subjects) {
      subs.add(createSubjectEntity(s));
    }

    return subs;
  }

  @Override
  public EducationType findEducationType(String identifier) {
    Long educationTypeId = pyramusIdentifierMapper.getPyramusEducationTypeId(identifier);
    fi.otavanopisto.pyramus.rest.model.EducationType restEducationType = pyramusClient.get("/common/educationTypes/" + educationTypeId, fi.otavanopisto.pyramus.rest.model.EducationType.class);
    if (restEducationType != null) {
      return new PyramusEducationType(new SchoolDataIdentifier(identifier, getSchoolDataSource()), restEducationType.getName());
    }
    
    return null;
  }

  @Override
  public List<EducationType> listEducationTypes() {
    List<EducationType> result = new ArrayList<>();
    
    fi.otavanopisto.pyramus.rest.model.EducationType[] types = pyramusClient.get("/common/educationTypes", fi.otavanopisto.pyramus.rest.model.EducationType[].class);
    if (types != null) {
      for (fi.otavanopisto.pyramus.rest.model.EducationType type : types) {
        SchoolDataIdentifier identifier = pyramusIdentifierMapper.getEducationTypeIdentifier(type.getId());
        result.add(new PyramusEducationType(identifier, type.getName())); 
      }
    }
    
    return result;
  }
  
  @Override
  public CourseLengthUnit findCourseLengthUnit(String identifier) {
    Long educationalTimeUnitId = pyramusIdentifierMapper.getPyramusEducationalTimeUnitId(identifier);
    if (educationalTimeUnitId != null) {
      return pyramusSchoolDataEntityFactory.getCourseLengthUnit(pyramusClient.get("/common/educationalTimeUnits/" + educationalTimeUnitId, fi.otavanopisto.pyramus.rest.model.EducationalTimeUnit.class));
    }
    
    return null;
  }

  @Override
  public Curriculum findCurriculum(String identifier) {
    Long curriculumId = pyramusIdentifierMapper.getPyramusCurriculumId(identifier);
    fi.otavanopisto.pyramus.rest.model.Curriculum curriculum = pyramusClient.get("/common/curriculums/" + curriculumId, fi.otavanopisto.pyramus.rest.model.Curriculum.class);
    if (curriculum != null) {
      return new PyramusCurriculum(new SchoolDataIdentifier(identifier, getSchoolDataSource()), curriculum.getName());
    }
    
    return null;
  }

  @Override
  public List<Curriculum> listCurriculums() {
    List<Curriculum> result = new ArrayList<>();
    
    fi.otavanopisto.pyramus.rest.model.Curriculum[] curriculums = pyramusClient.get("/common/curriculums?filterArchived=true", fi.otavanopisto.pyramus.rest.model.Curriculum[].class);
    if (curriculums != null) {
      for (fi.otavanopisto.pyramus.rest.model.Curriculum curriculum : curriculums) {
        SchoolDataIdentifier identifier = pyramusIdentifierMapper.getCurriculumIdentifier(curriculum.getId());
        result.add(new PyramusCurriculum(identifier, curriculum.getName())); 
      }
    }
    
    return result;
  }

}
