package fi.otavanopisto.muikku.plugins.material.coops.event;

import fi.foyt.coops.model.Patch;

public class CoOpsPatchEvent {
  
  public CoOpsPatchEvent(String htmlMaterialId, Patch patch) {
    this.htmlMaterialId = htmlMaterialId;
    this.patch = patch;
  }
  
  public String getHtmlMaterialId() {
    return htmlMaterialId;
  }
  
  public Patch getPatch() {
    return patch;
  }

  private String htmlMaterialId;
  private Patch patch;
}