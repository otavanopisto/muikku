package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentPrice;

public class PyramusWorkspaceAssessmentPrice implements WorkspaceAssessmentPrice {
  
  public PyramusWorkspaceAssessmentPrice() {
  }
  
  public PyramusWorkspaceAssessmentPrice(Double price) {
    this.price = price;
  }

  public Double getPrice() {
    return price;
  }

  public void setPrice(Double price) {
    this.price = price;
  }

  private Double price;
  
}
