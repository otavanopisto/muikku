package fi.muikku.plugins.wall;

import java.util.List;

import fi.muikku.plugins.wall.model.Wall;

public interface WallEntryProvider {

  List<WallFeedItem> listWallEntryItems(Wall wall);
  
}
