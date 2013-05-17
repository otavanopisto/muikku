package fi.muikku.plugins;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.inject.Produces;
import javax.inject.Inject;

import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.PluginLibraryDescriptor;
import fi.muikku.plugin.TranquilEntityLookup;
import fi.muikku.plugin.TranquilEntityLookups;
import fi.muikku.plugin.TranquilEntityLookupsImpl;
import fi.muikku.plugins.calendar.CalendarPluginDescriptor;
import fi.muikku.plugins.communicator.CommunicatorPluginDescriptor;
import fi.muikku.plugins.coursepicker.CoursePickerPluginDescriptor;
import fi.muikku.plugins.defaults.DefaultsPluginDescriptor;
import fi.muikku.plugins.dock.DockPluginDescriptor;
import fi.muikku.plugins.fish.FishPluginDescriptor;
import fi.muikku.plugins.forum.ForumPluginDescriptor;
import fi.muikku.plugins.internallogin.InternalLoginPluginDescriptor;
import fi.muikku.plugins.wall.WallPluginDescriptor;

public class CorePluginsDescriptor implements PluginLibraryDescriptor {
	
	@Inject
	private Logger logger;

	@Override
	public String getName() {
		return "core-plugins";
	}
	
	@Override
	public List<Class<? extends PluginDescriptor>> getPlugins() {
		return new ArrayList<Class<? extends PluginDescriptor>>(Arrays.asList(
			DefaultsPluginDescriptor.class,
		  CalendarPluginDescriptor.class,
		  FishPluginDescriptor.class,
		  InternalLoginPluginDescriptor.class,
		  CommunicatorPluginDescriptor.class,
      CoursePickerPluginDescriptor.class,
      ForumPluginDescriptor.class,
      WallPluginDescriptor.class,
      DockPluginDescriptor.class
		));
	}
	
	@TranquilEntityLookup
	@Produces
	public TranquilEntityLookups productTranquilityEntityFactory() {
		try {
			return new TranquilEntityLookupsImpl(
			  fi.muikku.plugins.coreplugins.BaseLookup.class,
				fi.muikku.plugins.coreplugins.CompactLookup.class,
				fi.muikku.plugins.coreplugins.CompleteLookup.class
			);
		} catch (InstantiationException | IllegalAccessException e) {
			logger.log(Level.SEVERE, "Could not initialize tranquility entity factory for core plugins", e);
			return null;
		}
	}
}
