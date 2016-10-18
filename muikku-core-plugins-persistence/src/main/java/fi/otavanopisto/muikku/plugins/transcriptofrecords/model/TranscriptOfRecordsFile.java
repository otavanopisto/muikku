package fi.otavanopisto.muikku.plugins.transcriptofrecords.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class TranscriptOfRecordsFile {
  
  public TranscriptOfRecordsFile(
      Long userEntityId,
      String fileName,
      Boolean archived,
      String title,
      String description) {
    super();
    this.userEntityId = userEntityId;
    this.fileName = fileName;
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
  private String title;

  @NotNull
  @Column(nullable = false, length = 4096)
  private String description;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
}
