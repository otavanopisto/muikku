package fi.muikku.plugins.h2db;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class H2DBPluginDescriptor implements PluginDescriptor {

	@Override
	public String getName() {
		return "h2db";
	}

	@Override
	public void init() {
		
	}

	@Override
	public List<Class<?>> getBeans() {
		return new ArrayList<Class<?>>(Arrays.asList(
			/* Controllers */
				
			H2DBPluginController.class,
			
			/* Data Plugin Scripts Handlers */
			
			H2DBDataPluginScriptHandler.class
		));
	}

}