package fi.muikku.plugins.seeker.defaultproviders;

import fi.muikku.plugins.seeker.SeekerResult;
import fi.tranquil.TranquilEntity;

@TranquilEntity
public class WorkspaceSeekerResult implements SeekerResult {

  private String link;
  private String label;
  private String category;
  private String image;

  public WorkspaceSeekerResult(String label, String category, String link, String image) {
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
    return "seeker/workspaceseekerresult.dust";
  }
}
