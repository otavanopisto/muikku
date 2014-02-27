package fi.muikku.plugins.oauth;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.PluginLibraryDescriptor;

public class FacebookOAuthPluginLibraryDescriptor implements PluginLibraryDescriptor {
	
	@Override
	public String getName() {
		return "facebook-oauth";
	}
	
	@Override
	public List<Class<? extends PluginDescriptor>> getPlugins() {
		return new ArrayList<Class<? extends PluginDescriptor>>(Arrays.asList(
		  FacebookOAuthPluginDescriptor.class
		));
	}
	
}
