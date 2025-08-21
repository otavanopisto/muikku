package fi.otavanopisto.muikku.plugins.languageprofile.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Entity
public class LanguageProfileSample {
  
  public Long getId() {
    return id;
  }

  public LanguageProfile getLanguageProfile() {
    return languageProfile;
  }

  public void setLanguageProfile(LanguageProfile languageProfile) {
    this.languageProfile = languageProfile;
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

  public String getFileId() {
    return fileId;
  }

  public void setFileId(String fileId) {
    this.fileId = fileId;
  }

  public String getFileName() {
    return fileName;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }

  public String getContentType() {
    return contentType;
  }

  public void setContentType(String contentType) {
    this.contentType = contentType;
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

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private LanguageProfile languageProfile;
  
  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String language;

  @NotNull
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private LanguageProfileSampleType type;

  @Column
  private String fileId;

  @Column
  private String fileName;

  @Column
  private String contentType;

  @Lob
  @Column
  private String value;

  @NotNull
  @Column(nullable = false)
  @Temporal(value = TemporalType.TIMESTAMP)
  private Date lastModified;

}