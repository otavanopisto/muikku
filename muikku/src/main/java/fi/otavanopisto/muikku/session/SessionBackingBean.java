package fi.otavanopisto.muikku.session;

import java.util.Locale;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.otavanopisto.muikku.i18n.LocaleController;

@RequestScoped
@Named
@Stateful
public class SessionBackingBean {

  @Inject
  private SessionController sessionController;

  @Inject
  private LocaleController localeController;

  @Inject
  private CurrentUserSession currentUserSession;

  public boolean getLoggedIn() {
    return sessionController.isLoggedIn();
  }
  
  public boolean getIsActiveUser() {
    return currentUserSession.isActive();
  }

  public Locale getLocale() {
    return localeController.resolveLocale(sessionController.getLocale());
  }

}