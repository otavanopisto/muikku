package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;

@Stateless
public class PyramusSchedulerOffsetController {

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public void updateOffset(String schedulerName, int newOffset) {
    pluginSettingsController.setPluginSetting("school-data-pyramus", "pyramus-updater." + schedulerName + ".offset", String.valueOf(newOffset));
  }

  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public int getAndUpdateCurrentOffset(String schedulerName, int batchSize) {
    int currentOffset = NumberUtils.toInt(pluginSettingsController.getPluginSetting("school-data-pyramus", "pyramus-updater." + schedulerName + ".offset"));
    pluginSettingsController.setPluginSetting("school-data-pyramus", "pyramus-updater." + schedulerName + ".offset", String.valueOf(currentOffset + batchSize));
    return currentOffset;
  }
  
}
