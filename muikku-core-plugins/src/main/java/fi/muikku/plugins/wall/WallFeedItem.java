package fi.muikku.plugins.wall;

import java.util.Date;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public class WallFeedItem {

  public WallFeedItem(Date date, String dustTemplate) {
    this.date = date;
    this.dustTemplate = dustTemplate;
  }

  public Date getDate() {
    return date;
  }
  
  public String getDustTemplate() {
    return dustTemplate;
  }
  
  public void setDustTemplate(String dustTemplate) {
    this.dustTemplate = dustTemplate;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  private Date date;
  private String dustTemplate;
}
