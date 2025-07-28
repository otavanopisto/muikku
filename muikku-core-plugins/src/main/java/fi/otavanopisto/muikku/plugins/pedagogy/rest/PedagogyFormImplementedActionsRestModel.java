package fi.otavanopisto.muikku.plugins.pedagogy.rest;


public class PedagogyFormImplementedActionsRestModel {

  public String getFormData() {
    return formData;
  }

  public void setFormData(String formData) {
    this.formData = formData;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  private Long id;
  private Long userEntityId;
  private String formData;

}
