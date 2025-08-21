package fi.otavanopisto.muikku.plugins.languageprofile.rest;

import java.util.Date;

public class LanguageProfileRestModel {

  public String getFormData() {
    return formData;
  }

  public void setFormData(String formData) {
    this.formData = formData;
  }

  public Date getLastModified() {
    return lastModified;
  }

  public void setLastModified(Date lastModified) {
    this.lastModified = lastModified;
  }

  private String formData;
  private Date lastModified;

}
