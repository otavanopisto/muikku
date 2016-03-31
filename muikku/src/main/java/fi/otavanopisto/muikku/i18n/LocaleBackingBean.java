package fi.otavanopisto.muikku.i18n;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.session.SessionController;

@Named("i18n")
@Stateful
@RequestScoped
public class LocaleBackingBean {

  @Inject
  private SessionController sessionController;
  
  @Inject
  private LocaleController localeController;

  public Map<String, String> getText() {
    return localeController.getText(sessionController.getLocale());
  }
  
  public List<String> getLanguages() {
    List<String> result = localeController.getLanguages();
    String currentLanguage = sessionController.getLocale().getLanguage();
    Collections.sort(result);
    result.remove(currentLanguage);
    result.add(0, currentLanguage);
    return result;
  }

}
