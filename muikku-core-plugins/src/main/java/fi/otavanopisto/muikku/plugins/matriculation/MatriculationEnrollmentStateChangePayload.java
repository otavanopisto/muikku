package fi.otavanopisto.muikku.plugins.matriculation;

import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentState;

public class MatriculationEnrollmentStateChangePayload {

  public MatriculationExamEnrollmentState getState() {
    return state;
  }

  public void setState(MatriculationExamEnrollmentState state) {
    this.state = state;
  }

  private MatriculationExamEnrollmentState state;
}
