package fi.otavanopisto.muikku.plugins.h2db;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.StringReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.h2.tools.RunScript;

@Dependent
@Stateful
public class H2DBPluginController {
	
	private static final String DATASOURCE_JNDI_NAME = "java:/jdbc/muikku-h2";

	public Connection getConnection() throws SQLException {
		InitialContext initialContext;
		try {
			initialContext = new InitialContext();
	    DataSource datasource = (DataSource) initialContext.lookup(DATASOURCE_JNDI_NAME);
	    return datasource.getConnection();
		} catch (NamingException e) {
			throw new SQLException(e);
		}
	}
	
	public PreparedStatement executeInsert(Connection connection, String sql, Object... values) throws SQLException {
		PreparedStatement preparedStatement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
		
		int parameterIndex = 1;
		for (Object value : values) {
			preparedStatement.setObject(parameterIndex, value);
			parameterIndex++;
		}
		
		preparedStatement.executeUpdate();
		
		return preparedStatement;
	}
	
	public ResultSet executeSelect(Connection connection, String sql, Object... values) throws SQLException {
		PreparedStatement preparedStatement = connection.prepareStatement(sql);
		
		int parameterIndex = 1;
		for (Object value : values) {
			preparedStatement.setObject(parameterIndex, value);
			parameterIndex++;
		}

		return preparedStatement.executeQuery();
	}

	public PreparedStatement executeUpdate(Connection connection, String sql, Object[] values) throws SQLException {
		PreparedStatement preparedStatement = connection.prepareStatement(sql);
		
		int parameterIndex = 1;
		for (Object value : values) {
			preparedStatement.setObject(parameterIndex, value);
			parameterIndex++;
		}
		
		preparedStatement.executeUpdate();
		
		return preparedStatement;
	}	

	public PreparedStatement executeDelete(Connection connection, String sql, Object[] values) throws SQLException {
		PreparedStatement preparedStatement = connection.prepareStatement(sql);
		
		int parameterIndex = 1;
		for (Object value : values) {
			preparedStatement.setObject(parameterIndex, value);
			parameterIndex++;
		}
		
		preparedStatement.executeUpdate();
		
		return preparedStatement;
	}	
	
	public void executeScript(Connection connection, String sql) throws IOException, SQLException {
	  StringReader stringReader = new StringReader(sql);
	  try {
		  RunScript.execute(connection, stringReader);
	  } finally {
		  stringReader.close();
	  }
	}

	public void executeScript(Connection connection, File sqlFile) throws IOException, SQLException {
	  FileReader fileReader = new FileReader(sqlFile);
	  try {
		  RunScript.execute(connection, fileReader);
	  } finally {
	  	fileReader.close();
	  }
	}
	
}
