package fi.otavanopisto.muikku.schooldata;

import java.util.List;

import fi.otavanopisto.muikku.schooldata.entity.MatriculationEligibilities;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExam;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment;

public interface MatriculationSchoolDataBridge {

  public String getSchoolDataSource();

  public Long getStudentId(SchoolDataIdentifier studentIdentifier);

  public List<MatriculationExam> listMatriculationExams(boolean onlyEligible);

  public MatriculationExamEnrollment createMatriculationExamEnrollment();

  public void submitMatriculationExamEnrollment(Long examId, MatriculationExamEnrollment enrollment);

  public MatriculationExamAttendance createMatriculationExamAttendance();

  public BridgeResponse<MatriculationEligibilities> listEligibilities(SchoolDataIdentifier studentIdentifier);

}