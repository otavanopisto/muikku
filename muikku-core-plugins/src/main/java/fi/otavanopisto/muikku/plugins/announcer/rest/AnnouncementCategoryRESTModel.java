package fi.otavanopisto.muikku.plugins.announcer.rest;

public class AnnouncementCategoryRESTModel {
  
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }


  private Long id;
  private String category;
}