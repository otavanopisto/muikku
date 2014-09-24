package fi.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.plugins.schooldatapyramus.entities.PyramusWorkspace;
import fi.muikku.plugins.schooldatapyramus.rest.AccessToken;
import fi.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.WorkspaceSchoolDataBridge;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceType;
import fi.muikku.schooldata.entity.WorkspaceUser;
import fi.pyramus.rest.model.Course;

@Dependent
@Stateful
public class PyramusWorkspaceSchoolDataBridge implements WorkspaceSchoolDataBridge {
  
  @Inject
  private PyramusClient pyramusClient;

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

	@Override
	public Workspace createWorkspace(String name, String description, WorkspaceType type, String courseIdentifierIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (StringUtils.isBlank(name)) {
			throw new SchoolDataBridgeRequestException("Name is required");
		}
		
		if (name.length() > 255) {
			throw new SchoolDataBridgeRequestException("Name maximum length is 255 characters");
		}

		throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}

	@Override
	public Workspace findWorkspace(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!StringUtils.isNumeric(identifier)) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}

    return createEntity(pyramusClient.get("/courses/courses/" + identifier, Course.class));
	}

  @Override
	public List<Workspace> listWorkspaces() throws UnexpectedSchoolDataBridgeException {
    Course[] courses = pyramusClient.get("/courses/courses/", Course[].class);
    if (courses == null) {
      throw new UnexpectedSchoolDataBridgeException("Null response");
    }
    
    return createEntity(courses);
	}

	@Override
	public List<Workspace> listWorkspacesByCourseIdentifier(String courseIdentifierIdentifier) throws UnexpectedSchoolDataBridgeException {
	  throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}

	@Override
	public Workspace updateWorkspace(Workspace workspace) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!StringUtils.isNumeric(workspace.getIdentifier())) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}
		
		throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}

	@Override
	public void removeWorkspace(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!StringUtils.isNumeric(identifier)) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}

		throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}

	@Override
	public WorkspaceType findWorkspaceType(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!StringUtils.isNumeric(identifier)) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}

		throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}
	
	@Override
	public List<WorkspaceType> listWorkspaceTypes() throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
	  throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}

  @Override
  public WorkspaceUser createWorkspaceUser(Workspace workspace, User user, String roleSchoolDataSource, String roleIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
  }
  
	@Override
	public WorkspaceUser findWorkspaceUser(String identifier) throws UnexpectedSchoolDataBridgeException {
	  throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}
	
	@Override
	public List<WorkspaceUser> listWorkspaceUsers(String workspaceIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
	  throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}

  private Workspace createEntity(Course course) {
    if (course == null) {
      return null;
    }
    
    return new PyramusWorkspace(course.getId().toString(), course.getName(), course.getDescription(), "TODO", "TODO");
  }
  
  private List<Workspace> createEntity(Course... courses) {
    List<Workspace> result = new ArrayList<>();
    
    for (Course course : courses) {
      result.add(createEntity(course));
    }
    
    return result;
  }
}
