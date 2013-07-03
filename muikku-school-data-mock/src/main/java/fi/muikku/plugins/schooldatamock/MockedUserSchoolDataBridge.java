package fi.muikku.plugins.schooldatamock;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.plugins.hsqldb.HSQLDBPluginController;
import fi.muikku.plugins.schooldatamock.entities.MockedUser;
import fi.muikku.schooldata.UserSchoolDataBridge;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserEmail;
import fi.muikku.schooldata.entity.UserImage;
import fi.muikku.schooldata.entity.UserProperty;

@Dependent
@Stateful
public class MockedUserSchoolDataBridge implements UserSchoolDataBridge {
	
	@Inject
	private HSQLDBPluginController hsqldbPluginController;
	
	@Override
	public User createUser(String firstName, String lastName) {
		try {
			PreparedStatement preparedStatement = executeInsert("insert into User (firstName, lastName) values (?, ?)", firstName, lastName);
			ResultSet resultSet = preparedStatement.getGeneratedKeys();
			if (resultSet.next()) {
				String identifier = String.valueOf(resultSet.getLong(1));
			  return new MockedUser(identifier, firstName, lastName);
			}
			
		} catch (SQLException e) {
			// TODO Proper error handling
			e.printStackTrace();
			throw new RuntimeException(e);
		}

		return null;
	}
	
	@Override
	public User findUser(String identifier) {
		Long id = NumberUtils.createLong(identifier);
		
		try {
			ResultSet resultSet = executeSelect("select firstName, lastName from User where id = ?", id);
			if (resultSet.next()) {
				String firstName = resultSet.getString(1);
				String lastName = resultSet.getString(2);
				
				return new MockedUser(identifier, firstName, lastName);
			}
		} catch (SQLException e) {
			// TODO Proper error handling
			e.printStackTrace();
			throw new RuntimeException(e);
		}
		
		return null;
	}

	@Override
	public User updateUser(User user) {
		Long id = NumberUtils.createLong(user.getIdentifier());
		
		try {
			PreparedStatement preparedStatement = executeUpdate("update User set firstName = ?, lastName = ? where id = ?", user.getFirstName(), user.getLastName(), id);
			if (preparedStatement.getUpdateCount() == 1) {
				return user;
			} else {
				// TODO Proper error handling
				throw new RuntimeException("User updating failed");
			}
		} catch (SQLException e) {
			// TODO Proper error handling
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}
	
	@Override
	public void removeUser(User user) {
		Long id = NumberUtils.createLong(user.getIdentifier());
		
		try {
			executeDelete("delete from User where id = ?", id);
		} catch (SQLException e) {
			// TODO Proper error handling
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	@Override
	public UserEmail createUserEmail(String userIdentifier, String address) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public UserEmail findUserEmail(String identifier) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<UserEmail> listUserEmailsByUserIdentifier(String userIdentifier) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public UserEmail updateUserEmail(UserEmail userEmail) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void removeUserEmail(String identifier) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public UserImage createUserImage(String userIdentifier, String contentType, byte[] content) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public UserImage findUserImage(String identifier) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<UserImage> listUserImagesByUserIdentifier(String userIdentifier) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public UserImage updateUserImage(UserImage userImage) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void removeUserImage(String identifier) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public UserProperty createUserProperty(String userIdentifier, String key, String value) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public UserProperty findUserProperty(String identifier) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<UserProperty> listUserPropertiesByKey(String key) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public UserProperty updateUserProperty(UserProperty userProperty) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void removeUserProperty(String identifier) {
		// TODO Auto-generated method stub
		
	}

	private PreparedStatement executeInsert(String sql, Object... values) throws SQLException {
		Connection connection = hsqldbPluginController.getConnection(SchoolDataMockPluginDescriptor.DATABASE_NAME);
		return hsqldbPluginController.executeInsert(connection, sql, values);
	}

	private ResultSet executeSelect(String sql, Object... values) throws SQLException {
		Connection connection = hsqldbPluginController.getConnection(SchoolDataMockPluginDescriptor.DATABASE_NAME);
		return hsqldbPluginController.executeSelect(connection, sql, values);
	}

	private PreparedStatement executeUpdate(String sql, Object... values) throws SQLException {
		Connection connection = hsqldbPluginController.getConnection(SchoolDataMockPluginDescriptor.DATABASE_NAME);
		return hsqldbPluginController.executeUpdate(connection, sql, values);
	}

	private PreparedStatement executeDelete(String sql, Object... values) throws SQLException {
		Connection connection = hsqldbPluginController.getConnection(SchoolDataMockPluginDescriptor.DATABASE_NAME);
		return hsqldbPluginController.executeDelete(connection, sql, values);
	}

}
