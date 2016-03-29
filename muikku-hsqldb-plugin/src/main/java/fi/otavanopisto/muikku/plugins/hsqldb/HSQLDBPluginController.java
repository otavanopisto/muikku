package fi.otavanopisto.muikku.plugins.hsqldb;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;

import org.hsqldb.cmdline.SqlFile;
import org.hsqldb.cmdline.SqlToolError;

@Dependent
@Stateful
public class HSQLDBPluginController {

  private static final String DB_USERNAME = "sa";
  private static final String DB_PASSWORD = "";
  private static final String DB_DRIVER = "org.hsqldb.jdbc.JDBCDriver";
  private static final String DB_URL = "jdbc:hsqldb:mem:%s";
	
	public Connection getConnection(String database) throws SQLException {
		try {
			Class.forName(DB_DRIVER);
		} catch (ClassNotFoundException e) {
			// TODO: Proper error handling
			throw new SQLException(e);
		}
		
		return DriverManager.getConnection(DB_URL.replace("%s", database), DB_USERNAME, DB_PASSWORD);
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
	
	public void executeScript(Connection connection, File inputFile) throws IOException, SqlToolError, SQLException {
		SqlFile sqlFile = new SqlFile(inputFile);
		sqlFile.setConnection(connection);
		sqlFile.execute();
	}

	
}
