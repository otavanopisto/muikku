package fi.muikku.plugins.fish;

import java.util.List;

import fi.muikku.plugin.PluginDescriptor;

public class FishPluginDescriptor implements PluginDescriptor {
	
	@Override
	public String getName() {
		return "fish";
	}
	
	@Override
	public void init() {
	}
	
	@Override
	public List<Class<?>> getBeans() {
		return null;
	}

}
