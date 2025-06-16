package fi.otavanopisto.muikku.plugins.exam.rest;

import java.time.OffsetDateTime;

public class ExamAttendee {

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public boolean isHasImage() {
    return hasImage;
  }

  public void setHasImage(boolean hasImage) {
    this.hasImage = hasImage;
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

  private String name;
  private boolean hasImage;
  private OffsetDateTime started;
  private OffsetDateTime ended;

}
