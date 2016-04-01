  package fi.otavanopisto.muikku.model.oauth;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Cacheable (true)
@Cache (usage = CacheConcurrencyStrategy.TRANSACTIONAL)
public class RequestToken extends Token {

  public RequestToken() {
    setType(TokenType.REQUEST);
  }
  
  public String getCallback() {
    return callback;
  }
  
  public void setCallback(String callback) {
    this.callback = callback;
  }
  
  public String getVerifier() {
    return verifier;
  }
  
  public void setVerifier(String verifier) {
    this.verifier = verifier;
  }

  @Column (nullable = false)
  @NotEmpty
  @NotNull
  private String callback;
  
  private String verifier;
}