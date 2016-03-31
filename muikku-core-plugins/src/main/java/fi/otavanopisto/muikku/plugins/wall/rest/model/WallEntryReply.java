package fi.otavanopisto.muikku.plugins.wall.rest.model;

import java.util.Date;

public class WallEntryReply extends AbstractWallEntry {
  
  public WallEntryReply() {
  }
  
  public WallEntryReply(Long id, Long wallId, String text, Boolean archived, Long creatorId, Date created, Long lastModifierId, Date lastModified, Long wallEntryId) {
    super(id, wallId, text, archived, creatorId, created, lastModifierId, lastModified);
    this.wallEntryId = wallEntryId;
  }
  
  public Long getWallEntryId() {
    return wallEntryId;
  }
  
  public void setWallEntryId(Long wallEntryId) {
    this.wallEntryId = wallEntryId;
  }

  private Long wallEntryId;
}
