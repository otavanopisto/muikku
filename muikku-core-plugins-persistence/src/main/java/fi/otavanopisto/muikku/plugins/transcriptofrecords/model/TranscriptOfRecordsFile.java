package fi.otavanopisto.muikku.plugins.transcriptofrecords.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Entity
public class TranscriptOfRecordsFile {
  
  public TranscriptOfRecordsFile() {
  }
  
  public TranscriptOfRecordsFile(
      Long userEntityId,
      String fileName,
      String contentType,
      Boolean archived,
      String title,
      String description) {
    super();
    this.userEntityId = userEntityId;
    this.fileName = fileName;
    this.contentType = contentType;
    this.archived = archived;
    this.title = title;
    this.description = description;
  }

  public Long getId() {
    return id;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }
  
  public Long getUserEntityId() {
    return userEntityId;
  }
  
  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
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

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public void setId(Long id) {
    this.id = id;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @Column(nullable = false)
  private Long userEntityId;
  
  @NotNull
  @Column(nullable = false, length = 4096)
  private String fileName;
  
  @NotNull
  @Column(nullable = false, length = 255)
  private String contentType;

  @NotNull
  @Column(nullable = false, length = 255)
  private String title;

  @NotNull
  @Column(nullable = false, length = 4096)
  private String description;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
}
