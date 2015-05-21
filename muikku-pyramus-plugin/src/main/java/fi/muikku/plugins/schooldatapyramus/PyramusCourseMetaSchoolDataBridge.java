package fi.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.plugins.schooldatapyramus.entities.PyramusCourseIdentifier;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusEducationType;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusSubject;
import fi.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.muikku.schooldata.CourseMetaSchoolDataBridge;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.entity.CourseIdentifier;
import fi.muikku.schooldata.entity.CourseLengthUnit;
import fi.muikku.schooldata.entity.EducationType;
import fi.muikku.schooldata.entity.Subject;
import fi.pyramus.rest.model.Course;

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
  public Subject findSubject(String identifier) throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    Long subjectId = pyramusIdentifierMapper.getPyramusSubjectId(identifier);

    return createSubjectEntity(pyramusClient.get("/common/subjects/" + subjectId, fi.pyramus.rest.model.Subject.class));
  }

  @Override
  public List<Subject> listSubjects() throws UnexpectedSchoolDataBridgeException {
    fi.pyramus.rest.model.Subject[] subjects = pyramusClient.get("/common/subjects/",
        fi.pyramus.rest.model.Subject[].class);
    if (subjects == null) {
      throw new UnexpectedSchoolDataBridgeException("Null response");
    }

    return createSubjectEntities(subjects);
  }

  @Override
  public CourseIdentifier findCourseIdentifier(String identifier) throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    
    if (StringUtils.isBlank(identifier)) {
      return null;
    }

    if (identifier.indexOf("/") == -1)
      throw new SchoolDataBridgeRequestException("Invalid CourseIdentifierId");
    
    String[] idParts = identifier.split("/");
  
    fi.pyramus.rest.model.Subject subject = pyramusClient.get("/common/subjects/" + idParts[0],
        fi.pyramus.rest.model.Subject.class);

    return new PyramusCourseIdentifier(identifier, subject.getCode() + idParts[1], subject.getId().toString());
  }

  @Override
  public List<CourseIdentifier> listCourseIdentifiers() throws UnexpectedSchoolDataBridgeException {
    List<CourseIdentifier> result = new ArrayList<>();

    fi.pyramus.rest.model.Subject[] subjects = pyramusClient.get("/common/subjects/",
        fi.pyramus.rest.model.Subject[].class);
    if (subjects == null) {
      throw new UnexpectedSchoolDataBridgeException("Null response");
    }

    // TODO Ugly workaround to Pyramus Course IDs

    for (fi.pyramus.rest.model.Subject subject : subjects) {
      List<String> courseNumbers = new ArrayList<String>();
      String identifier = subject.getId().toString();
      Course[] courses = pyramusClient.get("/common/subjects/" + identifier + "/courses",
          fi.pyramus.rest.model.Course[].class);

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
  public List<CourseIdentifier> listCourseIdentifiersBySubject(String subjectIdentifier)
      throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    if (!StringUtils.isNumeric(subjectIdentifier)) {
      throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
    }

    // TODO Fix workaround

    fi.pyramus.rest.model.Subject subject = pyramusClient.get("/common/subjects/" + subjectIdentifier,
        fi.pyramus.rest.model.Subject.class);

    List<CourseIdentifier> result = new ArrayList<>();
    List<String> courseNumbers = new ArrayList<String>();
    String identifier = subject.getId().toString();
    Course[] courses = pyramusClient.get("/common/subjects/" + identifier + "/courses",
        fi.pyramus.rest.model.Course[].class);

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

  private Subject createSubjectEntity(fi.pyramus.rest.model.Subject s) {
    if (s == null) {
      return null;
    }

    return new PyramusSubject(s.getId().toString(), s.getName());
  }

  private List<Subject> createSubjectEntities(fi.pyramus.rest.model.Subject[] subjects) {
    List<Subject> subs = new ArrayList<Subject>();

    for (fi.pyramus.rest.model.Subject s : subjects) {
      subs.add(createSubjectEntity(s));
    }

    return subs;
  }

  @Override
  public EducationType findEducationType(String identifier) throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    Long educationTypeId = pyramusIdentifierMapper.getPyramusEducationTypeId(identifier);
    fi.pyramus.rest.model.EducationType restEducationType = pyramusClient.get("/common/educationTypes/" + educationTypeId, fi.pyramus.rest.model.EducationType.class);
    
    return new PyramusEducationType(identifier, restEducationType.getName());
  }
  
  @Override
  public CourseLengthUnit findCourseLengthUnit(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    Long educationalTimeUnitId = pyramusIdentifierMapper.getPyramusEducationalTimeUnitId(identifier);
    if (educationalTimeUnitId != null) {
      return pyramusSchoolDataEntityFactory.getCourseLengthUnit(pyramusClient.get("/common/educationalTimeUnits/" + educationalTimeUnitId, fi.pyramus.rest.model.EducationalTimeUnit.class));
    }
    
    return null;
  }

}
