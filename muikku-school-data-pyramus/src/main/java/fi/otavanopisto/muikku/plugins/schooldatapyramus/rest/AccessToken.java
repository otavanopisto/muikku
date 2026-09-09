package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AccessToken {
  
  public String getAccessToken() {
    return accessToken;
  }
  
  public void setAccessToken(String accessToken) {
    this.accessToken = accessToken;
  }
  
  public Integer getExpiresIn() {
    return expiresIn;
  }
  
  public void setExpiresIn(Integer expiresIn) {
    this.expiresIn = expiresIn;
  }
  
  public String getRefreshToken() {
    return refreshToken;
  }

  public void setRefreshToken(String refreshToken) {
    this.refreshToken = refreshToken;
  }

  public String getScope() {
    return scope;
  }

  public void setScope(String scope) {
    this.scope = scope;
  }

  public String getTokenType() {
    return tokenType;
  }

  public void setTokenType(String tokenType) {
    this.tokenType = tokenType;
  }

  @JsonProperty ("access_token")
  private String accessToken;
  
  @JsonProperty ("expires_in")
  private Integer expiresIn;
  
  @JsonProperty("refresh_token")
  private String refreshToken;

  @JsonProperty("scope")
  private String scope;

  @JsonProperty("token_type")
  private String tokenType;
}