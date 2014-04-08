package fi.muikku.dao.events;

public class IndexAddEvent extends IndexEvent<Object>{

  public IndexAddEvent(Object field) {
    super(field);
  }

}
