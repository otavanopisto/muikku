package fi.otavanopisto.muikku.jade;

import java.util.Locale;

import javax.inject.Inject;

import fi.otavanopisto.muikku.i18n.LocaleController;

public class JadeLocaleHelper {

  @Inject
  private LocaleController localeController;
  
  public JadeLocaleHelper(Locale locale) {
    this.locale = locale;
  }
  
  public String textWithParams(String key, Object... params) {
    return localeController.getText(locale, key, params);
  }
  
  public String text(String key) {
    return localeController.getText(locale, key);
  }
  
  public String language() {
    return locale.getLanguage();
  }

  public String locale() {
    return locale.toString();
  }
  
  private Locale locale;
}
