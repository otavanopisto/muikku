package fi.otavanopisto.muikku.plugins.matriculation.restmodel;

import java.util.List;

public class MatriculationSubjectResult {

  public String getSubjectCode() {
    return subjectCode;
  }

  public void setSubjectCode(String subjectCode) {
    this.subjectCode = subjectCode;
  }

  public List<MatriculationExamAttendance> getAttendances() {
    return attendances;
  }

  public void setAttendances(List<MatriculationExamAttendance> attendances) {
    this.attendances = attendances;
  }

  private String subjectCode;
  private List<MatriculationExamAttendance> attendances;
}
