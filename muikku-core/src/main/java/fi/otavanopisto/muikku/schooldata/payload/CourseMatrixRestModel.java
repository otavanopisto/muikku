package fi.otavanopisto.muikku.schooldata.payload;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class CourseMatrixRestModel {

  public CourseMatrixRestModel() {
    subjects = new ArrayList<>();
    problems = new HashSet<>();
  }
  
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

  private List<CourseMatrixSubject> subjects;
  private Set<CourseMatrixProblem> problems;

}
