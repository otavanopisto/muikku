package fi.muikku.plugins.hsqldb;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import org.hsqldb.Server;
import org.hsqldb.persist.HsqlProperties;
import org.hsqldb.server.ServerAcl.AclFormatException;
import org.hsqldb.server.ServerConfiguration;

import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class HSQLDBPluginDescriptor implements PluginDescriptor {

	@Override
	public String getName() {
		return "hsqldb";
	}

	@Override
	public void init() {
		HsqlProperties props = new HsqlProperties();
	   
    ServerConfiguration.translateDefaultDatabaseProperty(props);
    Server server = new Server();
    try {
			server.setProperties(props);
	    server.start();
		} catch (IOException e) {
			// TODO: Proper error handling
			e.printStackTrace();
			throw new RuntimeException(e);
		} catch (AclFormatException e) {
			// TODO: Proper error handling
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	@Override
	public List<Class<?>> getBeans() {
		return new ArrayList<Class<?>>(Arrays.asList(
			HSQLDBPluginController.class
		));
	}

}