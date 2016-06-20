package fi.otavanopisto.muikku.plugins.workspace.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceMaterialAudioFieldAnswerClip {
  
  public Long getId() {
    return id;
  }
  
  public byte[] getContent() {
    return content;
  }
  
  public void setContent(byte[] content) {
    this.content = content;
  }
  
  public String getContentType() {
    return contentType;
  }
  
  public void setContentType(String contentType) {
    this.contentType = contentType;
  }
  
  public WorkspaceMaterialAudioFieldAnswer getFieldAnswer() {
    return fieldAnswer;
  }
  
  public void setFieldAnswer(WorkspaceMaterialAudioFieldAnswer fieldAnswer) {
    this.fieldAnswer = fieldAnswer;
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

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private WorkspaceMaterialAudioFieldAnswer fieldAnswer;
  
  @Lob
  private byte[] content;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String contentType;
  
  private String fileName;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String clipId;
}
