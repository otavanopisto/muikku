package fi.otavanopisto.muikku.plugins.chat;

public class ChatPrebindParameters {
  public ChatPrebindParameters() {
    super();
  }
  
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

  private boolean bound;
  private long bindEpochMilli;
  private String jid;
  private String sid;
  private long rid;
}
