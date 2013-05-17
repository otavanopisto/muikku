package fi.muikku.i18n;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.session.SessionController;

@Named ("i18n")
@Stateful
@ApplicationScoped
public class LocaleVault {
  
  public static void add(List<ResourceBundle> bundles) {
    for (ResourceBundle bundle : bundles) {
      add(bundle);
    }
  }

  public static void add(ResourceBundle bundle) {
    String language = bundle.getLocale().getLanguage();
    Enumeration<String> keys = bundle.getKeys();
    String key;
    while (keys.hasMoreElements()) {
      key = keys.nextElement();
      add(language, key, bundle.getString(key));
    }
  }
  
  public static void add(String language, String key, String value) {
    Map<String, String> entries = localeMaps.get(language);
    if (entries == null) {
      entries = new HashMap<String, String>();
      localeMaps.put(language, entries);
    }
    entries.put(key, value);
  }
  
  public Map<String, String> getText() {
    return localeMaps.get(sessionController.getLocale().getLanguage());
  }

  @Inject
  private SessionController sessionController;

  private static Map<String,Map<String,String>> localeMaps = new HashMap<String,Map<String,String>>();
  
}
