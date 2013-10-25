package fi.muikku.plugins.wall.impl;

import fi.muikku.plugins.wall.WallFeedItem;
import fi.muikku.plugins.wall.model.WallEntry;
import fi.tranquil.TranquilEntity;

@TranquilEntity
public class WallFeedWallEntryItem extends WallFeedItem {

  private WallEntry wallEntry;

  public WallFeedWallEntryItem(WallEntry entry) {
    super(entry.getCreated(), "wall/wallentry.dust");
    this.wallEntry = entry;
  }

  public WallEntry getWallEntry() {
    return wallEntry;
  }
}
