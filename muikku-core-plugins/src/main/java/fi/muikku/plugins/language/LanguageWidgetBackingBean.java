package fi.muikku.plugins.language;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionController;

@Named
@Stateful
@RequestScoped  
public class LanguageWidgetBackingBean {
  
  @Inject
  @LocalSession
  private LocalSessionController localSessionController;

  public void setLanguage(String language) {
    localSessionController.setLocale(LocaleUtils.toLocale(language));
  }
  
}
