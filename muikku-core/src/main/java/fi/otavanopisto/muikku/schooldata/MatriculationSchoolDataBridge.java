package fi.otavanopisto.muikku.schooldata;

import java.util.List;

import fi.otavanopisto.muikku.schooldata.entity.MatriculationEligibilities;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExam;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentChangeLogEntry;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentState;
import fi.otavanopisto.muikku.schooldata.entity.StudentMatriculationEligibilityOPS2021;

public interface MatriculationSchoolDataBridge {

  public String getSchoolDataSource();

  public Long getStudentId(SchoolDataIdentifier studentIdentifier);

  public BridgeResponse<List<MatriculationExam>> listStudentsExams(SchoolDataIdentifier studentIdentifier, MatriculationExamListFilter type);

  public MatriculationExamEnrollment createMatriculationExamEnrollment();

  public BridgeResponse<MatriculationExamEnrollment> submitMatriculationExamEnrollment(SchoolDataIdentifier studentIdentifier, Long examId, MatriculationExamEnrollment enrollment);

  public MatriculationExamAttendance createMatriculationExamAttendance();

  public BridgeResponse<MatriculationEligibilities> listEligibilities(SchoolDataIdentifier studentIdentifier);

  BridgeResponse<MatriculationExamEnrollment> getEnrollment(SchoolDataIdentifier studentIdentifier, Long examId);

  BridgeResponse<List<MatriculationExamEnrollmentChangeLogEntry>> getEnrollmentChangeLog(SchoolDataIdentifier studentIdentifier, Long examId);
  
  BridgeResponse<MatriculationExamEnrollment> setEnrollmentState(SchoolDataIdentifier studentIdentifier, Long examId, MatriculationExamEnrollmentState newState);

  /**
   * Returns student eligibility to participate matriculation exams
   * 
   * @param studentIdentifier student's identifier
   * @param subjectCode subject code
   * @return student eligibility to participate matriculation exams
   */
  public StudentMatriculationEligibilityOPS2021 getStudentMatriculationEligibility(SchoolDataIdentifier studentIdentifier, String subjectCode);
  
}