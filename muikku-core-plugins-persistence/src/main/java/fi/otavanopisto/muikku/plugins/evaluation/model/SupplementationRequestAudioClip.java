package fi.otavanopisto.muikku.plugins.evaluation.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import javax.validation.constraints.NotEmpty;

@Entity
public class SupplementationRequestAudioClip {
  
  public Long getId() {
    return id;
  }
  
  public String getContentType() {
    return contentType;
  }
  
  public void setContentType(String contentType) {
    this.contentType = contentType;
  }
  
  public String getFileName() {
    return fileName;
  }
  
  public void setFileName(String fileName) {
    this.fileName = fileName;
  }
  
  public String getClipId() {
    return clipId;
  }
  
  public void setClipId(String clipId) {
    this.clipId = clipId;
  }

  public SupplementationRequest getSupplementationRequest() {
    return supplementationRequest;
  }

  public void setSupplementationRequest(SupplementationRequest supplementationRequest) {
    this.supplementationRequest = supplementationRequest;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private SupplementationRequest supplementationRequest;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String clipId;

  private String contentType;
  
  private String fileName;
  
}
