package fi.muikku.plugins.schooldatamock;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.plugins.schooldatamock.entities.MockedWorkspace;
import fi.muikku.plugins.schooldatamock.entities.MockedWorkspaceType;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.WorkspaceSchoolDataBridge;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceType;

@Dependent
@Stateful
public class MockedWorkspaceSchoolDataBridge extends AbstractMockedSchoolDataBridge implements WorkspaceSchoolDataBridge {
	
	@Override
	public String getSchoolDataSource() {
		return SchoolDataMockPluginDescriptor.SCHOOL_DATA_SOURCE;
	}

	@Override
	public Workspace createWorkspace(String name, WorkspaceType type) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (StringUtils.isBlank(name)) {
			throw new SchoolDataBridgeRequestException("Name is required");
		}
		
		if (name.length() > 255) {
			throw new SchoolDataBridgeRequestException("Name maximum length is 255 characters");
		}
		
		try {
			PreparedStatement preparedStatement = executeInsert("insert into Workspace (name, type_id) values (?, ?)", name, type.getIdentifier());
			ResultSet resultSet = preparedStatement.getGeneratedKeys();
			if (resultSet.next()) {
				return new MockedWorkspace(resultSet.getString(1), name, type.getIdentifier());
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
			ResultSet resultSet = executeSelect("select id, name, type_id from Workspace where id = ?", id);
			if (resultSet.next()) {
				return new MockedWorkspace(resultSet.getString(1), resultSet.getString(2), resultSet.getString(3));
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
			ResultSet resultSet = executeSelect("select id, name, type_id from Workspace");
			while (resultSet.next()) {
				result.add(new MockedWorkspace(resultSet.getString(1), resultSet.getString(2), resultSet.getString(3)));
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
			PreparedStatement preparedStatement = executeUpdate("update Workspace set name = ? where id = ?", workspace.getName(), id);
			if (preparedStatement.getUpdateCount() == 1) {
				return workspace;
			} else {
				throw new UnexpectedSchoolDataBridgeException("Workspace updating failed");
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
			executeDelete("delete from Workspace where id = ?", id);
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
			ResultSet resultSet = executeSelect("select id, name from WorkspaceType where id = ?", id);
			if (resultSet.next()) {
				return new MockedWorkspaceType(resultSet.getString(1), resultSet.getString(2));
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
			ResultSet resultSet = executeSelect("select id, name from WorkspaceType");
			while (resultSet.next()) {
				result.add( new MockedWorkspaceType(resultSet.getString(1), resultSet.getString(2)) );
			}
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return result;
	}
	
}
