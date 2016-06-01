package fi.otavanopisto.muikku.plugins.language;

import java.util.Locale;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.LocaleUtils;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.session.local.LocalSession;
import fi.otavanopisto.muikku.session.local.LocalSessionController;
import fi.otavanopisto.muikku.users.UserEntityController;

@Named
@Stateful
@RequestScoped  
public class LanguageWidgetBackingBean {
  
  @Inject
  @LocalSession
  private LocalSessionController localSessionController;

  @Inject
  private UserEntityController userEntityController;
  
  @RequestAction
  public String load() {
    return null;
  }

  public String setLanguage(String language){
    Locale locale = LocaleUtils.toLocale(language);
    localSessionController.setLocale(locale);
    
    if (localSessionController.isLoggedIn()) {
      userEntityController.updateLocale(localSessionController.getLoggedUserEntity(), locale);
    }
    
    return "/index.jsf?faces-redirect=true";
  }
  
}

