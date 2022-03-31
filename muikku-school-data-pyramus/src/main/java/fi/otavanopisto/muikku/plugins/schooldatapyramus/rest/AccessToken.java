package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest;

//import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonProperty;
//import com.fasterxml.jackson.annotation.JsonSetter;

public class AccessToken {
  
  public String getAccessToken() {
    return accessToken;
  }
  
  public void setAccessToken(String accessToken) {
    this.accessToken = accessToken;
  }
  
//  @JsonGetter("expires_in")
//  @JsonProperty ("expires_in")
  public Integer getExpiresIn() {
    return expiresIn;
  }
  
//  @JsonSetter("expires_in")
//  @JsonProperty ("expires_in")
  public void setExpiresIn(Integer expiresIn) {
    this.expiresIn = expiresIn;
  }
  
  public String getRefreshToken() {
    return refreshToken;
  }

  public void setRefreshToken(String refreshToken) {
    this.refreshToken = refreshToken;
  }

  @JsonProperty ("access_token")
  private String accessToken;
  
  @JsonProperty ("expires_in")
  private Integer expiresIn;
  
  @JsonProperty("refresh_token")
  private String refreshToken;
}