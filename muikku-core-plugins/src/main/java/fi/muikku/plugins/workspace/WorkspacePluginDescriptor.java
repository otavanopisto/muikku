package fi.muikku.plugins.workspace;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.controller.WidgetController;
import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class WorkspacePluginDescriptor implements PluginDescriptor {

	@Inject
	private WidgetController widgetController;
	
	@Override
	public String getName() {
		return "workspace";
	}
	
	@Override
	public void init() {
	}

	@Override
	public List<Class<?>> getBeans() {
		return Collections.unmodifiableList(Arrays.asList(new Class<?>[] { 
		  
			/* Backing beans */ 
				
			WorkspaceViewBackingBean.class
			
		}));
	}

}
