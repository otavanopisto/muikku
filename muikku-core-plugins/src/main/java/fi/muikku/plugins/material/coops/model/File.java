package fi.muikku.plugins.material.coops.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class File {

  public Long getId() {
    return id;
  }
  
  public Long getRevisionNumber() {
    return revisionNumber;
  }
  
  public void setRevisionNumber(Long revisionNumber) {
    this.revisionNumber = revisionNumber;
  }
  
  public String getData() {
    return data;
  }
  
  public void setData(String data) {
    this.data = data;
  }
  
  public String getContentType() {
    return contentType;
  }
  
  public void setContentType(String contentType) {
    this.contentType = contentType;
  }
  
  @Id
  @GeneratedValue (strategy=GenerationType.IDENTITY)
  private Long id;
  
  @Column (nullable = false)
  private Long revisionNumber;
  
  @Lob
  private String data;
  
  @Column (nullable = false)
  @NotEmpty
  private String contentType;
}