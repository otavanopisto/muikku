package fi.muikku.i18n;

import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.time.DateFormatUtils;

import fi.muikku.session.SessionController;

@Named ("i18n")
@Stateful
@ApplicationScoped
public class LocaleBackingBean {

  @Inject
  private SessionController sessionController;
  
  public void add(List<ResourceBundle> bundles) {
    for (ResourceBundle bundle : bundles) {
      add(bundle);
    }
  }

  public void add(ResourceBundle bundle) {
    String language = bundle.getLocale().getLanguage();
    Enumeration<String> keys = bundle.getKeys();
    String key;
    while (keys.hasMoreElements()) {
      key = keys.nextElement();
      add(language, key, bundle.getString(key));
    }
  }
  
  public void add(String language, String key, String value) {
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
  
  public String getCurrentDate() {
    return DateFormatUtils.format(new Date(), getValue("datePattern"));
  }

  public String getCurrentTime() {
    return DateFormatUtils.format(new Date(), getValue("timePattern"));
  }
  
  private String getValue(String key) {
    return localeMaps.get(sessionController.getLocale().getLanguage()).get(key);
  }
  
  private Map<String,Map<String,String>> localeMaps = new HashMap<String,Map<String,String>>();
  
}
