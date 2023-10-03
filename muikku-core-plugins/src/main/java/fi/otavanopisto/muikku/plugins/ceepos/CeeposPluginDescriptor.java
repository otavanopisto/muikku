package fi.otavanopisto.muikku.plugins.ceepos;

import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;

import org.apache.commons.lang3.LocaleUtils;

import fi.otavanopisto.muikku.plugin.LocalizedPluginDescriptor;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class CeeposPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {

  @Override
  public void init() {
  }

  @Override
  public String getName() {
    return "ceepos";
  }

  @Override
  public List<ResourceBundle> getResourceBundles() {
    return Arrays.asList(
        ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.ceepos.CeeposPluginMessages", LocaleUtils.toLocale("fi")),
        ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.ceepos.CeeposPluginMessages", LocaleUtils.toLocale("en")));
  }
}
