package fi.muikku.plugins.announcer;

import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;

import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.i18n.LocaleBundle;
import fi.muikku.i18n.LocaleLocation;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;

public class AnnouncerPluginDescriptor implements LocalizedPluginDescriptor, PluginDescriptor {

  @Override
  public void init() {
  }

  @Override
  public String getName() {
    return "announcer";
  }

  @Override
  public List<LocaleBundle> getLocaleBundles() {
    return Arrays.asList(
        new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.announcer.Messages",
            LocaleUtils.toLocale("fi"))),
        new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.announcer.Messages",
            LocaleUtils.toLocale("en"))),
        new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.announcer.JsMessages",
            LocaleUtils.toLocale("fi"))),
        new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.announcer.JsMessages",
            LocaleUtils.toLocale("en"))));
  }

}
