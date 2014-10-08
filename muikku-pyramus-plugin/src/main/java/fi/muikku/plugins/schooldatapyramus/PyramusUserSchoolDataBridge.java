package fi.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.muikku.plugins.schooldatapyramus.rest.UserPyramusClient;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.UserSchoolDataBridge;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserEmail;
import fi.muikku.schooldata.entity.UserImage;
import fi.muikku.schooldata.entity.UserProperty;
import fi.pyramus.rest.model.CourseStaffMemberRole;
import fi.pyramus.rest.model.Student;
import fi.pyramus.rest.model.UserRole;

@Dependent
@Stateful
public class PyramusUserSchoolDataBridge implements UserSchoolDataBridge {

  @Inject
  private UserPyramusClient pyramusClient;

  @Inject
  private PyramusIdentifierMapper identifierMapper;
  
  @Inject
  private PyramusSchoolDataEntityFactory entityFactory;
  
  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

	@Override
	public User createUser(String firstName, String lastName) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}

	@Override
	public User findUser(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
	  Long studentId = identifierMapper.getPyramusStudentId(identifier);
	  if (studentId != null) {
      return entityFactory.createEntity(pyramusClient.get("/students/students/" + studentId, Student.class));
	  }
	  
	  Long staffId = identifierMapper.getPyramusStaffId(identifier);
	  if (staffId != null) {
      return entityFactory.createEntity(pyramusClient.get("/users/users/" + staffId, fi.pyramus.rest.model.User.class));
	  }

	  throw new SchoolDataBridgeRequestException("Malformed user identifier");
	}

	@Override
	public User findUserByEmail(String email) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}

	@Override
	public List<User> listUsers() throws UnexpectedSchoolDataBridgeException {
		List<User> result = new ArrayList<User>();

    result.addAll(entityFactory.createEntity(pyramusClient.get("/students/students", Student[].class)));
    result.addAll(entityFactory.createEntity(pyramusClient.get("/users/users", fi.pyramus.rest.model.User[].class)));

		return result;
	}

	@Override
	public User updateUser(User user) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!StringUtils.isNumeric(user.getIdentifier())) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}

		throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}

	@Override
	public void removeUser(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!NumberUtils.isNumber(identifier)) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}

		throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}
	
	@Override
	public UserEmail createUserEmail(String userIdentifier, String address) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");

	}

	@Override
	public UserEmail findUserEmail(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}
	
	@Override
	public List<UserEmail> listUserEmailsByUserIdentifier(String userIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}
	
	@Override
	public UserEmail updateUserEmail(UserEmail userEmail) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}
	
	@Override
	public void removeUserEmail(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}
	
	@Override
	public UserImage createUserImage(String userIdentifier, String contentType, byte[] content) throws SchoolDataBridgeRequestException,
			UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}
	
	@Override
	public UserImage findUserImage(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}
	
	@Override
	public List<UserImage> listUserImagesByUserIdentifier(String userIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}

	@Override
	public UserImage updateUserImage(UserImage userImage) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}

	@Override
	public void removeUserImage(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}

	@Override
	public UserProperty getUserProperty(String userIdentifier, String key) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}

	@Override
	public UserProperty setUserProperty(String userIdentifier, String key, String value) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
	}

	@Override
	public List<UserProperty> listUserPropertiesByUser(String userIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
  }

	@Override
	public Role findRole(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
	  if (StringUtils.startsWith(identifier, "ENV-")) {
	    String id = StringUtils.substring(identifier, "ENV-".length());
	    if (StringUtils.isBlank(id)) {
	      throw new SchoolDataBridgeRequestException("Malformed role identifier");
	    }
	    
	    return entityFactory.createEntity(UserRole.valueOf(id));
	  } else {
	    String id = StringUtils.substring(identifier, "WS-".length());
      if (StringUtils.isBlank(id)) {
        throw new SchoolDataBridgeRequestException("Malformed role identifier");
      }
      
      if ("STUDENT".equals(id)) {
        return entityFactory.createCourseStudentRoleEntity();
      }
      
      return entityFactory.createEntity(pyramusClient.get("/courses/staffMemberRoles/" +  id, CourseStaffMemberRole.class));
	  }
	}
	
	@Override
	public List<Role> listRoles() throws UnexpectedSchoolDataBridgeException {
	  List<Role> result = new ArrayList<>();
	  
	  result.addAll(entityFactory.createEntity(UserRole.values()));
	  result.addAll(entityFactory.createEntity(pyramusClient.get("/courses/staffMemberRoles", CourseStaffMemberRole[].class)));
	  result.add(entityFactory.createCourseStudentRoleEntity());
	  
	  return result;
	}

	@Override
	public Role findUserEnvironmentRole(String userIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
	  Long studentId = identifierMapper.getPyramusStudentId(userIdentifier);
	  if (studentId != null) {
      Student student = pyramusClient.get("/students/students/" + studentId, Student.class);
      return student != null ? entityFactory.createEntity(UserRole.STUDENT) : null;
	  }
	  
    Long staffId = identifierMapper.getPyramusStaffId(userIdentifier);
    if (staffId != null) {
      fi.pyramus.rest.model.User user = pyramusClient.get("/users/users/" + staffId, fi.pyramus.rest.model.User.class);
      return user != null ? entityFactory.createEntity(user.getRole()) : null;
    }
	  
    throw new SchoolDataBridgeRequestException("Malformed user identifier");
	}
	
}
