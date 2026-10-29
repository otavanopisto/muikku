package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * OAuth 2.0 Error Response
 * RFC 6749 Section 5.2
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class OAuthErrorResponse {
  
  public String getError() {
    return error;
  }

  public void setError(String error) {
    this.error = error;
  }
  
  @JsonProperty ("error")
  private String error;

}