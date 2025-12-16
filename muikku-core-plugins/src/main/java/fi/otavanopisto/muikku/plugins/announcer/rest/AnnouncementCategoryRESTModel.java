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


  public Long getColor() {
    return color;
  }

  public void setColor(Long color) {
    this.color = color;
  }


  private Long id;
  private String category;
  private Long color;
}