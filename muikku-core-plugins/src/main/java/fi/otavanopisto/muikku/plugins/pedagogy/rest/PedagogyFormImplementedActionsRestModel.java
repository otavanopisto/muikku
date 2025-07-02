package fi.otavanopisto.muikku.plugins.pedagogy.rest;

import java.util.Map;

import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormState;

public class PedagogyFormImplementedActionsRestModel {

  public String getFormData() {
    return formData;
  }

  public void setFormData(String formData) {
    this.formData = formData;
  }

  public PedagogyFormState getState() {
    return state;
  }

  public void setState(PedagogyFormState state) {
    this.state = state;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getOwnerId() {
    return ownerId;
  }

  public void setOwnerId(Long ownerId) {
    this.ownerId = ownerId;
  }

  public Map<String, String> getStudentInfo() {
    return studentInfo;
  }

  public void setStudentInfo(Map<String, String> studentInfo) {
    this.studentInfo = studentInfo;
  }

  public Map<String, String> getOwnerInfo() {
    return ownerInfo;
  }

  public void setOwnerInfo(Map<String, String> ownerInfo) {
    this.ownerInfo = ownerInfo;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  private Long id;
  private Long userEntityId;
  private Map<String, String> studentInfo;
  private Long ownerId;
  private Map<String, String> ownerInfo;
  private String formData;
  private PedagogyFormState state;

}
