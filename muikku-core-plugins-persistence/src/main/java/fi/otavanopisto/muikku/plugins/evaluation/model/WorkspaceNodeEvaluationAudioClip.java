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
public class WorkspaceNodeEvaluationAudioClip {
  
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

  public WorkspaceNodeEvaluation getEvaluation() {
    return evaluation;
  }

  public void setEvaluation(WorkspaceNodeEvaluation evaluation) {
    this.evaluation = evaluation;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private WorkspaceNodeEvaluation evaluation;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String clipId;

  private String contentType;
  
  private String fileName;
  
}
