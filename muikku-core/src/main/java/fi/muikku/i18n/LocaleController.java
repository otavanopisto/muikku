package fi.muikku.i18n;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

@ApplicationScoped
public class LocaleController {

	@Inject
	private Logger logger;
	
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

  public String getCurrentDate(Locale locale) {
    return DateFormatUtils.format(new Date(), localeMaps.get(locale.getLanguage()).get("datePattern"));
  }

  public String getCurrentTime(Locale locale) {
    return DateFormatUtils.format(new Date(), localeMaps.get(locale.getLanguage()).get("timePattern"));
  }

  public Long getJsLastModified(Locale locale) {
  	if (locale == null) {
  		logger.warning("Tried to resolve last modified date of null locale");
  		return null;
  	}
  	
    Date date = jsLastModified.get(locale.getLanguage());
    if (date == null) {
      date = new Date((System.currentTimeMillis() / 1000) * 1000);
      jsLastModified.put(locale.getLanguage(), date);
    }
    
    return date.getTime();
  }

  public String getJsLocales(Locale locale) throws JsonGenerationException, JsonMappingException, IOException {
    Map<String, String> entries = jsLocaleMaps.get(locale.getLanguage());
    StringBuffer sb = new StringBuffer();
    if (entries != null) {
      sb.append("(function() {")
        .append("window._MUIKKU_LOCALE='")
        .append(locale.getLanguage())
        .append("';")
        .append("window._MUIKKU_LOCALEMAP = ")
        .append((new ObjectMapper()).writeValueAsString(entries))
        .append("}).call(this);");
    }
    return sb.toString();
  }

  public Map<String, String> getText(Locale locale) {
    return localeMaps.get(locale.getLanguage());
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

  private Map<String, Map<String, String>> localeMaps = new HashMap<String, Map<String, String>>();
  private Map<String, Map<String, String>> jsLocaleMaps = new HashMap<String, Map<String, String>>();
  private Map<String, Date> jsLastModified = new HashMap<String, Date>();
}
