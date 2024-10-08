package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusMatriculationExam;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusMatriculationExamEnrollment;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusMatriculationExamEnrollmentChangeLogEntry;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusStudentMatriculationEligibilityOPS2021;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.MatriculationExamListFilter;
import fi.otavanopisto.muikku.schooldata.MatriculationSchoolDataBridge;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeException;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeInternalException;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationEligibilities;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExam;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentChangeLogEntry;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentChangeLogType;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentState;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamTerm;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationGrade;
import fi.otavanopisto.muikku.schooldata.entity.StudentMatriculationEligibilityOPS2021;
import fi.otavanopisto.pyramus.rest.model.matriculation.MatriculationExamEnrollmentChangeLog;

@Dependent
public class PyramusMatriculationSchoolDataBridge implements MatriculationSchoolDataBridge {

  @Inject
  private PyramusClient pyramusClient;
  
  @Inject
  private PyramusIdentifierMapper pyramusIdentifierMapper;

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public BridgeResponse<List<MatriculationExam>> listStudentsExams(SchoolDataIdentifier studentIdentifier, MatriculationExamListFilter type) {
    if (studentIdentifier == null || type == null) {
      throw new IllegalArgumentException();
    }
    
    Long pyramusStudentId = pyramusIdentifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    if (pyramusStudentId == null) {
      throw new IllegalArgumentException();
    }
    
    BridgeResponse<PyramusMatriculationExam[]> response = pyramusClient.responseGet(
        String.format("/matriculation/students/%d/exams?filter=%s", pyramusStudentId, type.name()), PyramusMatriculationExam[].class);
    
    List<MatriculationExam> exams = null;

    // Typecast the items to the MatriculationExam interface and swap from array to List
    if (response.getEntity() != null) {
      exams = new ArrayList<>();
      
      for (PyramusMatriculationExam exam : response.getEntity()) {
        exams.add(exam);
      }
    }
    
    return new BridgeResponse<List<MatriculationExam>>(response.getStatusCode(), exams, response.getMessage());
  }

  @Override
  public BridgeResponse<MatriculationExamEnrollment> getEnrollment(SchoolDataIdentifier studentIdentifier, Long examId) {
    if (studentIdentifier == null || examId == null) {
      throw new IllegalArgumentException();
    }
    
    Long pyramusStudentId = pyramusIdentifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    if (pyramusStudentId == null) {
      throw new IllegalArgumentException();
    }
    
    BridgeResponse<PyramusMatriculationExamEnrollment> response = pyramusClient.responseGet(String.format("/matriculation/students/%d/exams/%d/enrollment", pyramusStudentId, examId), 
        PyramusMatriculationExamEnrollment.class);
    return new BridgeResponse<MatriculationExamEnrollment>(response.getStatusCode(), response.getEntity(), response.getMessage());
  }
  
  @Override
  public BridgeResponse<List<MatriculationExamEnrollmentChangeLogEntry>> getEnrollmentChangeLog(SchoolDataIdentifier studentIdentifier,
      Long examId) {
    if (studentIdentifier == null || examId == null) {
      throw new IllegalArgumentException();
    }
    
    Long pyramusStudentId = pyramusIdentifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    if (pyramusStudentId == null) {
      throw new IllegalArgumentException();
    }
    
    BridgeResponse<MatriculationExamEnrollmentChangeLog[]> response = pyramusClient.responseGet(String.format("/matriculation/students/%d/exams/%d/enrollment/changelog", pyramusStudentId, examId), 
        MatriculationExamEnrollmentChangeLog[].class);
    
    List<MatriculationExamEnrollmentChangeLogEntry> responseAsList = null;
    
    if (response.getEntity() != null) {
      responseAsList = new ArrayList<>();
      
      for (MatriculationExamEnrollmentChangeLog changeLogEntry : response.getEntity()) {
        SchoolDataIdentifier modifierIdentifier = null;
        
        if (changeLogEntry.getModifierRoleClass() != null) {
          switch (changeLogEntry.getModifierRoleClass()) {
            case STAFF:
              modifierIdentifier = pyramusIdentifierMapper.getStaffIdentifier(changeLogEntry.getModifierId());
            break;
            case STUDENT:
              modifierIdentifier = pyramusIdentifierMapper.getStudentIdentifier(changeLogEntry.getModifierId());
            break;
            case STUDENT_PARENT:
              modifierIdentifier = pyramusIdentifierMapper.getStudentParentIdentifier(changeLogEntry.getModifierId());
            break;
          }
        }
        
        PyramusMatriculationExamEnrollmentChangeLogEntry entry = new PyramusMatriculationExamEnrollmentChangeLogEntry();
        entry.setId(changeLogEntry.getId());
        entry.setEnrollmentId(changeLogEntry.getEnrollmentId());
        entry.setTimestamp(changeLogEntry.getTimestamp());
        entry.setNewState(changeLogEntry.getNewState() != null ? MatriculationExamEnrollmentState.valueOf(changeLogEntry.getNewState().name()) : null);
        entry.setChangeType(changeLogEntry.getChangeType() != null ? MatriculationExamEnrollmentChangeLogType.valueOf(changeLogEntry.getChangeType().name()) : null);
        entry.setModifierIdentifier(modifierIdentifier);
        entry.setMessage(changeLogEntry.getMessage());
        responseAsList.add(entry);
      }
    }
    
    return new BridgeResponse<List<MatriculationExamEnrollmentChangeLogEntry>>(response.getStatusCode(), responseAsList, response.getMessage());
  }

  @Override
  public BridgeResponse<MatriculationExamEnrollment> setEnrollmentState(SchoolDataIdentifier studentIdentifier, Long examId, MatriculationExamEnrollmentState newState) {
    if (studentIdentifier == null || examId == null || newState == null) {
      throw new IllegalArgumentException();
    }
    
    Long pyramusStudentId = pyramusIdentifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    if (pyramusStudentId == null) {
      throw new IllegalArgumentException();
    }
    
    BridgeResponse<PyramusMatriculationExamEnrollment> response = pyramusClient.responsePut(
        String.format("/matriculation/students/%d/exams/%d/enrollment/state", pyramusStudentId, examId), 
        Entity.entity(newState, MediaType.APPLICATION_JSON), PyramusMatriculationExamEnrollment.class);
    return new BridgeResponse<MatriculationExamEnrollment>(response.getStatusCode(), response.getEntity(), response.getMessage());
  }
  
  @Override
  public MatriculationExamEnrollment createMatriculationExamEnrollment() {
    return new PyramusMatriculationExamEnrollment();
  }

  @Override
  public BridgeResponse<MatriculationExamEnrollment> submitMatriculationExamEnrollment(SchoolDataIdentifier studentIdentifier,
      Long examId, MatriculationExamEnrollment enrollment) {
    if (studentIdentifier == null || examId == null) {
      throw new IllegalArgumentException();
    }

    Long pyramusStudentId = pyramusIdentifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    if (pyramusStudentId == null) {
      throw new IllegalArgumentException();
    }
    
    BridgeResponse<PyramusMatriculationExamEnrollment> response = pyramusClient.responsePost(String.format("/matriculation/students/%d/exams/%d/enrollment", pyramusStudentId, examId), Entity.entity(enrollment, MediaType.APPLICATION_JSON), PyramusMatriculationExamEnrollment.class);
    return new BridgeResponse<MatriculationExamEnrollment>(response.getStatusCode(), response.getEntity(), response.getMessage());
  }

  @Override
  public MatriculationExamAttendance createMatriculationExamAttendance() {
    return new MatriculationExamAttendance();
  }

  @Override
  public Long getStudentId(SchoolDataIdentifier studentIdentifier) {
    if (!getSchoolDataSource().equals(studentIdentifier.getDataSource())) {
      throw new SchoolDataBridgeException("Invalid data source");
    }
    String identifier = studentIdentifier.getIdentifier();
    return pyramusIdentifierMapper.getPyramusStudentId(identifier);
  }

  @Override
  public BridgeResponse<MatriculationEligibilities> listEligibilities(SchoolDataIdentifier studentIdentifier) {
    if (studentIdentifier == null) {
      throw new IllegalArgumentException();
    }
    
    Long pyramusStudentId = pyramusIdentifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    if (pyramusStudentId == null) {
      throw new IllegalArgumentException();
    }
    
    return pyramusClient.responseGet(String.format("/matriculation/students/%d/eligibility", pyramusStudentId), MatriculationEligibilities.class);
  }

  @Override
  public BridgeResponse<StudentMatriculationEligibilityOPS2021> getStudentMatriculationEligibility(SchoolDataIdentifier studentIdentifier, String subjectCode) {
    if (!StringUtils.equals(studentIdentifier.getDataSource(), getSchoolDataSource())) {
      throw new SchoolDataBridgeInternalException(String.format("Could not evaluate students' matriculation eligibility from school data source %s", studentIdentifier.getDataSource()));
    }

    Long pyramusStudentId = pyramusIdentifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    if (pyramusStudentId != null) {
      BridgeResponse<fi.otavanopisto.pyramus.rest.model.StudentMatriculationEligibilityOPS2021> response = pyramusClient.responseGet(String.format("/matriculation/students/%d/matriculationEligibility?subjectCode=%s", pyramusStudentId, subjectCode), fi.otavanopisto.pyramus.rest.model.StudentMatriculationEligibilityOPS2021.class);
      if (response.ok()) {
        fi.otavanopisto.pyramus.rest.model.StudentMatriculationEligibilityOPS2021 entity = response.getEntity();
        PyramusStudentMatriculationEligibilityOPS2021 eligibility = new PyramusStudentMatriculationEligibilityOPS2021(entity.isEligible(), entity.getRequiredPassingGradeCourseCreditPoints(), entity.getPassingGradeCourseCreditPoints());
        return new BridgeResponse<StudentMatriculationEligibilityOPS2021>(response.getStatusCode(), eligibility, response.getMessage());
      }
      else {
        return new BridgeResponse<StudentMatriculationEligibilityOPS2021>(response.getStatusCode(), null, response.getMessage());
      }
    } else {
      throw new SchoolDataBridgeInternalException(String.format("Failed to resolve Pyramus user from studentIdentifier %s", studentIdentifier));
    }
  }

  @Override
  public BridgeResponse<List<MatriculationGrade>> listStudentsGrades(SchoolDataIdentifier studentIdentifier) {
    if (studentIdentifier == null) {
      throw new IllegalArgumentException();
    }
    
    Long pyramusStudentId = pyramusIdentifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    if (pyramusStudentId == null) {
      throw new IllegalArgumentException();
    }
    
    BridgeResponse<fi.otavanopisto.pyramus.rest.model.matriculation.MatriculationGrade[]> response = pyramusClient.responseGet(String.format("/matriculation/students/%d/results", pyramusStudentId), fi.otavanopisto.pyramus.rest.model.matriculation.MatriculationGrade[].class);

    List<MatriculationGrade> grades = null;

    // Typecast the items to the MatriculationExam interface and swap from array to List
    if (response.getEntity() != null) {
      grades = new ArrayList<>();
      
      for (fi.otavanopisto.pyramus.rest.model.matriculation.MatriculationGrade pyramusGrade : response.getEntity()) {
        MatriculationGrade grade = new MatriculationGrade();

        grade.setId(pyramusGrade.getId());
        grade.setSubject(pyramusGrade.getSubject() != null ? pyramusGrade.getSubject().name() : null);
        grade.setYear(pyramusGrade.getYear());
        grade.setTerm(translateTerm(pyramusGrade.getTerm()));
        grade.setGrade(pyramusGrade.getGrade() != null ? pyramusGrade.getGrade().name() : null);
        grade.setGradeDate(pyramusGrade.getGradeDate());
        
        grades.add(grade);
      }
    }
    
    return new BridgeResponse<List<MatriculationGrade>>(response.getStatusCode(), grades, response.getMessage());
  }

  private MatriculationExamTerm translateTerm(fi.otavanopisto.pyramus.matriculation.MatriculationExamTerm term) {
    if (term != null) {
      switch (term) {
        case AUTUMN:
          return MatriculationExamTerm.AUTUMN;
        case SPRING:
          return MatriculationExamTerm.SPRING;
      }
    }
    
    return null;
  }
  
}
