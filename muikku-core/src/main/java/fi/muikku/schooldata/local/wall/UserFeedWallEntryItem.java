package fi.muikku.schooldata.local.wall;

import java.util.Date;

import fi.muikku.model.wall.WallEntry;
import fi.tranquil.TranquilEntity;

@TranquilEntity
public class UserFeedWallEntryItem extends UserFeedItem {

  private WallEntry wallEntry;

  public UserFeedWallEntryItem(WallEntry entry) {
    super(UserFeedItemType.ENTRY);
    this.wallEntry = entry;
  }

  public WallEntry getWallEntry() {
    return wallEntry;
  }
  
  @Override
  public Date getDate() {
    return wallEntry.getCreated();
  }

}
