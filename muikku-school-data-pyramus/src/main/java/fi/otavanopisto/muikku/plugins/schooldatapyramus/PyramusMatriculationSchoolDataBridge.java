package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusMatriculationExam;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusMatriculationExamEnrollment;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusMatriculationExamEnrollmentChangeLogEntry;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.MatriculationExamListFilter;
import fi.otavanopisto.muikku.schooldata.MatriculationSchoolDataBridge;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeException;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationEligibilities;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExam;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentChangeLogEntry;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentChangeLogType;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentState;
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
        responseAsList.add(entry);
      }
    }
    
    return new BridgeResponse<List<MatriculationExamEnrollmentChangeLogEntry>>(response.getStatusCode(), responseAsList, response.getMessage());
  }

  @Override
  public BridgeResponse<MatriculationExamEnrollment> setEnrollmentState(SchoolDataIdentifier studentIdentifier, Long examId, String newState) {
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
  public void submitMatriculationExamEnrollment(Long examId,
      MatriculationExamEnrollment enrollment) {
    pyramusClient.post(String.format("/matriculation/exams/%d/enrollments", examId), enrollment);
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

}
