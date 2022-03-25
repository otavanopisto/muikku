package fi.otavanopisto.muikku.plugins.hops.rest;

import java.util.Date;

public class HistoryItem {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }
  
  public Long getModifierIdentifier() {
    return modifierIdentifier;
  }

  public void setModifierIdentifier(Long modifierIdentifier) {
    this.modifierIdentifier = modifierIdentifier;
  }

  public String getModifier() {
    return modifier;
  }

  public void setModifier(String modifier) {
    this.modifier = modifier;
  }

  public Boolean getModifierHasImage() {
    return modifierHasImage;
  }

  public void setModifierHasImage(Boolean modifierHasImage) {
    this.modifierHasImage = modifierHasImage;
  }

  public String getDetails() {
    return details;
  }

  public void setDetails(String details) {
    this.details = details;
  }

  private Long id;
  private Date date;
  private Long modifierIdentifier;
  private String modifier;
  private Boolean modifierHasImage;
  private String details;
  

}
