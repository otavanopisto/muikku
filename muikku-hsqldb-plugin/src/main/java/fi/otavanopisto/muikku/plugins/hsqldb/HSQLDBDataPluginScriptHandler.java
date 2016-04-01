package fi.otavanopisto.muikku.plugins.hsqldb;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.hsqldb.cmdline.SqlToolError;

import fi.otavanopisto.muikku.plugins.data.DataPluginScriptHandler;

@Dependent
@Stateful
public class HSQLDBDataPluginScriptHandler implements DataPluginScriptHandler {
	
	@Inject
	private HSQLDBPluginController hsqldbPluginController;

	@Override
	public String getName() {
		return "HSQLDB";
	}

	@Override
	public void executeScript(String uri, Map<String, String> parameters) throws IOException, SQLException {
		URL url = new URL(uri);
		URLConnection connection = url.openConnection();
		connection.setDoInput(true);
		connection.setDoOutput(true);
		
		InputStream inputStream = connection.getInputStream();
		try {
			executeScript(inputStream, parameters);
		} finally {
			inputStream.close();
		}
	}
	
	@Override
	public void executeScript(InputStream inputStream, Map<String, String> parameters) throws IOException, SQLException {
		String database = parameters.get("database");
		if (StringUtils.isBlank(database)) {
		  // TODO Proper error handling
			throw new RuntimeException("Database parameter is required");
		}
		
		File tempFile = File.createTempFile("muikku-sqldb-plugin", ".sql");
		try {
  		FileOutputStream fileOutputStream = new FileOutputStream(tempFile);
  		try {
  		  IOUtils.copy(inputStream, fileOutputStream);
  		} finally {
  			fileOutputStream.flush();
  			fileOutputStream.close();
  		}
  
      hsqldbPluginController.executeScript(hsqldbPluginController.getConnection(database), tempFile);
		} catch (SqlToolError e) {
			throw new SQLException(e);
		} finally {
			tempFile.delete();
		}
	}
	
	@Override
	public Connection getConnection(Map<String, String> parameters) throws SQLException {
		String database = parameters.get("database");
		if (StringUtils.isBlank(database)) {
		  // TODO Proper error handling
			throw new RuntimeException("Database parameter is required");
		}
		
		return hsqldbPluginController.getConnection(database);
	}
	
}
