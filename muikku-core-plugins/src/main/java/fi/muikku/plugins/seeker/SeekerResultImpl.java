package fi.muikku.plugins.seeker;

public class SeekerResultImpl implements SeekerResult {

  private String link;
  private String label;
  private String category;
  private String image;

  public SeekerResultImpl(String label, String category, String link, String image) {
    this.label = label;
    this.category = category;
    this.link = link;
    this.image = image;
  }
  
  @Override
  public String getLink() {
    return link;
  }

  @Override
  public String getLabel() {
    return label;
  }

  @Override
  public String getCategory() {
    return category;
  }

  @Override
  public String getImage() {
    return image;
  }
}
