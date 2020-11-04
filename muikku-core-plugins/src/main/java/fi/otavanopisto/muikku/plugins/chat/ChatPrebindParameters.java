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

  public String getDomain() {
    return domain;
  }

  public void setDomain(String domain) {
    this.domain = domain;
  }

  private String domain;
  private boolean bound;
  private long bindEpochMilli;
  private String jid;
  private String sid;
  private long rid;
}
