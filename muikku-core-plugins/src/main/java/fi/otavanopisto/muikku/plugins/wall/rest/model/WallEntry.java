package fi.otavanopisto.muikku.plugins.wall.rest.model;

import java.util.Date;

import fi.otavanopisto.muikku.plugins.wall.model.WallEntryVisibility;

public class WallEntry extends AbstractWallEntry {
  
  public WallEntry() {
  }
  
  public WallEntry(Long id, Long wallId, String text, Boolean archived, Long creatorId, Date created, Long lastModifierId, Date lastModified, WallEntryVisibility visibility) {
    super(id, wallId, text, archived, creatorId, created, lastModifierId, lastModified);
    this.visibility = visibility;
  }
  
  public WallEntryVisibility getVisibility() {
    return visibility;
  }
  
  public void setVisibility(WallEntryVisibility visibility) {
    this.visibility = visibility;
  }

  private WallEntryVisibility visibility;
}
