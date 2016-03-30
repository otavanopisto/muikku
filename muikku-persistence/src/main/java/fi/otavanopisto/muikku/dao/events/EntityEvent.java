package fi.otavanopisto.muikku.dao.events;

public abstract class EntityEvent {

  public EntityEvent(Object entity) {
    this.setEntity(entity);
  }

  public Object getEntity() {
    return entity;
  }

  public void setEntity(Object entity) {
    this.entity = entity;
  }

  private Object entity;
}
