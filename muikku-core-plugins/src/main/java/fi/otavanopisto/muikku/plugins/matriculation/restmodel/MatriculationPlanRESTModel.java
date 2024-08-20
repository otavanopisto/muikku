package fi.otavanopisto.muikku.plugins.matriculation.restmodel;

import java.util.ArrayList;
import java.util.List;

public class MatriculationPlanRESTModel {

  public MatriculationPlanRESTModel() {
    this.studentMatriculationSubjects = new ArrayList<>();
  }

  public MatriculationPlanRESTModel(List<String> studentMatriculationSubjects) {
    this.studentMatriculationSubjects = studentMatriculationSubjects;
  }

  /**
   * Returns student's matriculation subjects
   * 
   * @return student's matriculation subjects
   */
  public List<String> getStudentMatriculationSubjects() {
    return studentMatriculationSubjects;
  }
  
  /**
   * Sets student's matriculation subjects
   * 
   * @param studentMatriculationSubjects student's matriculation subjects
   */
  public void setStudentMatriculationSubjects(List<String> studentMatriculationSubjects) {
    this.studentMatriculationSubjects = studentMatriculationSubjects;
  }
  
  private List<String> studentMatriculationSubjects;
}
