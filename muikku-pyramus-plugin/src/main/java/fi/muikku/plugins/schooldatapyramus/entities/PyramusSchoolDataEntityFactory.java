package fi.muikku.plugins.schooldatapyramus.entities;

import java.util.ArrayList;
import java.util.List;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceUser;
import fi.pyramus.rest.model.Course;
import fi.pyramus.rest.model.CourseStaffMember;
import fi.pyramus.rest.model.CourseStudent;

public class PyramusSchoolDataEntityFactory {
  
  public User createEntity(fi.pyramus.rest.model.User user) {
    return new PyramusUser("USER-" + user.getId().toString(), user.getFirstName(), user.getLastName());
  }
  
  public List<User> createEntity(fi.pyramus.rest.model.User ... users) {
    List<User> result = new ArrayList<>();
    
    for (fi.pyramus.rest.model.User user : users) {
      result.add(createEntity(user));
    }
    
    return result;
  }
  
  public User createEntity(fi.pyramus.rest.model.Student student) {
    return new PyramusUser("STUDENT-" + student.getId().toString(), student.getFirstName(), student.getLastName());
  }
  
  public List<User> createEntity(fi.pyramus.rest.model.Student ... students) {
    List<User> result = new ArrayList<>();
    
    for (fi.pyramus.rest.model.Student student : students) {
      result.add(createEntity(student));
    }
    
    return result;
  }
  
  public WorkspaceUser createEntity(CourseStaffMember staffMember) {
    if (staffMember == null) {
      return null;
    }
    
    return new PyramusWorkspaceUser("STAFF-" + staffMember.getId().toString(), 
      SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
      staffMember.getCourseId().toString(), 
      SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
      staffMember.getCourseId().toString(), 
      SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, "STAFF-" + staffMember.getRoleId());
  }
  
  public List<WorkspaceUser> createEntity(CourseStaffMember... staffMembers) {
    List<WorkspaceUser> result = new ArrayList<>();
    
    for (CourseStaffMember staffMember : staffMembers) {
      result.add(createEntity(staffMember));
    }
    
    return result;
  }
  
  public WorkspaceUser createEntity(CourseStudent student) {
    if (student == null) {
      return null;
    }
    
    return new PyramusWorkspaceUser("STUDENT-" + student.getId().toString(), 
      SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
      student.getCourseId().toString(), 
      SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
      student.getCourseId().toString(), 
      SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, "STUDENT");
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
    
    return new PyramusWorkspace(course.getId().toString(), course.getName(), course.getDescription(), "TODO", "TODO");
  }
  
  public List<Workspace> createEntity(Course... courses) {
    List<Workspace> result = new ArrayList<>();
    
    for (Course course : courses) {
      result.add(createEntity(course));
    }
    
    return result;
  }
  
}
