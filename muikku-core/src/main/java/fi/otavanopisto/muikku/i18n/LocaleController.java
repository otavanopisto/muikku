package fi.otavanopisto.muikku.i18n;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;

import org.apache.commons.lang3.time.DateFormatUtils;

@ApplicationScoped
public class LocaleController {

	@PostConstruct
	public void init() {
	  localeMaps = new HashMap<String, Map<String, String>>();
	}
	
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
    Map<String, String> entries;
    entries = localeMaps.get(language);
    if (entries == null) {
      entries = new HashMap<String, String>();
      localeMaps.put(language, entries);
    }
    entries.put(key, value);
  }

  public String getCurrentDate(Locale locale) {
    return DateFormatUtils.format(new Date(), localeMaps.get(resolveLocale(locale).getLanguage()).get("datePattern"));
  }

  public String getCurrentTime(Locale locale) {
    return DateFormatUtils.format(new Date(), localeMaps.get(resolveLocale(locale).getLanguage()).get("timePattern"));
  }

  public Map<String, String> getText(Locale locale) {
    return localeMaps.get(resolveLocale(locale).getLanguage());
  }
  
  public String getText(Locale locale, String key) {
    Map<String, String> localeMap = getText(locale);
    return localeMap.get(key);
  }
  
  public String getText(Locale locale, String key, Object[] params) {
    return MessageFormat.format(getText(locale, key), params);
  }
  
  public List<String> getLanguages() {
    return new ArrayList<String>(localeMaps.keySet());
  }

  public Locale resolveLocale(Locale locale) {
    try {
      if (locale == null) {
        locale = new Locale("fi");
      }
    } catch (Exception e) {
      locale = Locale.getDefault();
    }
    return locale;
  }
  
  private Map<String, Map<String, String>> localeMaps;

}
