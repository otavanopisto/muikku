package fi.muikku.plugins.h2db;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.io.IOUtils;

import fi.muikku.plugins.data.DataPluginScriptHandler;

@Dependent
@Stateful
public class H2DBDataPluginScriptHandler implements DataPluginScriptHandler {
	
	@Inject
	private Logger logger;
	
	@Inject
	private H2DBPluginController h2DBPluginController;

	@Override
	public String getName() {
		return "H2";
	}

	@Override
	public void executeScript(String uri, Map<String, String> parameters) {
		try {
			URL url = new URL(uri);
			URLConnection connection = url.openConnection();
			connection.setDoInput(true);
			connection.setDoOutput(true);
			
			InputStream inputStream = connection.getInputStream();
			String sql = IOUtils.toString(inputStream);
			inputStream.close();
			
			h2DBPluginController.executeScript(h2DBPluginController.getConnection(), sql);
  		
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Override
	public Connection getConnection(Map<String, String> parameters) throws SQLException {
		return h2DBPluginController.getConnection();
	}
	
}
