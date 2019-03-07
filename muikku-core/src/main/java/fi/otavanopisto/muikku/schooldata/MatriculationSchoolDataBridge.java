package fi.otavanopisto.muikku.schooldata;

import fi.otavanopisto.muikku.schooldata.entity.MatriculationExam;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment;

public interface MatriculationSchoolDataBridge {

  public String getSchoolDataSource();

  public Long getStudentId(SchoolDataIdentifier studentIdentifier);

  public MatriculationExam getMatriculationExam();

  public MatriculationExamEnrollment createMatriculationExamEnrollment();

  public void submitMatriculationExamEnrollment(MatriculationExamEnrollment enrollment);

  public MatriculationExamAttendance createMatriculationExamAttendance();

}