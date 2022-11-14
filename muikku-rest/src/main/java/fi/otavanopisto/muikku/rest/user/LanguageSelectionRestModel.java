package fi.otavanopisto.muikku.rest.user;

public class LanguageSelectionRestModel {

  public LanguageSelectionRestModel() {
  }
  
  public LanguageSelectionRestModel(String lang) {
    this.lang = lang;
  }
  
  public String getLang() {
    return lang;
  }
  
  public void setLang(String lang) {
    this.lang = lang;
  }
  
  private String lang;
}
