package fi.otavanopisto.muikku.plugins.profile;

import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;

import org.apache.commons.lang3.LocaleUtils;

import fi.otavanopisto.muikku.plugin.LocalizedPluginDescriptor;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class ProfilePluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {

  @Override
  public void init() {
  }

  @Override
  public String getName() {
    return "profile";
  }
  
  @Override
  public List<ResourceBundle> getResourceBundles() {
    return Arrays.asList(
        ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.profile.ProfilePluginMessages", LocaleUtils.toLocale("en")),
        ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.profile.ProfilePluginMessages", LocaleUtils.toLocale("fi")));
  }

}
