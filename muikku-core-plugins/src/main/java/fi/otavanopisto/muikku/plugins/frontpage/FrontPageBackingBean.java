package fi.otavanopisto.muikku.plugins.frontpage;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.transaction.Transactional;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.session.SessionController;

@Named
@RequestScoped
@Join(path = "/", to = "/index.jsf")
public class FrontPageBackingBean {
  
  @Inject
  PluginSettingsController pluginSettingsController;
  
  @Inject
  private SessionController sessionController;
  
  @RequestAction
  @Transactional
  public String init() {
    
    System.out.println("FrontPageBackingBean commented out, not making any loggedin logic to switch front pages");
    
//    if ("no".equals(pluginSettingsController.getPluginSetting("frontPage", "brandedFrontPage"))) {
//      brandedFrontPage = false;
//    } else {
//      brandedFrontPage = true;
//    }
//   
//    boolean isLoggedIn = sessionController.isLoggedIn();
//    if (!isLoggedIn && brandedFrontPage){
//      return "/index.frontpage.xhtml";
//    } else if (!isLoggedIn){
//      return "/index.frontpage.nonbranded.xhtml";
//    }
    return null;
  }

  public boolean isBrandedFrontPage() {
    return brandedFrontPage;
  }
  
  private boolean brandedFrontPage;
}
