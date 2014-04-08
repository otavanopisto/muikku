package fi.muikku.dao.events;

public class IndexRemoveEvent extends IndexEvent<Object>{

  public IndexRemoveEvent(Object field) {
    super(field);
  }

}
