package fi.otavanopisto.muikku.plugins.dnm.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.plugins.dnm.DeusNexMachinaPluginDescriptor;

@ApplicationScoped
public class DeusNexImportQueueController {

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  public Long getNextPendingDownload() {
    List<Long> pendingDownloads = getPendingDownloads();
    if (pendingDownloads.isEmpty()) {
      return null;
    }
    
    return pendingDownloads.get(0);
  }
  
  public List<Long> getImportNos() {
    List<Long> result = new ArrayList<>();
    
    String importNos = pluginSettingsController.getPluginSetting(DeusNexMachinaPluginDescriptor.PLUGIN_NAME, "import-nos");
    if (StringUtils.isBlank(importNos)) {
      return null;
    }
    
    for (String importNo : importNos.split(",")) {
      result.add(NumberUtils.createLong(importNo));
    }
    
    return result;
  }

  public void setPendingDownloads(List<Long> pendingDownloads) {
    pluginSettingsController.setPluginSetting(DeusNexMachinaPluginDescriptor.PLUGIN_NAME, "pending-imports", StringUtils.join(pendingDownloads, ","));
  }
  
  public void addPendingDownload(Long no) {
    List<Long> pendingDownloads = getPendingDownloads();
    pendingDownloads.add(no);
    setPendingDownloads(pendingDownloads);
  }
  
  public void removePendingDownload(Long no) {
    List<Long> pendingDownloads = getPendingDownloads();
    pendingDownloads.remove(no);
    setPendingDownloads(pendingDownloads);
  }
  
  public void addPendingDownloads(List<Long> nos) {
    List<Long> pendingDownloads = getPendingDownloads();
    for (Long no : nos) {
      if (!pendingDownloads.contains(no)) {
        pendingDownloads.add(no);
      }
    }

    setPendingDownloads(pendingDownloads);
  }
  
  public boolean isPendingDownload(Long no) {
    return getPendingDownloads().contains(no);
  }
  
  public void addDownloaded(Long no) {
    List<Long> nos = getDownloaded();
    nos.add(no);
    setDownloaded(nos);
  }
  
  public void addDownloaded(List<Long> nos) {
    List<Long> downloadedNos = getDownloaded();
    for (Long no : nos) {
      if (!downloadedNos.contains(no)) {
        downloadedNos.add(no);
      }
    }

    setDownloaded(downloadedNos);
  }
  
  public boolean isDownloaded(Long no) {
    return getDownloaded().contains(no);
  }

  private void setDownloaded(List<Long> nos) {
    pluginSettingsController.setPluginSetting(DeusNexMachinaPluginDescriptor.PLUGIN_NAME, "downloaded", StringUtils.join(nos, ","));
  }
  
  private List<Long> getDownloaded() {
    List<Long> result = new ArrayList<>();
    
    String downloaded = pluginSettingsController.getPluginSetting(DeusNexMachinaPluginDescriptor.PLUGIN_NAME, "downloaded");
    if (StringUtils.isNotBlank(downloaded)) {
      for (String value : Arrays.asList(downloaded.split(","))) {
        result.add(NumberUtils.createLong(value));
      }
    }
    
    return result;
  }

  public Long getLastUpdate() {
    String lastUpdate = pluginSettingsController.getPluginSetting(DeusNexMachinaPluginDescriptor.PLUGIN_NAME, "last-update");
    if (StringUtils.isNotBlank(lastUpdate)) {
      return NumberUtils.createLong(lastUpdate);
    } 
    
    return null;
  }

  public void setLastUpdate(Long time) {
    pluginSettingsController.setPluginSetting(DeusNexMachinaPluginDescriptor.PLUGIN_NAME, "last-update", String.valueOf(time));
  }

  private List<Long> getPendingDownloads() {
    List<Long> result = new ArrayList<>();
    
    String pendingImports = pluginSettingsController.getPluginSetting(DeusNexMachinaPluginDescriptor.PLUGIN_NAME, "pending-imports");
    if (StringUtils.isNotBlank(pendingImports)) {
      for (String value : Arrays.asList(pendingImports.split(","))) {
        result.add(NumberUtils.createLong(value));
      }
    }
    
    return result;
  }
}
