package fi.otavanopisto.muikku.plugins.data;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

public interface DataPluginScriptHandler {

	public String getName();
	public void executeScript(String uri, Map<String, String> parameters) throws IOException, SQLException;
	public void executeScript(InputStream inputStream, Map<String, String> parameters) throws IOException, SQLException;
	public Connection getConnection(Map<String, String> parameters) throws SQLException;
	
}
