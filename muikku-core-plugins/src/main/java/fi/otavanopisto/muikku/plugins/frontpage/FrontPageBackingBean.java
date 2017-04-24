package fi.otavanopisto.muikku.plugins.frontpage;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.transaction.Transactional;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.controller.PluginSettingsController;

@Named
@RequestScoped
@Join(path = "/", to = "/index.jsf")
public class FrontPageBackingBean {
  
  @Inject
  PluginSettingsController pluginSettingsController;
  
  @RequestAction
  @Transactional
  public String init() {
    
    if ("no".equals(pluginSettingsController.getPluginSetting("frontPage", "brandedFrontPage"))) {
      brandedFrontPage = false;
    } else {
      brandedFrontPage = true;
    }
   
    if (!brandedFrontPage) {
      return "/index_nonbranded.jsf";
    } else {
      return null;
    }
  }

  public boolean isBrandedFrontPage() {
    return brandedFrontPage;
  }
  
  private boolean brandedFrontPage;
}
