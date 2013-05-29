package fi.muikku.i18n;

import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.time.DateFormatUtils;

import fi.muikku.session.SessionController;

@Named("i18n")
@Stateful
@ApplicationScoped
public class LocaleBackingBean {

  @Inject
  private SessionController sessionController;

  public void add(LocaleLocation location, List<ResourceBundle> bundles) {
    for (ResourceBundle bundle : bundles) {
      add(location, bundle);
    }
  }

  public void add(LocaleLocation location, ResourceBundle bundle) {
    String language = bundle.getLocale().getLanguage();
    Enumeration<String> keys = bundle.getKeys();
    String key;
    while (keys.hasMoreElements()) {
      key = keys.nextElement();
      add(location, language, key, bundle.getString(key));
    }
  }

  public void add(LocaleLocation location, String language, String key, String value) {
    Map<String, String> entries;
    if (location != LocaleLocation.JAVASCRIPT) {
      entries = localeMaps.get(language);
      if (entries == null) {
        entries = new HashMap<String, String>();
        localeMaps.put(language, entries);
      }
      entries.put(key, value);
    }
    if (location != LocaleLocation.APPLICATION) {
      entries = jsLocaleMaps.get(language);
      if (entries == null) {
        entries = new HashMap<String, String>();
        jsLocaleMaps.put(language, entries);
      }
      entries.put(key, value);
    }
  }

  public String getCurrentDate() {
    return DateFormatUtils.format(new Date(), localeMaps.get(sessionController.getLocale().getLanguage()).get("datePattern"));
  }

  public String getCurrentTime() {
    return DateFormatUtils.format(new Date(), localeMaps.get(sessionController.getLocale().getLanguage()).get("timePattern"));
  }

  public long getJsLastModified(String language) {
    Date d = jsLastModified.get(language);
    if (d == null) {
      d = new Date((System.currentTimeMillis() / 1000) * 1000);
      jsLastModified.put(language, d);
    }
    return d.getTime();
  }

  public String getJsLocales(Locale locale) {
    Map<String, String> entries = jsLocaleMaps.get(locale.getLanguage());
    StringBuffer sb = new StringBuffer();
    if (entries != null) {
      sb.append("(function() {window._MUIKKU_LOCALEMAP = {");
      String key;
      Iterator<String> keyIterator = entries.keySet().iterator();
      while (keyIterator.hasNext()) {
        key = keyIterator.next();
        sb.append("'");
        sb.append(key.replace("'", "\'"));
        sb.append("':'");
        sb.append(entries.get(key).replace("'", "\'"));
        sb.append("'");
        if (keyIterator.hasNext()) {
          sb.append(",");
        }
      }
      sb.append("};}).call(this);");
    }
    return sb.toString();
  }

  public Map<String, String> getText() {
    return localeMaps.get(sessionController.getLocale().getLanguage());
  }

  private Map<String, Map<String, String>> localeMaps = new HashMap<String, Map<String, String>>();
  private Map<String, Map<String, String>> jsLocaleMaps = new HashMap<String, Map<String, String>>();
  private Map<String, Date> jsLastModified = new HashMap<String, Date>();

}
