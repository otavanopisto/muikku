package fi.otavanopisto.muikku.plugins.material.events;

import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;

public class HtmlMaterialUpdateEvent extends MaterialUpdateEvent<HtmlMaterial> {

  public HtmlMaterialUpdateEvent(HtmlMaterial material, String oldHtml, String newHtml, boolean removeAnswers) {
    super(material);
    this.oldHtml = oldHtml;
    this.newHtml = newHtml;
    this.removeAnswers = removeAnswers;
  }
  
  public String getOldHtml() {
    return oldHtml;
  }
  
  public String getNewHtml() {
    return newHtml;
  }
  
  public boolean getRemoveAnswers() {
    return removeAnswers;
  }

  public void setRemoveAnswers(boolean removeAnswers) {
    this.removeAnswers = removeAnswers;
  }

  private String oldHtml;
  private String newHtml;
  private boolean removeAnswers;
}
