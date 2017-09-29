package fi.otavanopisto.muikku.plugins.chat;

public class CredentialsRESTModel {
  
  public CredentialsRESTModel(String jid, String password) {
    this.jid = jid;
    this.password = password;
  }
  
  public String getJid() {
    return jid;
  }
  public String getPassword() {
    return password;
  }

  private final String jid;
  private final String password;
}
