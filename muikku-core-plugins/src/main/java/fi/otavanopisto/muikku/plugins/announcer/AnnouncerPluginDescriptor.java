package fi.otavanopisto.muikku.plugins.announcer;

import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;

import org.apache.commons.lang3.LocaleUtils;

import fi.otavanopisto.muikku.plugin.LocalizedPluginDescriptor;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class AnnouncerPluginDescriptor implements LocalizedPluginDescriptor, PluginDescriptor {

  @Override
  public void init() {
  }

  @Override
  public String getName() {
    return "announcer";
  }

  @Override
  public List<ResourceBundle> getResourceBundles() {
    return Arrays.asList(
        ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.announcer.AnnouncerPluginMessages", LocaleUtils.toLocale("fi")),
        ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.announcer.AnnouncerPluginMessages", LocaleUtils.toLocale("en")));
  }

}
