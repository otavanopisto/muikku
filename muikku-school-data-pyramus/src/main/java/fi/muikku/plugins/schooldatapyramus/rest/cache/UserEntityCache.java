package fi.muikku.plugins.schooldatapyramus.rest.cache;

import javax.ejb.Stateful;
import javax.enterprise.context.SessionScoped;

@Stateful
@SessionScoped
public class UserEntityCache extends AbstractEntityCache {

  @Override
  public String getType() {
    return "USER";
  }
  
  @Override
  public int getMaxEntries() {
    return 100;
  }
 
}
