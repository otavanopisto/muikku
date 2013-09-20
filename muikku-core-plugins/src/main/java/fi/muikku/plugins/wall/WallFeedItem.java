package fi.muikku.plugins.wall;

import java.util.Date;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public abstract class WallFeedItem {

  public abstract Date getDate();
  
  public abstract String getDustTemplate();
}
