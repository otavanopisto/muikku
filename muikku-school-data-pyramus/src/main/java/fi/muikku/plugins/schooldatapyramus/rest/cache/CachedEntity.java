package fi.muikku.plugins.schooldatapyramus.rest.cache;

public class CachedEntity <T> {

  public CachedEntity(T data, Long expires) {
    super();
    this.hits = 0;
    this.data = data;
    this.expires = expires;
  }

  public T getData() {
    return data;
  }

  public Long getExpires() {
    return expires;
  }
  
  public int getHits() {
    return hits;
  }
  
  public void incHit() {
    hits++;
  }

  private T data;
  private Long expires;
  private int hits;
}
