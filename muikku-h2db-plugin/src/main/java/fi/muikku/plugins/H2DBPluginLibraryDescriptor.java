package fi.muikku.plugins;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.PluginLibraryDescriptor;
import fi.muikku.plugins.h2db.H2DBPluginDescriptor;

public class H2DBPluginLibraryDescriptor implements PluginLibraryDescriptor {

	@Override
	public String getName() {
		return "h2db";
	}

	@Override
	public List<Class<? extends PluginDescriptor>> getPlugins() {
		return new ArrayList<Class<? extends PluginDescriptor>>(
		  Arrays.asList(H2DBPluginDescriptor.class)
		);
	}
}