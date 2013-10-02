package fi.muikku.plugins.schooldatamock;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.inject.Inject;

public class AbstractMockedSchoolDataBridge {
	
	@Inject
	private SchoolDataMockPluginController schoolDataMockPluginController;

	protected PreparedStatement executeInsert(String sql, Object... values) throws SQLException {
		return schoolDataMockPluginController.executeInsert(sql, values);
	}

	protected ResultSet executeSelect(String sql, Object... values) throws SQLException {
		return schoolDataMockPluginController.executeSelect(sql, values);
	}

	protected PreparedStatement executeUpdate(String sql, Object... values) throws SQLException {
		return schoolDataMockPluginController.executeUpdate(sql, values);
	}

	protected PreparedStatement executeDelete(String sql, Object... values) throws SQLException {
		return schoolDataMockPluginController.executeDelete(sql, values);
	}

	
}
