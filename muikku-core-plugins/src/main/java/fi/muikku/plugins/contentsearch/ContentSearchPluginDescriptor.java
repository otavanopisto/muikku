package fi.muikku.plugins.contentsearch;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.controller.WidgetController;
import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class ContentSearchPluginDescriptor implements PluginDescriptor {
	
  @Inject
  private WidgetController widgetController;

	@Override
	public String getName() {
		return "contentsearch";
	}
	
	@Override
	public void init() {

	}

	@Override
	public List<Class<?>> getBeans() {
		return new ArrayList<Class<?>>(Arrays.asList(
			/* DAOs */	
		  
		  /* Controllers */
		  
		  /* Misc */
		  
      ContentSearchSeekerResultProvider.class
		));
	}
	
}
