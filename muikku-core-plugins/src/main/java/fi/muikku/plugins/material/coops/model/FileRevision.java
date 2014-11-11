package fi.muikku.plugins.material.coops.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
public class FileRevision {

  public Long getId() {
    return id;
  }
  
  public File getFile() {
    return file;
  }
  
  public void setFile(File file) {
    this.file = file;
  }
  
  public String getChecksum() {
    return checksum;
  }
  
  public void setChecksum(String checksum) {
    this.checksum = checksum;
  }
  
  public Date getCreated() {
    return created;
  }
  
  public void setCreated(Date created) {
    this.created = created;
  }
  
  public String getData() {
    return data;
  }
  
  public void setData(String data) {
    this.data = data;
  }
  
  public Long getRevision() {
    return revision;
  }
  
  public void setRevision(Long revision) {
    this.revision = revision;
  }
  
  public String getSessionId() {
    return sessionId;
  }
  
  public void setSessionId(String sessionId) {
    this.sessionId = sessionId;
  }
  
  @Id
  @GeneratedValue (strategy=GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private File file;
  
  @Column
  @Lob
  private String data;
  
  @Column (nullable = false)
  @Temporal (TemporalType.TIMESTAMP)
  private Date created;
  
  private String checksum;
  
  @Column (nullable = false, updatable = false)
  private Long revision;
  
  private String sessionId;
}