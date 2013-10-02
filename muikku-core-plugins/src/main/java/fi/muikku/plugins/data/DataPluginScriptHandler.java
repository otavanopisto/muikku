package fi.muikku.plugins.data;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

public interface DataPluginScriptHandler {

	public String getName();
	public void executeScript(String uri, Map<String, String> parameters);
	public Connection getConnection(Map<String, String> parameters) throws SQLException;
	
}
