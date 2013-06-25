package fi.muikku.plugins.language;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;
import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionController;
import fi.muikku.utils.RequestUtils;

@Named
@Stateful
@RequestScoped  
public class LanguageWidgetBackingBean {
  
  @Inject
  @LocalSession
  private LocalSessionController localSessionController;

  public String setLanguage(String language){
    localSessionController.setLocale(LocaleUtils.toLocale(language));

    return RequestUtils.getViewIdWithRedirect(FacesContext.getCurrentInstance().getViewRoot().getViewId());
  }
  
}
