package fi.muikku.plugins;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.PluginLibraryDescriptor;
import fi.muikku.plugins.schooldatamock.SchoolDataMockPluginDescriptor;

public class SchoolDataMockPluginLibraryDescriptor implements PluginLibraryDescriptor {

	@Inject
	private Logger logger;

	@Override
	public String getName() {
		return "school-data-mock";
	}

	@Override
	public List<Class<? extends PluginDescriptor>> getPlugins() {
		return new ArrayList<Class<? extends PluginDescriptor>>(
		  Arrays.asList(SchoolDataMockPluginDescriptor.class)
		);
	}
}