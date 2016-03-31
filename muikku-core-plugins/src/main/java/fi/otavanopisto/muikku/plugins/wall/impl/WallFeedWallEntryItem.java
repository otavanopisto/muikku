package fi.otavanopisto.muikku.plugins.wall.impl;

import fi.otavanopisto.muikku.plugins.wall.WallFeedItem;
import fi.otavanopisto.muikku.plugins.wall.model.WallEntry;

public class WallFeedWallEntryItem extends WallFeedItem {

  private WallEntry wallEntry;

  public WallFeedWallEntryItem(WallEntry entry) {
    super(entry.getCreated());
    this.wallEntry = entry;
  }

  public WallEntry getWallEntry() {
    return wallEntry;
  }

  @Override
  public String getType() {
    return "wallEntries";
  }
  
  @Override
  public String getIdentifier() {
    return getWallEntry().getId().toString();
  }
  
}
