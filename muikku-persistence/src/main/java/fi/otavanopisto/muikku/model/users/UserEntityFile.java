package fi.otavanopisto.muikku.model.users;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Entity
public class UserEntityFile {

  public Long getId() {
    return id;
  }
  
  public UserEntity getUserEntity() {
    return userEntity;
  }

  public void setUserEntity(UserEntity userEntity) {
    this.userEntity = userEntity;
  }

  public String getContentType() {
    return contentType;
  }

  public void setContentType(String contentType) {
    this.contentType = contentType;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public byte[] getData() {
    return data;
  }

  public void setData(byte[] data) {
    this.data = data;
  }

  public Date getLastModified() {
    return lastModified;
  }

  public void setLastModified(Date lastModified) {
    this.lastModified = lastModified;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }
  
  public UserEntityFileVisibility getVisibility() {
    return visibility;
  }

  public void setVisibility(UserEntityFileVisibility visibility) {
    this.visibility = visibility;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private UserEntity userEntity;
  
  @NotNull
  @Column (nullable=false)
  @NotEmpty
  private String identifier;

  @NotNull
  @Column (nullable=false)
  @NotEmpty
  private String name;
  
  @NotNull
  @Column (nullable=false)
  @NotEmpty
  private String contentType;
  
  @NotNull
  @NotEmpty
  @Column (length=1073741824, nullable=false)
  private byte[] data;
  
  @NotNull
  @Column (nullable=false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date lastModified;

  @Enumerated (EnumType.STRING)
  private UserEntityFileVisibility visibility;

}