package fi.otavanopisto.muikku.plugins.organizationmanagement;

import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;

import org.apache.commons.lang3.LocaleUtils;

import fi.otavanopisto.muikku.i18n.LocaleBundle;
import fi.otavanopisto.muikku.i18n.LocaleLocation;
import fi.otavanopisto.muikku.plugin.LocalizedPluginDescriptor;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class OrganizationManagementPluginDescriptor implements LocalizedPluginDescriptor, PluginDescriptor {

  @Override
  public void init() {
  }

  @Override
  public String getName() {
    return "organization";
  }

  @Override
  public List<LocaleBundle> getLocaleBundles() {
    return Arrays.asList(
        new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.organization.OrganizationPluginMessages",
            LocaleUtils.toLocale("fi"))),
        new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.organization.OrganizationPluginMessages",
            LocaleUtils.toLocale("en"))),
        new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.organization.OrganizationJsPluginMessages",
            LocaleUtils.toLocale("fi"))),
        new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.organization.OrganizationJsPluginMessages",
            LocaleUtils.toLocale("en"))));
  }

}
