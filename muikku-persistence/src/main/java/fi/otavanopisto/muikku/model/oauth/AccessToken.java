package fi.otavanopisto.muikku.model.oauth;

import javax.persistence.Entity;

@Entity
public class AccessToken extends Token {

  public AccessToken() {
    setType(TokenType.ACCESS);
  }
  
}