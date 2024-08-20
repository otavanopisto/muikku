package fi.otavanopisto.muikku.plugins.matriculation.restmodel;

import java.util.ArrayList;
import java.util.List;

public class MatriculationPlanRESTModel {

  public MatriculationPlanRESTModel() {
    this.setPlannedSubjects(new ArrayList<>());
  }

  public Boolean getGoalMatriculationExam() {
    return goalMatriculationExam;
  }

  public void setGoalMatriculationExam(Boolean goalMatriculationExam) {
    this.goalMatriculationExam = goalMatriculationExam;
  }

  public List<MatriculationPlanSubjectRESTModel> getPlannedSubjects() {
    return plannedSubjects;
  }

  public void setPlannedSubjects(List<MatriculationPlanSubjectRESTModel> plannedSubjects) {
    this.plannedSubjects = plannedSubjects;
  }

  private Boolean goalMatriculationExam;
  private List<MatriculationPlanSubjectRESTModel> plannedSubjects;
}
