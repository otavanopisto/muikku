package fi.muikku.plugins.material.events;

import fi.muikku.plugins.material.model.HtmlMaterial;

public class HtmlMaterialUpdateEvent extends MaterialUpdateEvent<HtmlMaterial> {

  public HtmlMaterialUpdateEvent(HtmlMaterial material, String oldHtml, String newHtml) {
    super(material);
    this.oldHtml = oldHtml;
    this.newHtml = newHtml;
  }
  
  public String getOldHtml() {
    return oldHtml;
  }
  
  public String getNewHtml() {
    return newHtml;
  }
  
  private String oldHtml;
  private String newHtml;
}
