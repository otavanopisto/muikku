package fi.otavanopisto.muikku.plugin;

import java.io.Serializable;

public class PluginEvent implements Serializable {
  private static final long serialVersionUID = -5370989951525022669L;

  public String getPluginName() {
    return pluginName;
  }

  public void setPluginName(String pluginName) {
    this.pluginName = pluginName;
  }

  private String pluginName;
}