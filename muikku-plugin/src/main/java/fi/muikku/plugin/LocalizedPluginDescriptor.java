package fi.muikku.plugin;

import java.util.List;

import fi.muikku.i18n.LocaleBundle;

public interface LocalizedPluginDescriptor {
  
  public List<LocaleBundle> getLocaleBundles();

}
