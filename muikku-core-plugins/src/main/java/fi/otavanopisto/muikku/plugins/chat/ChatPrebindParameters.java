package fi.otavanopisto.muikku.plugins.chat;

public class ChatPrebindParameters {
  
  public boolean isBound() {
    return bound;
  }

  public void setBound(boolean bound) {
    this.bound = bound;
  }

  public long getBindEpochMilli() {
    return bindEpochMilli;
  }

  public void setBindEpochMilli(long bindTime) {
    this.bindEpochMilli = bindTime;
  }

  public String getJid() {
    return jid;
  }

  public void setJid(String jid) {
    this.jid = jid;
  }

  public String getSid() {
    return sid;
  }

  public void setSid(String sid) {
    this.sid = sid;
  }

  public long getRid() {
    return rid;
  }

  public void setRid(long rid) {
    this.rid = rid;
  }

  public String getHostname() {
    return hostname;
  }

  public void setHostname(String hostname) {
    this.hostname = hostname;
  }

  private String hostname;
  private boolean bound;
  private long bindEpochMilli;
  private String jid;
  private String sid;
  private long rid;
}
