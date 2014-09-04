package fi.muikku.plugins.wall;

import java.util.Date;

public class WallFeedItem {

  public WallFeedItem(Date date) {
    this.date = date;
  }

  public Date getDate() {
    return date;
  }
  
  public void setDate(Date date) {
    this.date = date;
  }

  public String getWallFeedItemName() {
    return getClass().getSimpleName();
  }
  
  private Date date;
}
