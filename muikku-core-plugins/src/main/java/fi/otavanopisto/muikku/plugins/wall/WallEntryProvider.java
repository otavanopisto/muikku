package fi.otavanopisto.muikku.plugins.wall;

import java.util.List;

import fi.otavanopisto.muikku.plugins.wall.model.Wall;

public interface WallEntryProvider {

  List<WallFeedItem> listWallEntryItems(Wall wall);
  
  List<String> listRequiredJavaScripts();
}
