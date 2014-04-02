package fi.muikku.plugins.notifier;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.controller.WidgetController;
import fi.muikku.i18n.LocaleBundle;
import fi.muikku.notifier.NotifierController;
import fi.muikku.plugin.AfterPluginsInitEvent;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.RESTPluginDescriptor;

@ApplicationScoped
@Stateful
public class NotifierPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor, RESTPluginDescriptor, LocalizedPluginDescriptor {

  @Inject
  private NotifierController notifierController;
  
	@Override
	public String getName() {
		return "notifier";
	}
	
	@Override
	public void init() {

	}

  public void onAfterPluginsInit(@Observes AfterPluginsInitEvent event) {
    try {
      notifierController.processActionsAndMethods();
    } catch (Exception e) {
      // TODO: Proper error handling
      e.printStackTrace();
      throw new RuntimeException(e);
    }
  }

  @Override
	public List<Class<?>> getBeans() {
		return new ArrayList<Class<?>>(Arrays.asList(
			/* DAOs */	
		  
		    
		  /* Controllers */
		  
		  UserNotifierSettingsBackingBean.class
		  
		  /* Misc */
		  
		));
	}
	
	@Override
	public Class<?>[] getEntities() {
		return new Class<?>[] {
		};
	}
	
	@Override
	public Class<?>[] getRESTServices() {
		return new Class<?>[] {
		    NotifierRESTService.class
		};
	}

  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    
    return bundles;
  }

}
