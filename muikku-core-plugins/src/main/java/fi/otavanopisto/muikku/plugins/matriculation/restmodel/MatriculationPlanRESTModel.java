package fi.otavanopisto.muikku.plugins.matriculation.restmodel;

import java.util.ArrayList;
import java.util.List;

public class MatriculationPlanRESTModel {

  public MatriculationPlanRESTModel() {
    this.studentMatriculationSubjects = new ArrayList<>();
  }

  public MatriculationPlanRESTModel(List<MatriculationPlanSubjectRESTModel> studentMatriculationSubjects) {
    this.studentMatriculationSubjects = studentMatriculationSubjects;
  }

  public List<MatriculationPlanSubjectRESTModel> getStudentMatriculationSubjects() {
    return studentMatriculationSubjects;
  }
  
  public void setStudentMatriculationSubjects(List<MatriculationPlanSubjectRESTModel> studentMatriculationSubjects) {
    this.studentMatriculationSubjects = studentMatriculationSubjects;
  }
  
  public Boolean getGoalMatriculationExam() {
    return goalMatriculationExam;
  }

  public void setGoalMatriculationExam(Boolean goalMatriculationExam) {
    this.goalMatriculationExam = goalMatriculationExam;
  }

  private Boolean goalMatriculationExam;
  private List<MatriculationPlanSubjectRESTModel> studentMatriculationSubjects;
}
