package fi.otavanopisto.muikku.plugins.languageprofile.rest;

import java.util.Date;

import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfileSampleType;

public class LanguageProfileSampleRestModel {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getLanguage() {
    return language;
  }

  public void setLanguage(String language) {
    this.language = language;
  }

  public LanguageProfileSampleType getType() {
    return type;
  }

  public void setType(LanguageProfileSampleType type) {
    this.type = type;
  }

  public String getFileName() {
    return fileName;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public Date getLastModified() {
    return lastModified;
  }

  public void setLastModified(Date lastModified) {
    this.lastModified = lastModified;
  }

  private Long id;
  private String language;
  private LanguageProfileSampleType type;
  private String fileName;
  private String value;
  private Date lastModified;

}
