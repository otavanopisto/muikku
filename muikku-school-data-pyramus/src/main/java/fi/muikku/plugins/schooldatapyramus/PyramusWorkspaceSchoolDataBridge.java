package fi.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;

import fi.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.WorkspaceSchoolDataBridge;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceType;
import fi.muikku.schooldata.entity.WorkspaceUser;
import fi.pyramus.rest.model.Course;
import fi.pyramus.rest.model.CourseOptionality;
import fi.pyramus.rest.model.CourseStaffMember;
import fi.pyramus.rest.model.CourseStudent;
import fi.pyramus.rest.model.Subject;

@Dependent
@Stateful
public class PyramusWorkspaceSchoolDataBridge implements WorkspaceSchoolDataBridge {
  
  @Inject
  private PyramusClient pyramusClient;

  @Inject
  private PyramusIdentifierMapper identifierMapper;
  
  @Inject
  private PyramusSchoolDataEntityFactory entityFactory;

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

    return createWorkspaceEntity(pyramusClient.get("/courses/courses/" + identifier, Course.class));
	}

  @Override
	public List<Workspace> listWorkspaces() throws UnexpectedSchoolDataBridgeException {
    Course[] courses = pyramusClient.get("/courses/courses/", Course[].class);
    if (courses == null) {
      throw new UnexpectedSchoolDataBridgeException("Null response");
    }
    
    List<Workspace> result = new ArrayList<Workspace>();
    
    for (Course course : courses) {
      result.add(createWorkspaceEntity(course));
    }
    
    return result;
	}

	@Override
	public List<Workspace> listWorkspacesByCourseIdentifier(String courseIdentifierIdentifier) throws UnexpectedSchoolDataBridgeException {
    if (courseIdentifierIdentifier.indexOf("/") == -1)
      throw new UnexpectedSchoolDataBridgeException("Invalid CourseIdentifierId");
    
    String subjectId = courseIdentifierIdentifier.substring(0, courseIdentifierIdentifier.indexOf("/"));
    String courseNumber = courseIdentifierIdentifier.substring(courseIdentifierIdentifier.indexOf("/") + 1);
    
    Course[] courses = pyramusClient.get("/common/subjects/" + subjectId + "/courses", fi.pyramus.rest.model.Course[].class);
    List<Workspace> result = new ArrayList<Workspace>();
    
    for (Course course : courses) {
      String courseNumber2 = course.getCourseNumber() != null ? course.getCourseNumber().toString() : "null";

      if (courseNumber.equals(courseNumber2))
        result.add(createWorkspaceEntity(course));
    }
    
    return result;
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
		if (identifier == null) {
		  return null;
		}
	  
	  if (!StringUtils.isNumeric(identifier)) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}
		
		return entityFactory.createEntity(pyramusClient.get("/courses/courseTypes/" + identifier, fi.pyramus.rest.model.CourseType.class));
  }
	
	@Override
	public List<WorkspaceType> listWorkspaceTypes() throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    return entityFactory.createEntities(pyramusClient.get("/courses/courseTypes/", fi.pyramus.rest.model.CourseType[].class));
	}

  @Override
  public WorkspaceUser createWorkspaceUser(Workspace workspace, User user, String roleSchoolDataSource, String roleIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    Long courseId = identifierMapper.getPyramusCourseId(workspace.getIdentifier());
    Long studentId = identifierMapper.getPyramusStudentId(user.getIdentifier());
    
    CourseStudent courseStudent = new CourseStudent(null, courseId, studentId, new DateTime(), Boolean.FALSE, null, null, Boolean.FALSE, CourseOptionality.OPTIONAL, null);
    
    return Arrays.asList(entityFactory.createEntity(pyramusClient.post("/courses/courses/" + courseId + "/students", courseStudent))).get(0);
  }
  
	@Override
	public WorkspaceUser findWorkspaceUser(String workspaceIdentifier, String workspaceSchoolDataSource, String userIdentifier) throws UnexpectedSchoolDataBridgeException {
	  if (!StringUtils.equals(workspaceSchoolDataSource, getSchoolDataSource())) {
	    throw new UnexpectedSchoolDataBridgeException("Invalid school data source");
	  }
	  
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    Long studentId = identifierMapper.getPyramusStudentId(userIdentifier);
    return Arrays.asList(entityFactory.createEntity(pyramusClient.get(String.format("/courses/courses/%d/students/%d", courseId, studentId), CourseStudent.class))).get(0);
	}
	
	@Override
	public List<WorkspaceUser> listWorkspaceUsers(String workspaceIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
	  Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
	  
	  CourseStaffMember[] staffMembers = pyramusClient.get("/courses/courses/" + courseId + "/staffMembers", CourseStaffMember[].class);
    if (staffMembers == null) {
      throw new UnexpectedSchoolDataBridgeException("Null response");
    }
    
    CourseStudent[] courseStudents = pyramusClient.get("/courses/courses/" + courseId + "/students", CourseStudent[].class);
    if (courseStudents == null) {
      throw new UnexpectedSchoolDataBridgeException("Null response");
    }
    
    List<WorkspaceUser> result = entityFactory.createEntity(staffMembers);
    result.addAll(entityFactory.createEntity(courseStudents));
    
    return result;
	}
  
  private Workspace createWorkspaceEntity(Course course) {
    if (course == null)
      return null;
    
    String educationTypeIdentifier = null;
    
    if (course.getSubjectId() != null) {
      Subject subject = pyramusClient.get("/common/subjects/" + course.getSubjectId(), fi.pyramus.rest.model.Subject.class);
      educationTypeIdentifier = identifierMapper.getEducationTypeIdentifier(subject.getEducationTypeId());
    }
    
    return entityFactory.createEntity(course, educationTypeIdentifier);
  }
}
