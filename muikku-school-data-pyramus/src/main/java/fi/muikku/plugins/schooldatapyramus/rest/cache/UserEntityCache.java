package fi.muikku.plugins.schooldatapyramus.rest.cache;

import javax.enterprise.context.SessionScoped;
import java.io.Serializable;

@SessionScoped
public class UserEntityCache extends AbstractEntityCache implements Serializable {

  private static final long serialVersionUID = 504449191707036481L;

  @Override
  public String getType() {
    return "USER";
  }
  
  @Override
  public int getMaxEntries() {
    return 500;
  }
 
}
