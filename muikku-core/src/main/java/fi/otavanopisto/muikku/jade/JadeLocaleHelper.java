package fi.otavanopisto.muikku.jade;

import java.util.Locale;

import javax.inject.Inject;

import fi.otavanopisto.muikku.i18n.LocaleController;

public class JadeLocaleHelper {

  @Inject
  private LocaleController localeController;
  
  public String textWithParams(Locale locale, String key, Object... params) {
    return localeController.getText(locale, key, params);
  }
  
  public String text(Locale locale, String key) {
    return localeController.getText(locale, key);
  }
  
}
