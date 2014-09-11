package fi.muikku.plugins.material.coops.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;

@Entity
public class FileRevisionExtensionProperty {

  public Long getId() {
    return id;
  }
  
  public FileRevision getFileRevision() {
    return fileRevision;
  }
  
  public void setFileRevision(FileRevision fileRevision) {
    this.fileRevision = fileRevision;
  }
  
  public String getKey() {
    return key;
  }
  
  public void setKey(String key) {
    this.key = key;
  }
  
  public String getValue() {
    return value;
  }
  
  public void setValue(String value) {
    this.value = value;
  }
  
  @Id
  @GeneratedValue (strategy=GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private FileRevision fileRevision;

  @Column (nullable = false)
  private String key;
  
  @Lob
  @Column (nullable = false)
  private String value;
}