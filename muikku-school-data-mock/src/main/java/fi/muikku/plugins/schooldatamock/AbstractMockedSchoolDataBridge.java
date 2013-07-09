package fi.muikku.plugins.schooldatamock;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.inject.Inject;

import fi.muikku.plugins.hsqldb.HSQLDBPluginController;

public class AbstractMockedSchoolDataBridge {

	@Inject
	private HSQLDBPluginController hsqldbPluginController;

	protected PreparedStatement executeInsert(String sql, Object... values) throws SQLException {
		Connection connection = hsqldbPluginController.getConnection(SchoolDataMockPluginDescriptor.DATABASE_NAME);
		return hsqldbPluginController.executeInsert(connection, sql, values);
	}

	protected ResultSet executeSelect(String sql, Object... values) throws SQLException {
		Connection connection = hsqldbPluginController.getConnection(SchoolDataMockPluginDescriptor.DATABASE_NAME);
		return hsqldbPluginController.executeSelect(connection, sql, values);
	}

	protected PreparedStatement executeUpdate(String sql, Object... values) throws SQLException {
		Connection connection = hsqldbPluginController.getConnection(SchoolDataMockPluginDescriptor.DATABASE_NAME);
		return hsqldbPluginController.executeUpdate(connection, sql, values);
	}

	protected PreparedStatement executeDelete(String sql, Object... values) throws SQLException {
		Connection connection = hsqldbPluginController.getConnection(SchoolDataMockPluginDescriptor.DATABASE_NAME);
		return hsqldbPluginController.executeDelete(connection, sql, values);
	}
}
