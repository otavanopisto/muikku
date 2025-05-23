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
  public Subject findSubjectByCode(String code) {
    return createSubjectEntity(pyramusClient.get("/common/subjectByCode/" + code, fi.otavanopisto.pyramus.rest.model.Subject.class));
  }
  
  @Override
  public Subject findSubject(String identifier) {
    Long subjectId = pyramusIdentifierMapper.getPyramusSubjectId(identifier);

    return createSubjectEntity(pyramusClient.get("/common/subjects/" + subjectId, fi.otavanopisto.pyramus.rest.model.Subject.class));
  }

  @Override
  public List<Subject> listSubjects() {
    fi.otavanopisto.pyramus.rest.model.Subject[] subjects = pyramusClient.get("/common/subjects/", fi.otavanopisto.pyramus.rest.model.Subject[].class);
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

  private Subject createSubjectEntity(fi.otavanopisto.pyramus.rest.model.Subject s) {
    if (s == null) {
      return null;
    }

    return new PyramusSubject(s.getId().toString(), s.getName(), s.getCode());
  }

  private List<Subject> createSubjectEntities(fi.otavanopisto.pyramus.rest.model.Subject[] subjects) {
    List<Subject> subs = new ArrayList<Subject>();

    if (subjects != null) {
      for (fi.otavanopisto.pyramus.rest.model.Subject s : subjects) {
        subs.add(createSubjectEntity(s));
      }
    }

    return subs;
  }

  @Override
  public EducationType findEducationType(String identifier) {
    Long educationTypeId = pyramusIdentifierMapper.getPyramusEducationTypeId(identifier);
    fi.otavanopisto.pyramus.rest.model.EducationType restEducationType = pyramusClient.get("/common/educationTypes/" + educationTypeId, fi.otavanopisto.pyramus.rest.model.EducationType.class);
    if (restEducationType != null) {
      return new PyramusEducationType(new SchoolDataIdentifier(identifier, getSchoolDataSource()), restEducationType.getName(), restEducationType.getCode());
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
        result.add(new PyramusEducationType(identifier, type.getName(), type.getCode())); 
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
