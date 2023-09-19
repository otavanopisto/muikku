package fi.otavanopisto.muikku.plugins.forum.rest;

import fi.otavanopisto.muikku.model.forum.LockForumThread;

public class LockPayload {

  public LockForumThread getLock() {
    return lock;
  }

  public void setLock(LockForumThread lock) {
    this.lock = lock;
  }

  private LockForumThread lock;
}
