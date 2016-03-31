package fi.otavanopisto.muikku.plugins.seeker;

public class SeekerResultImpl implements SeekerResult {

  private String category;
  private String template;

  public SeekerResultImpl(String template) {
    this.template = template;
  }

  public SeekerResultImpl(String template, String category) {
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

  @Override
  public void setCategory(String category) {
    this.category = category;
  }
}
