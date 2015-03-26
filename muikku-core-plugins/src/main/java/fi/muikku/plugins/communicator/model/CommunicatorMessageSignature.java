package fi.muikku.plugins.communicator.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Lob;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.otavanopisto.security.ContextReference;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
public class CommunicatorMessageSignature implements ContextReference {

  public Long getId() {
    return id;
  }
  
  public Long getUser() {
    return user;
  }

  public void setUser(Long user) {
    this.user = user;
  }

  public String getSignature() {
    return signature;
  }

  public void setSignature(String signature) {
    this.signature = signature;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @Column (name = "user_id")
  private Long user;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String name;

  @NotNull
  @NotEmpty
  @Column (nullable = false)
  @Lob
  private String signature;
}
