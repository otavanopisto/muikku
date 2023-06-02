package fi.otavanopisto.muikku.plugins.pedagogy.rest;

import java.util.List;

import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormVisibility;

public class PedagogyFormVisibilityPayload {

  private List<PedagogyFormVisibility> visibility;

  public List<PedagogyFormVisibility> getVisibility() {
    return visibility;
  }

  public void setVisibility(List<PedagogyFormVisibility> visibility) {
    this.visibility = visibility;
  }

}
