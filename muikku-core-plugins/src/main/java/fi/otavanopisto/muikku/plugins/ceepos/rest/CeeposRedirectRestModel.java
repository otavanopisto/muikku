package fi.otavanopisto.muikku.plugins.ceepos.rest;

public class CeeposRedirectRestModel {
  
  public CeeposRedirectRestModel() {
  }
  
  public CeeposRedirectRestModel(String url) {
    this.url = url;
  }

  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }

  private String url;

}
