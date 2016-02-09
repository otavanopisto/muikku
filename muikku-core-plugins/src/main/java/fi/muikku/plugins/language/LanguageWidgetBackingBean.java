package fi.muikku.plugins.language;

import java.util.Locale;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;
import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionController;
import fi.muikku.users.UserEntityController;
import fi.muikku.utils.RequestUtils;

@Named
@Stateful
@RequestScoped  
public class LanguageWidgetBackingBean {
  
  @Inject
  @LocalSession
  private LocalSessionController localSessionController;

  @Inject
  private UserEntityController userEntityController;

  public String setLanguage(String language){
    Locale locale = LocaleUtils.toLocale(language);
    localSessionController.setLocale(locale);
    
    if (localSessionController.isLoggedIn()) {
      userEntityController.updateLocale(localSessionController.getLoggedUserEntity(), locale);
    }

    return RequestUtils.getViewIdWithRedirect(FacesContext.getCurrentInstance().getViewRoot().getViewId());
  }
  
}
