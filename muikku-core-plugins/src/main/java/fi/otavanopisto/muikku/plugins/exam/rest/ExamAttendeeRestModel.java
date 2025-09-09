package fi.otavanopisto.muikku.plugins.exam.rest;

import java.time.OffsetDateTime;

public class ExamAttendeeRestModel {

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

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getLine() {
    return line;
  }

  public void setLine(String line) {
    this.line = line;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Integer getExtraMinutes() {
    return extraMinutes;
  }

  public void setExtraMinutes(Integer extraMinutes) {
    this.extraMinutes = extraMinutes;
  }

  private Long id;
  private String firstName;
  private String lastName;
  private String line;
  private OffsetDateTime started;
  private OffsetDateTime ended;
  private Integer extraMinutes;

}
