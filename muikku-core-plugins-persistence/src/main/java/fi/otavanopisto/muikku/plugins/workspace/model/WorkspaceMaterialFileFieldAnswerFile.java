package fi.otavanopisto.muikku.plugins.workspace.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Entity
public class WorkspaceMaterialFileFieldAnswerFile {
  
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
  
  public WorkspaceMaterialFileFieldAnswer getFieldAnswer() {
    return fieldAnswer;
  }
  
  public void setFieldAnswer(WorkspaceMaterialFileFieldAnswer fieldAnswer) {
    this.fieldAnswer = fieldAnswer;
  }

  public String getFileName() {
    return fileName;
  }
  
  public void setFileName(String fileName) {
    this.fileName = fileName;
  }
  
  public String getFileId() {
    return fileId;
  }
  
  public void setFileId(String fileId) {
    this.fileId = fileId;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private WorkspaceMaterialFileFieldAnswer fieldAnswer;
  
  @Lob
  private byte[] content;
  
  private String contentType;
  
  private String fileName;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false, unique = true)
  private String fileId;
}
