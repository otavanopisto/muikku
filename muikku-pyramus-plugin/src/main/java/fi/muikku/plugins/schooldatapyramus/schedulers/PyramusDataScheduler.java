package fi.muikku.plugins.schooldatapyramus.schedulers;

import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.controller.PluginSettingsController;

public abstract class PyramusDataScheduler {

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  public abstract String getSchedulerName();

  protected int getOffset() {
    return NumberUtils.toInt(pluginSettingsController.getPluginSetting("school-data-pyramus", "pyramus-updater." + getSchedulerName() + ".offset"));
  }
  
  protected void updateOffset(int newOffset) {
    pluginSettingsController.setPluginSetting("school-data-pyramus", "pyramus-updater." + getSchedulerName() + ".offset", String.valueOf(newOffset));
  }
  
}
