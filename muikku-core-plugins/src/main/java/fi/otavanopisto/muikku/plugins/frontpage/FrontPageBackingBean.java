package fi.otavanopisto.muikku.plugins.frontpage;

import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.controller.PluginSettingsController;

@Named
@RequestScoped
public class FrontPageBackingBean {
  
  PluginSettingsController pluginSettingsController;
  
  @RequestAction
  public String init() {
    
    if ("yes" == pluginSettingsController.getPluginSetting("frontPage", "brandedFrontPage")) {
      brandedFrontPage = true;
    } else {
      brandedFrontPage = false;
    }
    
    return null;
  }

  public boolean isBrandedFrontPage() {
    return brandedFrontPage;
  }
  
  private boolean brandedFrontPage;
}
