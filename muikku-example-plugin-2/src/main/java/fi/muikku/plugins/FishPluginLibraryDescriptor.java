package fi.muikku.plugins;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.PluginLibraryDescriptor;
import fi.muikku.plugins.fish.StatefulFishPluginDescriptor;
import fi.muikku.plugins.fish.LocalizedFishPluginDescriptor;

public class FishPluginLibraryDescriptor implements PluginLibraryDescriptor {

	@Override
	public String getName() {
		return "fish";
	}
	
	@Override
	public List<Class<? extends PluginDescriptor>> getPlugins() {
		return new ArrayList<Class<? extends PluginDescriptor>>(Arrays.asList(
		  LocalizedFishPluginDescriptor.class
		));
	}
}
