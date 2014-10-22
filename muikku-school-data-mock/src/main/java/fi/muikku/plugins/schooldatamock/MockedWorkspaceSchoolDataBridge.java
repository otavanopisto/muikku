package fi.muikku.plugins.schooldatamock;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.plugins.schooldatamock.entities.MockedWorkspace;
import fi.muikku.plugins.schooldatamock.entities.MockedWorkspaceType;
import fi.muikku.plugins.schooldatamock.entities.MockedWorkspaceUser;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.WorkspaceSchoolDataBridge;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceType;
import fi.muikku.schooldata.entity.WorkspaceUser;

@Dependent
@Stateful
public class MockedWorkspaceSchoolDataBridge implements WorkspaceSchoolDataBridge {

  @Inject
  private SchoolDataMockPluginController schoolDataMockPluginController;

	@Override
	public String getSchoolDataSource() {
		return SchoolDataMockPluginDescriptor.SCHOOL_DATA_SOURCE;
	}

	@Override
	public Workspace createWorkspace(String name, String description, WorkspaceType type, String courseIdentifierIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		
	 System.out.println("creating worksspace with name: "+name);
	  
	  if (StringUtils.isBlank(name)) {
			throw new SchoolDataBridgeRequestException("Name is required");
		}
		
		if (name.length() > 255) {
			throw new SchoolDataBridgeRequestException("Name maximum length is 255 characters");
		}
		
		try {
	    Connection connection = schoolDataMockPluginController.getConnection();
	    try {
  			PreparedStatement preparedStatement = schoolDataMockPluginController.executeInsert(connection, "insert into Workspace (name, description, type_id, course_identifier_id) values (?, ?, ?, ?)", name, description, type.getIdentifier(), courseIdentifierIdentifier);
  			ResultSet resultSet = preparedStatement.getGeneratedKeys();
  			if (resultSet.next()) {
  				return new MockedWorkspace(resultSet.getString(1), name, description, type.getIdentifier(), courseIdentifierIdentifier);
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
	public Workspace findWorkspace(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!StringUtils.isNumeric(identifier)) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}

		Long id = NumberUtils.createLong(identifier);

		try {
	    Connection connection = schoolDataMockPluginController.getConnection();
	    try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, name, description, type_id, course_identifier_id from Workspace where id = ?", id);
  			if (resultSet.next()) {
  				return new MockedWorkspace(resultSet.getString(1), resultSet.getString(2), resultSet.getString(3), resultSet.getString(4), resultSet.getString(5));
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
	public List<Workspace> listWorkspaces() throws UnexpectedSchoolDataBridgeException {
		List<Workspace> result = new ArrayList<>();

		try {
	    Connection connection = schoolDataMockPluginController.getConnection();
	    try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, name, description, type_id, course_identifier_id from Workspace");
  			while (resultSet.next()) {
  				result.add(new MockedWorkspace(resultSet.getString(1), resultSet.getString(2), resultSet.getString(3), resultSet.getString(4), resultSet.getString(5)));
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
	public List<Workspace> listWorkspacesByCourseIdentifier(String courseIdentifierIdentifier) throws UnexpectedSchoolDataBridgeException {
		List<Workspace> result = new ArrayList<>();

		try {
	    Connection connection = schoolDataMockPluginController.getConnection();
	    try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, name, description, type_id, course_identifier_id from Workspace where course_identifier_id = ?", courseIdentifierIdentifier);
  			while (resultSet.next()) {
  				result.add(new MockedWorkspace(resultSet.getString(1), resultSet.getString(2), resultSet.getString(3), resultSet.getString(4), resultSet.getString(5)));
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
	public Workspace updateWorkspace(Workspace workspace) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!StringUtils.isNumeric(workspace.getIdentifier())) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}
		
		Long id = NumberUtils.createLong(workspace.getIdentifier());

		try {
	    Connection connection = schoolDataMockPluginController.getConnection();
	    try {
  			PreparedStatement preparedStatement = schoolDataMockPluginController.executeUpdate(connection, "update Workspace set name = ? where id = ?", workspace.getName(), id);
  			if (preparedStatement.getUpdateCount() == 1) {
  				return workspace;
  			} else {
  				throw new UnexpectedSchoolDataBridgeException("Workspace updating failed");
  			}
	    } finally {
	      connection.close();
	    }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}
	}

	@Override
	public void removeWorkspace(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!StringUtils.isNumeric(identifier)) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}

		Long id = NumberUtils.createLong(identifier);

		try {
	    Connection connection = schoolDataMockPluginController.getConnection();
	    try {
	      schoolDataMockPluginController.executeDelete(connection, "delete from Workspace where id = ?", id);
	    } finally {
	      connection.close();
	    }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}
	}

	@Override
	public WorkspaceType findWorkspaceType(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!StringUtils.isNumeric(identifier)) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}

		Long id = NumberUtils.createLong(identifier);

		try {
	    Connection connection = schoolDataMockPluginController.getConnection();
	    try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, name from WorkspaceType where id = ?", id);
  			if (resultSet.next()) {
  				return new MockedWorkspaceType(resultSet.getString(1), resultSet.getString(2));
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
	public List<WorkspaceType> listWorkspaceTypes() throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		List<WorkspaceType> result = new ArrayList<>();
		try {
	    Connection connection = schoolDataMockPluginController.getConnection();
	    try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, name from WorkspaceType");
  			while (resultSet.next()) {
  				result.add( new MockedWorkspaceType(resultSet.getString(1), resultSet.getString(2)) );
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
  public WorkspaceUser createWorkspaceUser(Workspace workspace, User user, String roleSchoolDataSource, String roleIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
        PreparedStatement preparedStatement = schoolDataMockPluginController.executeInsert(connection, "insert into WorkspaceUser (workspace_school_data_source, workspace_identifier, user_school_data_source, user_identifier, role_school_data_source, role_identifier) values (?, ?, ?, ?, ?, ?)", workspace.getSchoolDataSource(), workspace.getIdentifier(), user.getSchoolDataSource(), user.getIdentifier(), roleSchoolDataSource, roleIdentifier);
        ResultSet resultSet = preparedStatement.getGeneratedKeys();
        if (resultSet.next()) {
          return new MockedWorkspaceUser(resultSet.getString(1), workspace.getSchoolDataSource(), workspace.getIdentifier(), user.getSchoolDataSource(), user.getIdentifier(), roleSchoolDataSource, roleIdentifier);
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
	public WorkspaceUser findWorkspaceUser(String identifier) throws UnexpectedSchoolDataBridgeException {
    try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
        ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, workspace_school_data_source, workspace_identifier, user_school_data_source, user_identifier, role_school_data_source, role_identifier from WorkspaceUser where id = ?", identifier);
        if (resultSet.next()) {
          String roleDataSource = resultSet.getString(6);
          String roleIdentifier = resultSet.getString(7);
          
          return new MockedWorkspaceUser(resultSet.getString(1), resultSet.getString(2), resultSet.getString(3), resultSet.getString(4), resultSet.getString(5), roleDataSource, roleIdentifier);
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
	public List<WorkspaceUser> listWorkspaceUsers(String workspaceIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		List<WorkspaceUser> result = new ArrayList<>();
		try {
	    Connection connection = schoolDataMockPluginController.getConnection();
	    try {
        ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, workspace_school_data_source, workspace_identifier, user_school_data_source, user_identifier, role_school_data_source, role_identifier from WorkspaceUser where workspace_identifier = ?", workspaceIdentifier);
        while (resultSet.next()) {
          String roleDataSource = resultSet.getString(6);
          String roleIdentifier = resultSet.getString(7);
          
          result.add( new MockedWorkspaceUser(resultSet.getString(1), resultSet.getString(2), resultSet.getString(3), resultSet.getString(4), resultSet.getString(5), roleDataSource, roleIdentifier));
        }
	    } finally {
	      connection.close();
	    }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return result;
	}
	
}
