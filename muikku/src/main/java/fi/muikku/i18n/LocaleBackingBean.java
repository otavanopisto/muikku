package fi.muikku.i18n;

import java.util.Map;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.session.SessionController;

@Named("i18n")
@Stateful
@RequestScoped
public class LocaleBackingBean {

  @Inject
  private SessionController sessionController;
  
  @Inject
  private LocaleController localeController;

  public long getJsLastModified(String language) {
    return localeController.getJsLastModified(LocaleUtils.toLocale(language));
  }

  public String getJsLocales(String language) {
    return localeController.getJsLocales(LocaleUtils.toLocale(language));
  }

  public Map<String, String> getText() {
    return localeController.getText(sessionController.getLocale());
  }

}
