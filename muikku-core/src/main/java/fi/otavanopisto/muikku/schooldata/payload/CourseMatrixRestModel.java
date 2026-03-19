package fi.otavanopisto.muikku.schooldata.payload;

import java.util.List;
import java.util.Set;

public class CourseMatrixRestModel {

  public List<CourseMatrixSubject> getSubjects() {
    return subjects;
  }

  public void setSubjects(List<CourseMatrixSubject> subjects) {
    this.subjects = subjects;
  }

  public Set<CourseMatrixProblem> getProblems() {
    return problems;
  }

  public void setProblems(Set<CourseMatrixProblem> problems) {
    this.problems = problems;
  }

  public CourseMatrixType getType() {
    return type;
  }

  public void setType(CourseMatrixType type) {
    this.type = type;
  }

  public String getCurriculum() {
    return curriculum;
  }

  public void setCurriculum(String curriculum) {
    this.curriculum = curriculum;
  }

  private CourseMatrixType type;
  private String curriculum;
  private List<CourseMatrixSubject> subjects;
  private Set<CourseMatrixProblem> problems;

}
