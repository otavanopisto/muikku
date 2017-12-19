package fi.otavanopisto.muikku.plugins.chat;

public class XmppCredentials {
  
  public XmppCredentials(String username, String jid, String password) {
    this.username = username;
    this.jid = jid;
    this.password = password;
  }
  
  public String getJid() {
    return jid;
  }

  public String getPassword() {
    return password;
  }

  public String getUsername() {
    return username;
  }

  private final String username;
  private final String jid;
  private final String password;
}
