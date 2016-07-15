package fi.otavanopisto.muikku.plugins.communicator.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class CommunicatorMessageAttachment {
  
  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getContentType() {
    return contentType;
  }

  public void setContentType(String contentType) {
    this.contentType = contentType;
  }

  public byte[] getContent() {
    return content;
  }

  public void setContent(byte[] content) {
    this.content = content;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @NotEmpty
  @Column (nullable=false, unique=true)
  private String name;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String contentType;
  
  @NotNull
  @Column (nullable = false)
  @Lob
  private byte[] content;

}
