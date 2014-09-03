package fi.muikku.plugins.hsqldb;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.hsqldb.Server;
import org.hsqldb.persist.HsqlProperties;
import org.hsqldb.server.ServerAcl.AclFormatException;
import org.hsqldb.server.ServerConfiguration;

import fi.muikku.plugin.PluginDescriptor;

public class HSQLDBPluginDescriptor implements PluginDescriptor {

	@Override
	public String getName() {
		return "hsqldb";
	}

	@PostConstruct
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

}