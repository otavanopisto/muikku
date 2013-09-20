package fi.muikku.plugins.wall.impl;

import java.util.Date;

import fi.muikku.plugins.wall.WallFeedItem;
import fi.muikku.plugins.wall.model.WallEntry;
import fi.tranquil.TranquilEntity;

@TranquilEntity
public class WallFeedWallEntryItem extends WallFeedItem {

  private WallEntry wallEntry;

  public WallFeedWallEntryItem(WallEntry entry) {
    super();
    this.wallEntry = entry;
  }

  public WallEntry getWallEntry() {
    return wallEntry;
  }
  
  @Override
  public Date getDate() {
    return wallEntry.getCreated();
  }

  @Override
  public String getDustTemplate() {
    return "wall/wallentry.dust";
  }

}
