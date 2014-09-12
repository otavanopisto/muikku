package fi.muikku.plugins.seeker.defaultproviders;

import fi.muikku.plugins.seeker.SeekerResult;

public class UserSeekerResult implements SeekerResult {

  private String link;
  private String label;
  private String category;
  private String image;

  public UserSeekerResult(String label, String category, String link, String image) {
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

  public String getImage() {
    return image;
  }

  @Override
  public String getTemplate() {
    return "seeker/userseekerresult.dust";
  }
}
