package fi.otavanopisto.muikku.plugins.matriculation.restmodel;

import java.util.List;

public class MatriculationSubjectResult {

  public String getSubjectCode() {
    return subjectCode;
  }

  public void setSubjectCode(String subjectCode) {
    this.subjectCode = subjectCode;
  }

  public List<MatriculationGrade> getGrades() {
    return grades;
  }

  public void setGrades(List<MatriculationGrade> grades) {
    this.grades = grades;
  }

  private String subjectCode;
  private List<MatriculationGrade> grades;
}
