package fi.otavanopisto.muikku.plugins.seeker.defaultproviders;

import fi.otavanopisto.muikku.plugins.seeker.SeekerResult;

public class TopSeekerResult implements SeekerResult {
  
  public TopSeekerResult(String category, String label, String link){
    this.category = category;
    this.label = label;
    this.link = link;
  }
  
  @Override
  public String getTemplate() {
    return "seeker/defaultseekerresult.dust";
  }

  @Override
  public String getCategory() {
    return category;
  }
  
  @Override
  public void setCategory(String category) {
    this.category = category;
  }
  
  public String getLabel() {
    return label;
  }

  public String getLink() {
    return link;
  }

  private String label;
  private String link;
  private String category;

}
