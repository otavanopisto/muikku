package fi.otavanopisto.muikku.plugins.chat.rest;

public class ChatSettingsRestModel {
  
  public ChatSettingsRestModel() {
  }

  public ChatSettingsRestModel(Boolean enabled, String nick) {
    this.enabled = enabled;
    this.nick = nick;
  }

  public Boolean getEnabled() {
    return enabled;
  }
  
  public void setEnabled(Boolean enabled) {
    this.enabled = enabled;
  }
  
  public String getNick() {
    return nick;
  }
  
  public void setNick(String nick) {
    this.nick = nick;
  }
  
  private Boolean enabled;
  private String nick;

}
