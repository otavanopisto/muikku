package fi.muikku.schooldata.local.wall;

import java.util.Date;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public abstract class UserFeedItem {

  public UserFeedItemType getType() {
    return type;
  }

  public void setType(UserFeedItemType type) {
    this.type = type;
  }

  private UserFeedItemType type;

  public UserFeedItem(UserFeedItemType type) {
    this.type = type;
  }

  public abstract Date getDate();
}
