package fi.muikku.plugins.schooldatamock;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.data.DataPluginController;
import fi.muikku.plugins.data.DataPluginScriptHandler;

@Dependent
@Stateful
public class SchoolDataMockPluginController {

	private static final String[] SUPPORTED_HANDLERS = { "H2", "HSQLDB" };
	private static final String DATABASE_NAME = "school-data-mock";
	
	@Inject
	private DataPluginController dataPluginController;
	
	public PreparedStatement executeInsert(String sql, Object... values) throws SQLException {
		PreparedStatement preparedStatement = getConnection().prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
		
		int parameterIndex = 1;
		for (Object value : values) {
			preparedStatement.setObject(parameterIndex, value);
			parameterIndex++;
		}
		
		preparedStatement.executeUpdate();
		
		return preparedStatement;
	}
	
	public ResultSet executeSelect(String sql, Object... values) throws SQLException {
		PreparedStatement preparedStatement = getConnection().prepareStatement(sql);
		
		int parameterIndex = 1;
		for (Object value : values) {
			preparedStatement.setObject(parameterIndex, value);
			parameterIndex++;
		}

		return preparedStatement.executeQuery();
	}

	public PreparedStatement executeUpdate(String sql, Object[] values) throws SQLException {
		PreparedStatement preparedStatement = getConnection().prepareStatement(sql);
		
		int parameterIndex = 1;
		for (Object value : values) {
			preparedStatement.setObject(parameterIndex, value);
			parameterIndex++;
		}
		
		preparedStatement.executeUpdate();
		
		return preparedStatement;
	}	

	public PreparedStatement executeDelete(String sql, Object[] values) throws SQLException {
		PreparedStatement preparedStatement = getConnection().prepareStatement(sql);
		
		int parameterIndex = 1;
		for (Object value : values) {
			preparedStatement.setObject(parameterIndex, value);
			parameterIndex++;
		}
		
		preparedStatement.executeUpdate();
		
		return preparedStatement;
	}	
	
	public void executeScript(InputStream inputStream) throws IOException, SQLException {
		Map<String, String> parameters = new HashMap<>();
		parameters.put("database", DATABASE_NAME);
	  getScriptHandler().executeScript(inputStream, parameters);
	}
	
	private Connection getConnection() throws SQLException {
		Map<String, String> parameters = new HashMap<>();
		parameters.put("database", DATABASE_NAME);
		return getScriptHandler().getConnection(parameters);
	}
	
	private DataPluginScriptHandler getScriptHandler() {
		for (String handlerName : SUPPORTED_HANDLERS) {
  		DataPluginScriptHandler scriptHandler = dataPluginController.getHandler(handlerName);
  		if (scriptHandler != null) {
  			return scriptHandler;
  		}
		}
		
		return null;
	}
	
}
