package fi.otavanopisto.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Table (
  uniqueConstraints = {
    @UniqueConstraint (columnNames = { "userEntity_id", "propertyKey" })
  }
)
public class UserEntityProperty {
  
  public Long getId() {
    return id;
  }
  
  public UserEntity getUserEntity() {
    return userEntity;
  }
  
  public void setUserEntity(UserEntity userEntity) {
    this.userEntity = userEntity;
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
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private UserEntity userEntity;
  
  @Column (name="propertyKey", nullable = false)
  @NotEmpty
  @NotNull
  private String key;

  @Column (nullable = false)
  @NotEmpty
  @NotNull
  @Lob
  private String value;
}