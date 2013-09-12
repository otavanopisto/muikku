package fi.muikku.plugins.fish;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.Random;

@Named
@RequestScoped
public class RestFishWidgetBackingBean {
  
  public long getUpdateInterval() {
    return RestFishPluginDescriptor.FISH_WIDGET_UPDATE_INTERVAL;
  }
  
}
