package fi.muikku.plugins.schooldatapyramus.rest.cache;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SystemEntityCache extends AbstractEntityCache {

  @Override
  public String getType() {
    return "SYSTEM";
  }
  
  @Override
  public int getMaxEntries() {
    return 1000;
  }
 
}
