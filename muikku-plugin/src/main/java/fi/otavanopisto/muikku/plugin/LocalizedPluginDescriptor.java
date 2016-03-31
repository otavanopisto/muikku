package fi.otavanopisto.muikku.plugin;

import java.util.List;

import fi.otavanopisto.muikku.i18n.LocaleBundle;

public interface LocalizedPluginDescriptor {
  
  public List<LocaleBundle> getLocaleBundles();

}
