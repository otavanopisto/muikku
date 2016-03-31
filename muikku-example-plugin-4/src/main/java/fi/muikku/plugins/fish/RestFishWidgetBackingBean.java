package fi.otavanopisto.muikku.plugins.fish;

import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

@Named
@RequestScoped
public class RestFishWidgetBackingBean {
  
  public long getUpdateInterval() {
    return RestFishPluginDescriptor.FISH_WIDGET_UPDATE_INTERVAL;
  }
  
}
