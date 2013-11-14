package fi.muikku.plugins.schooldatamock;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.plugins.schooldatamock.entities.MockedRole;
import fi.muikku.plugins.schooldatamock.entities.MockedUser;
import fi.muikku.plugins.schooldatamock.entities.MockedUserEmail;
import fi.muikku.plugins.schooldatamock.entities.MockedUserImage;
import fi.muikku.plugins.schooldatamock.entities.MockedUserProperty;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.UserSchoolDataBridge;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserEmail;
import fi.muikku.schooldata.entity.UserImage;
import fi.muikku.schooldata.entity.UserProperty;
import fi.muikku.schooldata.entity.RoleType;

@Dependent
@Stateful
public class MockedUserSchoolDataBridge implements UserSchoolDataBridge {

  @Inject
  private SchoolDataMockPluginController schoolDataMockPluginController;

	@Override
	public String getSchoolDataSource() {
		return SchoolDataMockPluginDescriptor.SCHOOL_DATA_SOURCE;
	}

	@Override
	public User createUser(String firstName, String lastName) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
  			PreparedStatement preparedStatement = schoolDataMockPluginController.executeInsert(connection, "insert into User (firstName, lastName) values (?, ?)", firstName, lastName);
  			ResultSet resultSet = preparedStatement.getGeneratedKeys();
  			if (resultSet.next()) {
  				String identifier = String.valueOf(resultSet.getLong(1));
  				return new MockedUser(identifier, firstName, lastName);
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return null;
	}

	@Override
	public User findUser(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!NumberUtils.isNumber(identifier)) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}

		Long id = NumberUtils.createLong(identifier);

		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, firstName, lastName from User where id = ?", id);
  			if (resultSet.next()) {
  				return new MockedUser(resultSet.getString(1), resultSet.getString(2), resultSet.getString(3));
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return null;
	}

	@Override
	public User findUserByEmail(String email) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, firstName, lastName from User where id = (select user_id from UserEmail where address = ?)", email);
  			if (resultSet.next()) {
  				return new MockedUser(resultSet.getString(1), resultSet.getString(2), resultSet.getString(3));
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return null;
	}

	@Override
	public List<User> listUsers() throws UnexpectedSchoolDataBridgeException {
		List<User> result = new ArrayList<User>();

		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, firstName, lastName from User");
  			while (resultSet.next()) {
  				result.add(new MockedUser(resultSet.getString(1), resultSet.getString(2), resultSet.getString(3)));
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return result;
	}

	@Override
	public User updateUser(User user) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!StringUtils.isNumeric(user.getIdentifier())) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}
		
		Long id = NumberUtils.createLong(user.getIdentifier());

		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
  			PreparedStatement preparedStatement = schoolDataMockPluginController.executeUpdate(connection, "update User set firstName = ?, lastName = ? where id = ?", user.getFirstName(), user.getLastName(), id);
  			if (preparedStatement.getUpdateCount() == 1) {
  				return user;
  			} else {
  				throw new UnexpectedSchoolDataBridgeException("User updating failed");
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}
	}

	@Override
	public void removeUser(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!NumberUtils.isNumber(identifier)) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}

		Long id = NumberUtils.createLong(identifier);

		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
        schoolDataMockPluginController.executeDelete(connection, "delete from User where id = ?", id);
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}
	}
	
	@Override
	public UserEmail createUserEmail(String userIdentifier, String address) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		Long userId = NumberUtils.createLong(userIdentifier);

		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
  			PreparedStatement preparedStatement = schoolDataMockPluginController.executeInsert(connection, "insert into UserEmail (user_id, address) values (?, ?)", userId, address);
  			ResultSet resultSet = preparedStatement.getGeneratedKeys();
  			if (resultSet.next()) {
  				String identifier = String.valueOf(resultSet.getLong(1));
  				return new MockedUserEmail(identifier, userIdentifier, address);
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return null;
	}

	@Override
	public UserEmail findUserEmail(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		Long id = NumberUtils.createLong(identifier);

		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select user_id, address from UserEmail where id = ?", id);
  			if (resultSet.next()) {
  				String userId = resultSet.getString(1);
  				String address = resultSet.getString(2);
  
  				return new MockedUserEmail(identifier, userId, address);
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return null;
	}
	
	@Override
	public List<UserEmail> listUserEmailsByUserIdentifier(String userIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		List<UserEmail> result = new ArrayList<UserEmail>();

		Long userId = NumberUtils.createLong(userIdentifier);

		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
			  ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, user_id, address from UserEmail where user_id = ?", userId);
  			while (resultSet.next()) {
  				String id = resultSet.getString(1);
  				String uid = resultSet.getString(2);
  				String address = resultSet.getString(3);
  
  				result.add(new MockedUserEmail(id, uid, address));
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return result;
	}
	
	@Override
	public UserEmail updateUserEmail(UserEmail userEmail) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		Long id = NumberUtils.createLong(userEmail.getIdentifier());

		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
  			PreparedStatement preparedStatement = schoolDataMockPluginController.executeUpdate(connection, "update UserEmail set address = ? where id = ?", userEmail.getAddress(), id);
  			if (preparedStatement.getUpdateCount() == 1) {
  				return userEmail;
  			} else {
  				throw new UnexpectedSchoolDataBridgeException("UserEmail updating failed");
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}
	}
	
	@Override
	public void removeUserEmail(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		Long id = NumberUtils.createLong(identifier);

		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
        schoolDataMockPluginController.executeDelete(connection, "delete from UserEmail where id = ?", id);
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}
	}
	
	@Override
	public UserImage createUserImage(String userIdentifier, String contentType, byte[] content) throws SchoolDataBridgeRequestException,
			UnexpectedSchoolDataBridgeException {
		Long userId = NumberUtils.createLong(userIdentifier);

		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
  			PreparedStatement preparedStatement = schoolDataMockPluginController.executeInsert(connection, "insert into UserImage (user_id, content_type, content) values (?, ?, ?)", userId, contentType, content);
  			ResultSet resultSet = preparedStatement.getGeneratedKeys();
  			if (resultSet.next()) {
  				String identifier = String.valueOf(resultSet.getLong(1));
  				return new MockedUserImage(identifier, userIdentifier, contentType, content);
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return null;
	}
	
	@Override
	public UserImage findUserImage(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		Long id = NumberUtils.createLong(identifier);

		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select user_id, content_type, content from UserImage where id = ?", id);
  			if (resultSet.next()) {
  				String userId = resultSet.getString(1);
  				String contentType = resultSet.getString(2);
  				Blob contentBlob = resultSet.getBlob(3);
  
  				InputStream contentStream = contentBlob.getBinaryStream();
  				try {
  					byte[] content = IOUtils.toByteArray(contentStream);
  					return new MockedUserImage(identifier, userId, contentType, content);
  				} finally {
  					contentStream.close();
  				}
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException | IOException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return null;
	}
	
	@Override
	public List<UserImage> listUserImagesByUserIdentifier(String userIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		List<UserImage> result = new ArrayList<UserImage>();

		Long userId = NumberUtils.createLong(userIdentifier);

		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, user_id, content_type, content from UserImage where user_id = ?", userId);
  			while (resultSet.next()) {
  				String identifier = resultSet.getString(1);
  				String uid = resultSet.getString(2);
  				String contentType = resultSet.getString(3);
  				Blob contentBlob = resultSet.getBlob(4);
  
  				InputStream contentStream = contentBlob.getBinaryStream();
  				try {
  					byte[] content = IOUtils.toByteArray(contentStream);
  					result.add(new MockedUserImage(identifier, uid, contentType, content));
  				} finally {
  					contentStream.close();
  				}
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException | IOException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return result;
	}

	@Override
	public UserImage updateUserImage(UserImage userImage) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		Long id = NumberUtils.createLong(userImage.getIdentifier());
		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
  			PreparedStatement preparedStatement = schoolDataMockPluginController.executeUpdate(connection, "update UserImage set content_type = ?, content = ? where id = ?", userImage.getContentType(), userImage.getContent(), id);
  			if (preparedStatement.getUpdateCount() == 1) {
  				return userImage;
  			} else {
  				throw new UnexpectedSchoolDataBridgeException("UserEmail updating failed");
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}
	}

	@Override
	public void removeUserImage(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		Long id = NumberUtils.createLong(identifier);

		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
        schoolDataMockPluginController.executeDelete(connection, "delete from UserImage where id = ?", id);
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}		
	}

	@Override
	public UserProperty getUserProperty(String userIdentifier, String key) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		try {
			return findUserPropertyByUserAndKey(userIdentifier, key);
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}
	}

	@Override
	public UserProperty setUserProperty(String userIdentifier, String key, String value) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		try {
			Long id = findUserPropertyIdByUserAndKey(userIdentifier, key);
			if (id != null) {
				if (value == null) {
					deleteUserProperty(id);
					return null;
				} else {
					return updateUserProperty(id, value);
				}
			} else {
				return createUserProperty(userIdentifier, key, value);
			}
			
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}
	}

	private UserProperty createUserProperty(String userIdentifier, String key, String value) throws SQLException {
		Long userId = NumberUtils.createLong(userIdentifier);

		Connection connection = schoolDataMockPluginController.getConnection();
    try {
  		PreparedStatement preparedStatement = schoolDataMockPluginController.executeInsert(connection, "insert into UserProperty (user_id, key, value) values (?, ?, ?)", userId, key, value);
  		ResultSet resultSet = preparedStatement.getGeneratedKeys();
  		if (resultSet.next()) {
  			return new MockedUserProperty(userIdentifier, key, value);
  		}
    } finally {
      connection.close();
    }

		return null;
	}

	private UserProperty findUserProperty(String identifier) throws SQLException {
		Long id = NumberUtils.createLong(identifier);

    Connection connection = schoolDataMockPluginController.getConnection();
    try {
  		ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select user_id, key, value from UserProperty where id = ?", id);
  		if (resultSet.next()) {
  			String userId = resultSet.getString(1);
  			String key = resultSet.getString(2);
  			String value = resultSet.getString(3);
  
  			return new MockedUserProperty(userId, key, value);
  		}
    } finally {
      connection.close();
    }

		return null;
	}

	private Long findUserPropertyIdByUserAndKey(String userIdentifier, String key) throws SQLException {
    Connection connection = schoolDataMockPluginController.getConnection();
    try {
  		ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id from UserProperty where user_id = ? and key = ?", userIdentifier, key);
  		if (resultSet.next()) {
  			return resultSet.getLong(1);
  		}
    } finally {
      connection.close();
    }

		return null;
	}

	@Override
	public List<UserProperty> listUserPropertiesByUser(String userIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		List<UserProperty> result = new ArrayList<UserProperty>();

		try {
	    Connection connection = schoolDataMockPluginController.getConnection();
	    try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select user_id, key, value from UserProperty where user_id = ?", userIdentifier);
  			while (resultSet.next()) {
  				result.add(new MockedUserProperty(resultSet.getString(1), resultSet.getString(2), resultSet.getString(3)));
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return result;
	}

	@Override
	public Role findRole(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		try {
	    Connection connection = schoolDataMockPluginController.getConnection();
	    try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, name, type from Role where id = ?", identifier);
  			while (resultSet.next()) {
  				return new MockedRole(resultSet.getString(1), resultSet.getString(2), RoleType.valueOf(resultSet.getString(3)));
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}
		
		return null;
	}
	
	@Override
	public List<Role> listRoles() throws UnexpectedSchoolDataBridgeException {
		List<Role> result = new ArrayList<>();
		
		try {
	    Connection connection = schoolDataMockPluginController.getConnection();
	    try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, name, type from Role");
  			while (resultSet.next()) {
  				result.add(new MockedRole(resultSet.getString(1), resultSet.getString(2), RoleType.valueOf(resultSet.getString(3))));
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}
		
		return result;
	}

	@Override
	public Role findUserEnvironmentRole(String userIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		try {
	    Connection connection = schoolDataMockPluginController.getConnection();
	    try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select r.id, r.name, r.type from User u, Role r where u.id = ? and u.role_id = r.id", userIdentifier);
  			if (resultSet.next()) {
  				return new MockedRole(resultSet.getString(1), resultSet.getString(2), RoleType.valueOf(resultSet.getString(3)));
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}
		
		return null;
	}

	private UserProperty findUserPropertyByUserAndKey(String userIdentifier, String key) throws SQLException {
    Connection connection = schoolDataMockPluginController.getConnection();
    try {
  		ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select user_id, key, value from UserProperty where user_id = ? and key = ?", userIdentifier, key);
  		if (resultSet.next()) {
  			return new MockedUserProperty(resultSet.getString(1), resultSet.getString(2), resultSet.getString(3));
  		}
    } finally {
      connection.close();
    }
		
		return null;
	}
	
	private UserProperty updateUserProperty(Long id, String value) throws SQLException {
    Connection connection = schoolDataMockPluginController.getConnection();
    try {
  		PreparedStatement preparedStatement = schoolDataMockPluginController.executeUpdate(connection, "update UserProperty set value = ? where id = ?", value, id);
  		if (preparedStatement.getUpdateCount() == 1) {
  			return findUserProperty(id.toString());
  		}
    } finally {
      connection.close();
    }
		
		return null;
	}

	private void deleteUserProperty(Long id) throws SQLException {
    Connection connection = schoolDataMockPluginController.getConnection();
    try {
      schoolDataMockPluginController.executeDelete(connection, "delete from UserProperty where id = ?", id);
    } finally {
      connection.close();
    }
	}

}
