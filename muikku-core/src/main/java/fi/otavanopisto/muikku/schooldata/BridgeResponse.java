package fi.otavanopisto.muikku.schooldata;

public class BridgeResponse<T> {
  
  public BridgeResponse() {
    
  }

  public BridgeResponse(int statusCode, T entity) {
    this.statusCode = statusCode;
    this.entity = entity;
  }

  public BridgeResponse(int statusCode, T entity, String message) {
    this.statusCode = statusCode;
    this.entity = entity;
    this.message = message;
  }

  public int getStatusCode() {
    return statusCode;
  }

  public void setStatusCode(int statusCode) {
    this.statusCode = statusCode;
  }

  public T getEntity() {
    return entity;
  }

  public void setEntity(T entity) {
    this.entity = entity;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }
  
  public boolean ok() {
    return statusCode >= 200 && statusCode < 300;
  }
  
  private int statusCode;
  private T entity;
  private String message;

}
