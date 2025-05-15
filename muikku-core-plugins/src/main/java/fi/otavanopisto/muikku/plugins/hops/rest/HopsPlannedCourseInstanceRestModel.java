package fi.otavanopisto.muikku.plugins.hops.rest;

import java.time.LocalDate;

public class HopsPlannedCourseInstanceRestModel {
  
  public HopsPlannedCourseInstanceRestModel() {
  }
  
  public HopsPlannedCourseInstanceRestModel(Long id, String name, LocalDate startDate, LocalDate endDate, boolean instanceExists) {
    this.id = id;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.instanceExists = instanceExists;
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

  public LocalDate getStartDate() {
    return startDate;
  }

  public void setStartDate(LocalDate startDate) {
    this.startDate = startDate;
  }

  public LocalDate getEndDate() {
    return endDate;
  }

  public void setEndDate(LocalDate endDate) {
    this.endDate = endDate;
  }

  public boolean isInstanceExists() {
    return instanceExists;
  }

  public void setInstanceExists(boolean instanceExists) {
    this.instanceExists = instanceExists;
  }

  private Long id;
  private String name;
  private LocalDate startDate;
  private LocalDate endDate;
  private boolean instanceExists;

}
