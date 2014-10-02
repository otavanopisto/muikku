package fi.muikku.plugins.schooldatapyramus.entities;

import java.util.ArrayList;
import java.util.List;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.RoleType;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceUser;
import fi.pyramus.rest.model.Course;
import fi.pyramus.rest.model.CourseStaffMember;
import fi.pyramus.rest.model.CourseStaffMemberRole;
import fi.pyramus.rest.model.CourseStudent;

public class PyramusSchoolDataEntityFactory {

  public Role createCourseStudentRoleEntity() {
    // TODO: Localize
    return new PyramusRole("WS-STUDENT", "Course Student", RoleType.WORKSPACE);
  }
  
  public User createEntity(fi.pyramus.rest.model.User user) {
    return new PyramusUser(getUserIdentifier(user.getId()), user.getFirstName(), user.getLastName());
  }
  
  public List<User> createEntity(fi.pyramus.rest.model.User ... users) {
    List<User> result = new ArrayList<>();
    
    for (fi.pyramus.rest.model.User user : users) {
      result.add(createEntity(user));
    }
    
    return result;
  }
  
  public User createEntity(fi.pyramus.rest.model.Student student) {
    return new PyramusUser(getStudentIdentifier(student.getId()), student.getFirstName(), student.getLastName());
  }
  
  public List<User> createEntity(fi.pyramus.rest.model.Student ... students) {
    List<User> result = new ArrayList<>();
    
    for (fi.pyramus.rest.model.Student student : students) {
      result.add(createEntity(student));
    }
    
    return result;
  }
  
  public Role createEntity(fi.pyramus.rest.model.UserRole role) {
    if (role == null) {
      return null;
    }
    
    return new PyramusRole("ENV-" + role.name(), role.name(), RoleType.ENVIRONMENT);
  }
  
  public List<Role> createEntity(fi.pyramus.rest.model.UserRole... roles) {
    List<Role> result = new ArrayList<>();
    
    for (fi.pyramus.rest.model.UserRole role : roles) {
      result.add(createEntity(role));
    }
    
    return result;
  }

  public Role createEntity(CourseStaffMemberRole staffMemberRole) {
    if (staffMemberRole == null) {
      return null;
    }
    
    return new PyramusRole(createWorkspaceStaffMemberRoleIdentifier(staffMemberRole.getId()), staffMemberRole.getName(), RoleType.WORKSPACE);
  }

  public List<Role> createEntity(CourseStaffMemberRole[] staffMemberRoles) {
    List<Role> result = new ArrayList<>();
    
    for (fi.pyramus.rest.model.CourseStaffMemberRole staffMemberRole : staffMemberRoles) {
      result.add(createEntity(staffMemberRole));
    }
    
    return result;
  }
  
  public WorkspaceUser createEntity(CourseStaffMember staffMember) {
    if (staffMember == null) {
      return null;
    }
    
    return new PyramusWorkspaceUser(getCourseStaffMemberIdentifier(staffMember.getId()), 
      SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
      getWorkspaceIdentifier(staffMember.getCourseId()), 
      SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
      getUserIdentifier(staffMember.getUserId()), 
      SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
      createWorkspaceStaffMemberRoleIdentifier(staffMember.getRoleId())
    );
  }

  public List<WorkspaceUser> createEntity(CourseStaffMember... staffMembers) {
    List<WorkspaceUser> result = new ArrayList<>();
    
    for (CourseStaffMember staffMember : staffMembers) {
      result.add(createEntity(staffMember));
    }
    
    return result;
  }
  
  public WorkspaceUser createEntity(CourseStudent courseStudent) {
    if (courseStudent == null) {
      return null;
    }
    
    return new PyramusWorkspaceUser(getCourseStudentIdentifier(courseStudent.getId()), 
      SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
      getCourseIdentifier(courseStudent.getCourseId()),
      SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
      getStudentIdentifier(courseStudent.getStudentId()),
      SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
      createCourseStudentRoleEntity().getIdentifier());
  }

  public List<WorkspaceUser> createEntity(CourseStudent... courseStudents) {
    List<WorkspaceUser> result = new ArrayList<>();
    
    for (CourseStudent courseStudent : courseStudents) {
      result.add(createEntity(courseStudent));
    }
    
    return result;
  }

  public Workspace createEntity(Course course) {
    if (course == null) {
      return null;
    }
    
    return new PyramusWorkspace(getWorkspaceIdentifier(course.getId()), course.getName(), course.getDescription(), "TODO", "TODO");
  }
  
  public List<Workspace> createEntity(Course... courses) {
    List<Workspace> result = new ArrayList<>();
    
    for (Course course : courses) {
      result.add(createEntity(course));
    }
    
    return result;
  }
  
  private String getWorkspaceIdentifier(Long courseId) {
    return courseId.toString();
  }
  
  private String getCourseStudentIdentifier(Long id) {
    return "STUDENT-" + id.toString();
  }

  private String getCourseStaffMemberIdentifier(Long id) {
    return "STAFF-" + id.toString();
  }
  
  private String getCourseIdentifier(Long courseId) {
    return courseId.toString();
  }
  
  private String getUserIdentifier(Long id) {
    return "USER-" + id.toString();
  }
  
  private String getStudentIdentifier(Long id) {
    return "STUDENT-" + id.toString();
  }
  
  private String createWorkspaceStaffMemberRoleIdentifier(Long id) {
    return "WS-" + id;
  }

}
