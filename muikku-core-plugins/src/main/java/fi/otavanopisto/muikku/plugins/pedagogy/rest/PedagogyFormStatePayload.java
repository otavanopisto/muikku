package fi.otavanopisto.muikku.plugins.pedagogy.rest;

import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormState;

public class PedagogyFormStatePayload {

  public PedagogyFormState getState() {
    return state;
  }

  public void setState(PedagogyFormState state) {
    this.state = state;
  }

  private PedagogyFormState state;
}
