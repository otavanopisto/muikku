package fi.otavanopisto.muikku.plugins.wall.model;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WallEntry extends AbstractWallEntry {

  public WallEntryVisibility getVisibility() {
    return visibility;
  }

  public void setVisibility(WallEntryVisibility visibility) {
    this.visibility = visibility;
  }

  private WallEntryVisibility visibility;
}
