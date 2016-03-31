package fi.otavanopisto.muikku.model.oauth;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Cacheable (true)
@Cache (usage = CacheConcurrencyStrategy.TRANSACTIONAL)
@Deprecated
public class TokenPermission {
  
  public Long getId() {
    return id;
  }

  public Token getToken() {
    return token;
  }
  
  public void setToken(Token token) {
    this.token = token;
  }
  
  public String getPermission() {
    return permission;
  }
  
  public void setPermission(String permission) {
    this.permission = permission;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private Token token;
  
  @Column (nullable = false)
  @NotNull
  @NotEmpty
  private String permission;
}