package fi.muikku.plugins.internallogin;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.controller.WidgetController;
import fi.muikku.i18n.LocaleBundle;
import fi.muikku.i18n.LocaleLocation;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugins.internallogin.dao.PasswordResetRequestDAO;
import fi.muikku.plugins.internallogin.model.PasswordResetRequest;

@ApplicationScoped
@Stateful
public class InternalLoginPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor, LocalizedPluginDescriptor {

  @Inject
  private WidgetController widgetController;

  @Override
  public String getName() {
    return "internallogin";
  }
  
  @Override
  public void init() {
  }

  @Override
  public List<Class<?>> getBeans() {
    return new ArrayList<Class<?>>(Arrays.asList(
    	
    	/* Controllers */
      
    	InternalLoginController.class,
      
    	/* DAOs*/
    	
      PasswordResetRequestDAO.class,
    	
      /* Backing Beans */
      
      ForgotPasswordBackingBean.class,      
      ResetPasswordBackingBean.class      
    ));
  }
  
  @Override
  public Class<?>[] getEntities() {
  	return new Class<?>[] {
      PasswordResetRequest.class
  	};
  }

  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.internallogin.InternalLoginPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.internallogin.InternalLoginPluginMessages", LocaleUtils.toLocale("en"))));
    return bundles;
  }

}
