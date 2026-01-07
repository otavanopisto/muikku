package fi.otavanopisto.muikku.atests;

import java.util.List;
import java.util.Set;

public class HopsCourseMatrix {
 
  public HopsCourseMatrixType getType() {
    return type;
  }
  public void setType(HopsCourseMatrixType type) {
    this.type = type;
  }
  public List<HopsCourseMatrixSubject> getSubjects() {
    return subjects;
  }
  public void setSubjects(List<HopsCourseMatrixSubject> subjects) {
    this.subjects = subjects;
  }
  public Set<HopsCourseMatrixProblem> getProblems() {
    return problems;
  }
  public void setProblems(Set<HopsCourseMatrixProblem> problems) {
    this.problems = problems;
  }

  private HopsCourseMatrixType type;
  private List<HopsCourseMatrixSubject> subjects;
  private Set<HopsCourseMatrixProblem> problems;
  
}
