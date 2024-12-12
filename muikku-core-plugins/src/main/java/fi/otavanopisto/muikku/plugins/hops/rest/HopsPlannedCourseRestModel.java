package fi.otavanopisto.muikku.plugins.hops.rest;

import java.time.LocalDate;

public class HopsPlannedCourseRestModel {
  
  public HopsPlannedCourseRestModel() {
  }

  public HopsPlannedCourseRestModel(Long id, String name, Integer courseNumber, Integer length, String lengthSymbol, String subjectCode,
      Boolean mandatory, LocalDate startDate, Long duration, Long workspaceEntityId) {
    this.id = id;
    this.name = name;
    this.courseNumber = courseNumber;
    this.length = length;
    this.lengthSymbol = lengthSymbol;
    this.subjectCode = subjectCode;
    this.mandatory = mandatory;
    this.startDate = startDate;
    this.duration = duration;
    this.workspaceEntityId = workspaceEntityId;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Integer getCourseNumber() {
    return courseNumber;
  }

  public void setCourseNumber(Integer courseNumber) {
    this.courseNumber = courseNumber;
  }

  public Integer getLength() {
    return length;
  }

  public void setLength(Integer length) {
    this.length = length;
  }

  public String getLengthSymbol() {
    return lengthSymbol;
  }

  public void setLengthSymbol(String lengthSymbol) {
    this.lengthSymbol = lengthSymbol;
  }

  public String getSubjectCode() {
    return subjectCode;
  }

  public void setSubjectCode(String subjectCode) {
    this.subjectCode = subjectCode;
  }

  public Boolean getMandatory() {
    return mandatory;
  }

  public void setMandatory(Boolean mandatory) {
    this.mandatory = mandatory;
  }

  public LocalDate getStartDate() {
    return startDate;
  }

  public void setStartDate(LocalDate startDate) {
    this.startDate = startDate;
  }

  public Long getDuration() {
    return duration;
  }

  public void setDuration(Long duration) {
    this.duration = duration;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  private Long id;
  private String name;
  private Integer courseNumber;
  private Integer length;
  private String lengthSymbol;
  private String subjectCode;
  private Boolean mandatory;
  private LocalDate startDate;
  private Long duration;
  private Long workspaceEntityId;

}
