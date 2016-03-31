package fi.otavanopisto.muikku.plugins.workspace.rest.model;

public class WorkspaceFeeInfo {

  public WorkspaceFeeInfo() {
    this(false);
  }

  public WorkspaceFeeInfo(Boolean evaluationHasFee) {
    super();
    this.setEvaluationHasFee(evaluationHasFee);
  }

  public Boolean getEvaluationHasFee() {
    return evaluationHasFee;
  }

  public void setEvaluationHasFee(Boolean evaluationHasFee) {
    this.evaluationHasFee = evaluationHasFee;
  }

  private Boolean evaluationHasFee;
}
