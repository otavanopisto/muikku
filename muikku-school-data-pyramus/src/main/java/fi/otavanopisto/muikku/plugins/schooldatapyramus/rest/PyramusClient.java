package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest;

import javax.ws.rs.client.Entity;

public interface PyramusClient {

  public <T> T post(String path, Entity<?> entity, Class<T> type);

  public <T> T post(String path, T entity);
  
  public <T> T put(String path, Entity<?> entity, Class<T> type);

  public <T> T put(String path, T entity);

  public <T> T get(String path, Class<T> type);

  public void delete(String path);
}