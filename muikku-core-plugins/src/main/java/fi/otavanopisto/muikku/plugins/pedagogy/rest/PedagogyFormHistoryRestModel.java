package fi.otavanopisto.muikku.plugins.pedagogy.rest;

import java.util.Date;
import java.util.List;

import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormHistoryType;

public class PedagogyFormHistoryRestModel {

  public Long getModifierId() {
    return modifierId;
  }

  public void setModifierId(Long modifierId) {
    this.modifierId = modifierId;
  }

  public String getModifierName() {
    return modifierName;
  }

  public void setModifierName(String modifierName) {
    this.modifierName = modifierName;
  }

  public boolean isModifierHasAvatar() {
    return modifierHasAvatar;
  }

  public void setModifierHasAvatar(boolean modifierHasAvatar) {
    this.modifierHasAvatar = modifierHasAvatar;
  }

  public List<String> getEditedFields() {
    return editedFields;
  }

  public void setEditedFields(List<String> editedFields) {
    this.editedFields = editedFields;
  }

  public String getDetails() {
    return details;
  }

  public void setDetails(String details) {
    this.details = details;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public PedagogyFormHistoryType getType() {
    return type;
  }

  public void setType(PedagogyFormHistoryType type) {
    this.type = type;
  }

  private Long modifierId;
  private String modifierName;
  private boolean modifierHasAvatar;
  private List<String> editedFields;
  private String details;
  private Date date;
  private PedagogyFormHistoryType type;

}
