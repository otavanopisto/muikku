package fi.otavanopisto.muikku.plugins.chat;

import javax.enterprise.context.SessionScoped;

@SessionScoped
public class ChatPrebindParameters {
  public ChatPrebindParameters() {
    super();
    this.sid = 0;
    this.rid = 0;
    this.bound = false;
  }
  
  public boolean isBound() {
    return bound;
  }

  public void setBound(boolean bound) {
    this.bound = bound;
  }

  public long getSid() {
    return sid;
  }

  public void setSid(long sid) {
    this.sid = sid;
  }

  public long getRid() {
    return rid;
  }

  public void setRid(long rid) {
    this.rid = rid;
  }

  private boolean bound;
  private long sid;
  private long rid;
}
