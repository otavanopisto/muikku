package fi.otavanopisto.muikku.plugins.exam.rest;

import java.time.OffsetDateTime;

public class ExamAttendanceRestModel {
  
  public ExamAttendanceRestModel() {
  }

  public ExamAttendanceRestModel(OffsetDateTime began, OffsetDateTime ended, boolean allowRestart) {
    this.began = began;
    this.ended = ended;
    this.allowRestart = allowRestart;
  }

  public OffsetDateTime getBegan() {
    return began;
  }

  public void setBegan(OffsetDateTime began) {
    this.began = began;
  }

  public OffsetDateTime getEnded() {
    return ended;
  }

  public void setEnded(OffsetDateTime ended) {
    this.ended = ended;
  }

  public boolean isAllowRestart() {
    return allowRestart;
  }

  public void setAllowRestart(boolean allowRestart) {
    this.allowRestart = allowRestart;
  }

  private OffsetDateTime began;
  private OffsetDateTime ended;
  private boolean allowRestart;

}
