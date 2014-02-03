package fi.muikku.plugins;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.PluginLibraryDescriptor;
import fi.muikku.plugins.mail.dummy.JndiMailBridgePluginDescriptor;

public class JndiMailBridgePluginLibraryDescriptor implements PluginLibraryDescriptor {

	@Override
	public String getName() {
		return "jndi-mail-bridge";
	}

	@Override
	public List<Class<? extends PluginDescriptor>> getPlugins() {
		return new ArrayList<Class<? extends PluginDescriptor>>(
		  Arrays.asList(JndiMailBridgePluginDescriptor.class)
		);
	}
}