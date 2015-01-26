package fi.muikku.i18n;

import java.util.Map;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.session.SessionController;

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

}
