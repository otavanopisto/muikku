package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;

public abstract class PyramusDataScheduler {

  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private PyramusSchedulerOffsetController offsetController;
  
  public abstract String getSchedulerName();
  
  public boolean isEnabled() {
    return NumberUtils.toInt(pluginSettingsController.getPluginSetting(
        "school-data-pyramus",
        "pyramus-updater." + getSchedulerName() + ".disable")) == 0;
  }

  protected int getAndUpdateCurrentOffset(int batchSize) {
    return offsetController.getAndUpdateCurrentOffset(getSchedulerName(), batchSize);
  }

  protected void resetCurrentOffset() {
    offsetController.updateOffset(getSchedulerName(), 0);
  }
  
}
