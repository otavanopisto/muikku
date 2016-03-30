package fi.otavanopisto.muikku.plugins.coursepicker;

import fi.otavanopisto.muikku.plugins.seeker.SeekerResult;

public class CoursePickerSeekerResult implements SeekerResult {

  private String link;
  private String label;
  private String category;
  private String image;

  public CoursePickerSeekerResult(String label, String category, String link, String image) {
    this.label = label;
    this.category = category;
    this.link = link;
    this.image = image;
  }
  
  public String getLink() {
    return link;
  }

  public String getLabel() {
    return label;
  }

  @Override
  public String getCategory() {
    return category;
  }
  
  @Override
  public void setCategory(String category) {
    this.category = category;
  }

  public String getImage() {
    return image;
  }

  @Override
  public String getTemplate() {
    return "coursepicker/coursepicker_seekerresult.dust";
  }
}
