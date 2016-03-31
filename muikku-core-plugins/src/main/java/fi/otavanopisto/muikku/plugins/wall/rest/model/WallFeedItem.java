package fi.otavanopisto.muikku.plugins.wall.rest.model;

import java.util.Date;

public class WallFeedItem {

  public WallFeedItem() {
  }

  public WallFeedItem(String type, String identifier, Date date) {
    super();
    this.type = type;
    this.identifier = identifier;
    this.date = date;
  }
  
  public String getType() {
    return type;
  }
  
  public void setType(String type) {
    this.type = type;
  }
  
  public String getIdentifier() {
    return identifier;
  }
  
  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  private String type;
  private String identifier;
  private Date date;
}
