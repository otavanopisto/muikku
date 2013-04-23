package fi.muikku.plugins.wall.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WallEntryReply extends AbstractWallEntry {

  public WallEntry getWallEntry() {
    return wallEntry;
  }

  public void setWallEntry(WallEntry wallEntry) {
    this.wallEntry = wallEntry;
  }

  @ManyToOne
  private WallEntry wallEntry;
}
