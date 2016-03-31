package fi.otavanopisto.muikku.plugins.h2db;

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

import fi.otavanopisto.muikku.plugins.data.DataPluginScriptHandler;

@Dependent
@Stateful
public class H2DBDataPluginScriptHandler implements DataPluginScriptHandler {
	
	@Inject
	private H2DBPluginController h2DBPluginController;

	@Override
	public String getName() {
		return "H2";
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
		String sql = IOUtils.toString(inputStream);
		h2DBPluginController.executeScript(h2DBPluginController.getConnection(), sql);
	}
	
	@Override
	public Connection getConnection(Map<String, String> parameters) throws SQLException {
		return h2DBPluginController.getConnection();
	}
	
}
