package fi.muikku.plugins.googlecalendar;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class GoogleCalendarPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor {
	
	@Override
	public String getName() {
		return "google-calendar";
	}
	
	@Override
	public void init() {
	}

	@Override
	public List<Class<?>> getBeans() {
		return Collections.unmodifiableList(Arrays.asList(new Class<?>[] { 
	    GoogleCalendarServiceProvider.class,
	    GoogleLoginListener.class,
	    GoogleCalendarClient.class
		}));
	}
	
	@Override
	public Class<?>[] getEntities() {
		return new Class<?>[] {
		};
	}

}
