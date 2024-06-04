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
  
  public BridgeResponse<MatriculationExamEnrollment> setEnrollmentState(SchoolDataIdentifier studentIdentifier, Long examId, String newState) {
    return getMatriculationBridge().setEnrollmentState(studentIdentifier, examId, newState);
  }
  
  public MatriculationExamEnrollment createMatriculationExamEnrollment() {
    return getMatriculationBridge().createMatriculationExamEnrollment();
  }
  
  public void submitMatriculationExamEnrollment(Long examId, MatriculationExamEnrollment enrollment) {
    getMatriculationBridge().submitMatriculationExamEnrollment(examId, enrollment);
  }
  
  public MatriculationExamAttendance createMatriculationExamAttendance() {
    return getMatriculationBridge().createMatriculationExamAttendance();
  }

}
