package fi.otavanopisto.muikku.plugins.material.events;

import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;

public class HtmlMaterialDeleteEvent extends MaterialDeleteEvent<HtmlMaterial> {

  public HtmlMaterialDeleteEvent(HtmlMaterial material, boolean removeAnswers) {
    super(material);
    this.removeAnswers = removeAnswers;
  }
  
  public boolean getRemoveAnswers() {
    return removeAnswers;
  }

  public void setRemoveAnswers(boolean removeAnswers) {
    this.removeAnswers = removeAnswers;
  }

  private boolean removeAnswers;
  
}
