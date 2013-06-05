package fi.muikku.plugins.seeker;

public class SeekerResultImpl implements SeekerResult {

  private String category;
  private String template;

  public SeekerResultImpl(String category, String template) {
    this.category = category;
    this.template = template;
  }
  
  @Override
  public String getCategory() {
    return category;
  }

  @Override
  public String getTemplate() {
    return template;
  }
}
