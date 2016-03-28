package fi.otavanopisto.muikku.search;

import java.util.ArrayList;
import java.util.List;

import fi.otavanopisto.muikku.search.annotations.Indexable;

public class IndexableEntityVault {
  
  public static List<Indexable> getEntities() {
    return entities;
  }
  
  public static void addEntity(Indexable indexable) {
    entities.add(indexable);
  }
  
  private static List<Indexable> entities = new ArrayList<>();
}
