package fi.otavanopisto.muikku.plugins.hsqldb;

import java.io.IOException;

import org.hsqldb.Server;
import org.hsqldb.persist.HsqlProperties;
import org.hsqldb.server.ServerAcl.AclFormatException;
import org.hsqldb.server.ServerConfiguration;

import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class HSQLDBPluginDescriptor implements PluginDescriptor {

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
  public String getName() {
    return "hsqldb";
  }

}