package fi.muikku.plugins.dnm.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.plugins.dnm.DeusNexMachinaPluginDescriptor;

@ApplicationScoped
public class DeusNexImportQueueController {

  @Inject
  private PluginSettingsController pluginSettingsController;

  public synchronized List<Long> getPendingDownloads() {
    List<Long> result = new ArrayList<>();
    
    String pendingImports = pluginSettingsController.getPluginSetting(DeusNexMachinaPluginDescriptor.PLUGIN_NAME, "pending-imports");
    if (StringUtils.isNotBlank(pendingImports)) {
      for (String value : Arrays.asList(pendingImports.split(","))) {
        result.add(NumberUtils.createLong(value));
      }
    }
    
    return result;
  }

  public void setPendingDownloads(List<Long> pendingDownloads) {
    pluginSettingsController.setPluginSetting(DeusNexMachinaPluginDescriptor.PLUGIN_NAME, "pending-imports", StringUtils.join(pendingDownloads, ","));
  }
  
  public synchronized void addPendingDownload(Long no) {
    List<Long> pendingDownloads = getPendingDownloads();
    pendingDownloads.add(no);
    setPendingDownloads(pendingDownloads);
  }
  
  public synchronized void addPendingDownloads(List<Long> nos) {
    List<Long> pendingDownloads = getPendingDownloads();
    pendingDownloads.addAll(nos);
    setPendingDownloads(pendingDownloads);
  }
  
  public synchronized Long popPendingDownload() {
    List<Long> pendingDownloads = getPendingDownloads();
    if (pendingDownloads.isEmpty()) {
      return null;
    }
    
    Long no = pendingDownloads.remove(pendingDownloads.size() - 1);
    
    setPendingDownloads(pendingDownloads);
    
    return no;
  }
  
  public synchronized Long getLastUpdate() {
    String lastUpdate = pluginSettingsController.getPluginSetting(DeusNexMachinaPluginDescriptor.PLUGIN_NAME, "last-update");
    if (StringUtils.isNotBlank(lastUpdate)) {
      return NumberUtils.createLong(lastUpdate);
    } 
    
    return null;
  }

  public synchronized void setLastUpdate(Long time) {
    pluginSettingsController.setPluginSetting(DeusNexMachinaPluginDescriptor.PLUGIN_NAME, "last-update", String.valueOf(time));
  }
}
