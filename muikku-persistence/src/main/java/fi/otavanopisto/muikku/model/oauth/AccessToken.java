  package fi.otavanopisto.muikku.model.oauth;

import javax.persistence.Cacheable;
import javax.persistence.Entity;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Cacheable (true)
@Cache (usage = CacheConcurrencyStrategy.TRANSACTIONAL)
public class AccessToken extends Token {

  public AccessToken() {
    setType(TokenType.ACCESS);
  }
  
}