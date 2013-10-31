package fi.muikku.plugins.dnm;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class DeusNexMachinaPluginDescriptor implements PluginDescriptor {

	@Override
	public String getName() {
		return "deus-nex-machina";
	}

	@Override
	public void init() {
	}

	@Override
	public List<Class<?>> getBeans() {
		return new ArrayList<Class<?>>(Arrays.asList(
				/* Controllers */
				
				DeusNexMachinaController.class,

				/* Backing beans */
				
				DeusNexMachinaImportBackingBean.class
		));
	}

}
