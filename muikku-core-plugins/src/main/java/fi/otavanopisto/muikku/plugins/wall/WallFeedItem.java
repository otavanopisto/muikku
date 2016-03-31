package fi.otavanopisto.muikku.plugins.wall;

import java.util.Date;

public abstract class WallFeedItem {

  public WallFeedItem(Date date) {
    this.date = date;
  }

  public Date getDate() {
    return date;
  }
  
  public void setDate(Date date) {
    this.date = date;
  }

  public abstract String getType();
  public abstract String getIdentifier();
  
  private Date date;
}
