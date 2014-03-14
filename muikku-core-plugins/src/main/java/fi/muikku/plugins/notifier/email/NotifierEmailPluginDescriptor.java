package fi.muikku.plugins.notifier.email;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.controller.WidgetController;
import fi.muikku.i18n.LocaleBundle;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.RESTPluginDescriptor;

@ApplicationScoped
@Stateful
public class NotifierEmailPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor, RESTPluginDescriptor, LocalizedPluginDescriptor {
	
  @Inject
  private WidgetController widgetController;

	@Override
	public String getName() {
		return "notifier-email";
	}
	
	@Override
	public void init() {

	}

	@Override
	public List<Class<?>> getBeans() {
		return new ArrayList<Class<?>>(Arrays.asList(
			/* DAOs */	
		  
		    
		  /* Controllers */
		  
		  NotifierEmailMethod.class
		  
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
		};
	}

  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    
    return bundles;
  }

}
