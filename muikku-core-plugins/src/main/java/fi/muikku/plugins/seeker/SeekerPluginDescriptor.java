package fi.muikku.plugins.seeker;

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
import fi.muikku.model.widgets.DefaultWidget;
import fi.muikku.model.widgets.Widget;
import fi.muikku.model.widgets.WidgetLocation;
import fi.muikku.model.widgets.WidgetVisibility;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.RESTPluginDescriptor;
import fi.muikku.plugins.seeker.defaultproviders.CourseSeekerResultProvider;
import fi.muikku.plugins.seeker.defaultproviders.UserSeekerResultProvider;

@ApplicationScoped
@Stateful
public class SeekerPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor, RESTPluginDescriptor, LocalizedPluginDescriptor {

  @Inject
  private WidgetController widgetController;

  @Override
	public String getName() {
		return "seeker";
	}
	
  @Override
  public void init() {
    Widget logoutWidget = widgetController.findWidget(getName());
    if (logoutWidget == null) {
      logoutWidget = widgetController.createWidget(getName(), WidgetVisibility.AUTHENTICATED);
    }
    
    // TODO This is wrong. So wrong. Atrocious, even!
    WidgetLocation widgetLocation = widgetController.findWidgetLocation("environment.header.left");
    if (widgetLocation == null) {
      widgetLocation = widgetController.createWidgetLocation("environment.header.left");
    }
    
    DefaultWidget defaultWidget = widgetController.findDefaultWidget(logoutWidget, widgetLocation);
    if (defaultWidget == null) {
      defaultWidget = widgetController.createDefaultWidget(logoutWidget, widgetLocation);
    }
  }

	@Override
	public List<Class<?>> getBeans() {
		return new ArrayList<Class<?>>(Arrays.asList(
			/* DAOs */	
//      CommunicatorMessageDAO.class,
//      CommunicatorMessageIdDAO.class,
//      CommunicatorMessageRecipientDAO.class,
//      CommunicatorMessageTemplateDAO.class,
//      CommunicatorMessageSignatureDAO.class,
		  
		  /* Controllers */
//		  CommunicatorController.class,
//		  
		  CourseSeekerResultProvider.class,
		  UserSeekerResultProvider.class
		));
	}
	
	@Override
	public Class<?>[] getEntities() {
		return new Class<?>[] {
//			CommunicatorMessage.class,
//			CommunicatorMessageId.class,
//			CommunicatorMessageRecipient.class,
//			CommunicatorMessageTemplate.class,
//			CommunicatorMessageSignature.class
		};
	}
	
	@Override
	public Class<?>[] getRESTServices() {
		return new Class<?>[] {
			SeekerRESTService.class
		};
	}

  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
//    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.communicator.CommunicatorJsPluginMessages", LocaleUtils.toLocale("fi"))));
//    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.communicator.CommunicatorJsPluginMessages", LocaleUtils.toLocale("en"))));
    return bundles;
  }
}
