package fi.muikku.plugins.mongolog;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class MongoLogPluginDescriptor implements PluginDescriptor {
	
	@Override
	public String getName() {
		return "mongo-log";
	}
	
	@Override
	public void init() {
	}

	@Override
	public List<Class<?>> getBeans() {
    return new ArrayList<Class<?>>(Arrays.asList(
        MongoLogProvider.class
    ));
	}

}
