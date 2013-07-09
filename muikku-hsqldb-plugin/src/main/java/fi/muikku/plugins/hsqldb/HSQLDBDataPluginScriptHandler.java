package fi.muikku.plugins.hsqldb;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.sql.SQLException;
import java.util.Map;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.hsqldb.cmdline.SqlToolError;

import fi.muikku.plugins.data.DataPluginScriptHandler;

@Dependent
@Stateful
public class HSQLDBDataPluginScriptHandler implements DataPluginScriptHandler {
	
	@Inject
	private Logger logger;
	
	@Inject
	private HSQLDBPluginController hsqldbPluginController;

	@Override
	public String getName() {
		return "HSQLDB";
	}

	@Override
	public void executeScript(String uri, Map<String, String> parameters) {
		String database = parameters.get("database");
		if (StringUtils.isBlank(database)) {
		  // TODO Proper error handling
			throw new RuntimeException("Database parameter is required");
		}
		
		try {
  		URL url = new URL(uri);
  		File tempFile = File.createTempFile("muikku-sqldb-plugin", ".sql");
  		try {
  			URLConnection connection = url.openConnection();
  			connection.setDoInput(true);
  			connection.setDoOutput(true);
  			
  			InputStream inputStream = connection.getInputStream();
  			try {
  				FileOutputStream fileOutputStream = new FileOutputStream(tempFile);
  				try {
  				  IOUtils.copy(inputStream, fileOutputStream);
  				} finally {
  					fileOutputStream.flush();
  					fileOutputStream.close();
  				}
  
  		    hsqldbPluginController.executeScript(hsqldbPluginController.getConnection(database), tempFile);
  			} finally {
  				inputStream.close();
  			}
  		} finally {
  			tempFile.delete();
  		}
		} catch (IOException | SqlToolError | SQLException e) {
			// TODO Proper error handling
			e.printStackTrace();
			throw new RuntimeException(e);		
		}
	}
	
}
