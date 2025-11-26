package fi.otavanopisto.muikku.plugins.hops.rest;

import java.time.LocalDate;

public class HopsStudyPlannerNoteRestModel {
  
  public HopsStudyPlannerNoteRestModel() {
  }

  public HopsStudyPlannerNoteRestModel(Long id, String title, String content, LocalDate startDate) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.startDate = startDate;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public LocalDate getStartDate() {
    return startDate;
  }

  public void setStartDate(LocalDate startDate) {
    this.startDate = startDate;
  }

  private Long id;
  private String title;
  private String content;
  private LocalDate startDate;

}
