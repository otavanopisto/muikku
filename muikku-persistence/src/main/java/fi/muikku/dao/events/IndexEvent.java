package fi.muikku.dao.events;

public abstract class IndexEvent <T> {

  public IndexEvent(T field) {
    this.field = field;
  }
  
  public T getField() {
    return field;
  }
  
  public void setField(T material) {
    this.field = material;
  }
  
  private T field;
}
