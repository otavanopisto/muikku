package fi.muikku.plugins.frontpage;

import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.i18n.LocaleBundle;
import fi.muikku.i18n.LocaleLocation;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;

public class FrontPagePluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {

  @Override
  public void init() {
  }

  @Override
  public String getName() {
    return "frontPage";
  }

  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.frontpage.FrontPagePluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.frontpage.FrontPagePluginMessages", LocaleUtils.toLocale("en"))));

    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.frontpage.FrontPageJsPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.frontpage.FrontPageJsPluginMessages", LocaleUtils.toLocale("en"))));

    return bundles;
  }

}
