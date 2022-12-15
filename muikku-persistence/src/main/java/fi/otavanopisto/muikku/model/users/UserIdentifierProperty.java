package fi.otavanopisto.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import javax.validation.constraints.NotEmpty;

@Entity
@Table (
  uniqueConstraints = {
    @UniqueConstraint (columnNames = { "identifier", "propertyKey" })
  }
)
public class UserIdentifierProperty {
  
  public Long getId() {
    return id;
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
  
  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column (nullable = false)
  @NotEmpty
  @NotNull
  private String identifier;
  
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