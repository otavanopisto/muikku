package fi.otavanopisto.muikku.schooldata;

import java.util.Iterator;
import java.util.List;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.schooldata.entity.MatriculationEligibilities;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExam;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentChangeLogEntry;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentState;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationGrade;
import fi.otavanopisto.muikku.schooldata.entity.StudentMatriculationEligibilityOPS2021;

public class MatriculationSchoolDataController {

  @Inject
  @Any
  private Instance<MatriculationSchoolDataBridge> matriculationBridges;
  
  private static final String ACCEPTED_DATA_SOURCE = "PYRAMUS";

  private MatriculationSchoolDataBridge getMatriculationBridge() {
    Iterator<MatriculationSchoolDataBridge> iterator = matriculationBridges.iterator();
    while (iterator.hasNext()) {
      MatriculationSchoolDataBridge matriculationSchoolDataBridge = iterator.next();
      if (matriculationSchoolDataBridge.getSchoolDataSource().equals(ACCEPTED_DATA_SOURCE)) {
        return matriculationSchoolDataBridge;
      }
    }
    
    throw new SchoolDataBridgeException("Invalid data source for matriculation");
  }

  public Long getStudentId(SchoolDataIdentifier studentIdentifier) {
    return getMatriculationBridge().getStudentId(studentIdentifier);
  }

  public BridgeResponse<MatriculationEligibilities> listEligibilities(SchoolDataIdentifier studentIdentifier) {
    return getMatriculationBridge().listEligibilities(studentIdentifier);
  }
  
  public BridgeResponse<List<MatriculationExam>> listStudentsExams(SchoolDataIdentifier studentIdentifier, MatriculationExamListFilter type) {
    return getMatriculationBridge().listStudentsExams(studentIdentifier, type);
  }
  
  public BridgeResponse<MatriculationExamEnrollment> getEnrollment(SchoolDataIdentifier studentIdentifier, Long examId) {
    return getMatriculationBridge().getEnrollment(studentIdentifier, examId);
  }
  
  public BridgeResponse<List<MatriculationExamEnrollmentChangeLogEntry>> getEnrollmentChangeLog(SchoolDataIdentifier studentIdentifier, Long examId) {
    return getMatriculationBridge().getEnrollmentChangeLog(studentIdentifier, examId);
  }
  
  public BridgeResponse<MatriculationExamEnrollment> setEnrollmentState(SchoolDataIdentifier studentIdentifier, Long examId, MatriculationExamEnrollmentState newState) {
    return getMatriculationBridge().setEnrollmentState(studentIdentifier, examId, newState);
  }
  
  public MatriculationExamEnrollment createMatriculationExamEnrollment() {
    return getMatriculationBridge().createMatriculationExamEnrollment();
  }
  
  public BridgeResponse<MatriculationExamEnrollment> submitMatriculationExamEnrollment(SchoolDataIdentifier studentIdentifier, Long examId, MatriculationExamEnrollment enrollment) {
    return getMatriculationBridge().submitMatriculationExamEnrollment(studentIdentifier, examId, enrollment);
  }
  
  public MatriculationExamAttendance createMatriculationExamAttendance() {
    return getMatriculationBridge().createMatriculationExamAttendance();
  }

  public BridgeResponse<StudentMatriculationEligibilityOPS2021> getStudentMatriculationEligibility(SchoolDataIdentifier studentIdentifier, String subjectCode) {
    return getMatriculationBridge().getStudentMatriculationEligibility(studentIdentifier, subjectCode);
  }
  
  public BridgeResponse<List<MatriculationGrade>> listStudentsMatriculationGrades(SchoolDataIdentifier studentIdentifier) {
    return getMatriculationBridge().listStudentsGrades(studentIdentifier);
  }
  
}
