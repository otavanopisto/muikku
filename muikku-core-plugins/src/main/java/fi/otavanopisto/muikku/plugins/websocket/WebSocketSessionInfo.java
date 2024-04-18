package fi.otavanopisto.muikku.plugins.websocket;

import javax.websocket.Session;

public class WebSocketSessionInfo {
  
  public WebSocketSessionInfo(Long userEntityId) {
    this.lastAccess = System.currentTimeMillis();
    this.userEntityId = userEntityId;
  }

  public long getLastAccess() {
    return lastAccess;
  }

  public void access() {
    this.lastAccess = System.currentTimeMillis();
  }
  
  public boolean expired() {
    return System.currentTimeMillis() - lastAccess > 240000; // four minutes
  }

  public Session getSession() {
    return session;
  }

  public void setSession(Session session) {
    this.session = session;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  private Long userEntityId;
  private long lastAccess;
  private Session session;

}
