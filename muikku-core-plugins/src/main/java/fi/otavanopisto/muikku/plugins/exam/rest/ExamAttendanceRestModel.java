package fi.otavanopisto.muikku.plugins.exam.rest;

import java.time.OffsetDateTime;
import java.util.List;

import fi.otavanopisto.muikku.plugins.workspace.ContentNode;

public class ExamAttendanceRestModel {
  
  public ExamAttendanceRestModel() {
  }

  public ExamAttendanceRestModel(OffsetDateTime started, OffsetDateTime ended, boolean allowRestart, List<ContentNode> contents) {
    this.started = started;
    this.ended = ended;
    this.allowRestart = allowRestart;
    this.contents = contents;
  }

  public OffsetDateTime getStarted() {
    return started;
  }

  public void setStarted(OffsetDateTime started) {
    this.started = started;
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

  public List<ContentNode> getContents() {
    return contents;
  }

  public void setContents(List<ContentNode> contents) {
    this.contents = contents;
  }

  public int getMinutes() {
    return minutes;
  }

  public void setMinutes(int minutes) {
    this.minutes = minutes;
  }

  private OffsetDateTime started;
  private OffsetDateTime ended;
  private boolean allowRestart;
  private int minutes;
  private List<ContentNode> contents;

}
