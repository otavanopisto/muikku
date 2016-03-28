package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.cache;

public class CachedEntity <T> {

  public CachedEntity(T data, Long expires) {
    super();
    this.data = data;
    this.expires = expires;
  }

  public T getData() {
    return data;
  }

  public Long getExpires() {
    return expires;
  }

  private T data;
  private Long expires;
}
