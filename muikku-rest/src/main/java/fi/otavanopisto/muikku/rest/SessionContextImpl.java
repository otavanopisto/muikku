package fi.otavanopisto.muikku.rest;

public class SessionContextImpl {
  
  public SessionContextImpl(Long id, SessionContextType type) {
    this.id = id;
    this.type = type;
  }

  public Long getId() {
    return id;
  }
  
  public SessionContextType getType() {
    return type;
  }
  
  private Long id;
  private SessionContextType type;
}
