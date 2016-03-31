package fi.otavanopisto.muikku.plugins;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import fi.otavanopisto.muikku.plugin.PluginDescriptor;
import fi.otavanopisto.muikku.plugin.PluginLibraryDescriptor;
import fi.otavanopisto.muikku.plugins.fish.DatabaseFishPluginDescriptor;

public class FishPluginLibraryDescriptor implements PluginLibraryDescriptor {

	@Override
	public String getName() {
		return "example-plugin-3";
	}
	
	@Override
	public List<Class<? extends PluginDescriptor>> getPlugins() {
		return new ArrayList<Class<? extends PluginDescriptor>>(Arrays.asList(
		  DatabaseFishPluginDescriptor.class
		));
	}
}
