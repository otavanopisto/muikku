package fi.muikku.plugins.schooldatapyramus.entities;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.plugins.schooldatapyramus.PyramusIdentifierMapper;
import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.entity.EnvironmentRole;
import fi.muikku.schooldata.entity.EnvironmentRoleArchetype;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceRole;
import fi.muikku.schooldata.entity.WorkspaceRoleArchetype;
import fi.muikku.schooldata.entity.WorkspaceUser;
import fi.pyramus.rest.model.Course;
import fi.pyramus.rest.model.CourseStaffMember;
import fi.pyramus.rest.model.CourseStaffMemberRole;
import fi.pyramus.rest.model.CourseStudent;
import fi.pyramus.rest.model.UserRole;

public class PyramusSchoolDataEntityFactory {
  
  @Inject
  private PyramusIdentifierMapper identifierMapper;
  
  @Inject
  private PluginSettingsController pluginSettingsController;
  
  public WorkspaceRole createCourseStudentRoleEntity() {
    // TODO: Localize
    return new PyramusWorkspaceRole(identifierMapper.getWorkspaceStudentRoleIdentifier(), "Course Student", WorkspaceRoleArchetype.STUDENT);
  }
  
  @SuppressWarnings("incomplete-switch")
  public User createEntity(fi.pyramus.rest.model.User user) {
    String displayName = user.getFirstName() + " " + user.getLastName();
    switch (user.getRole()) {
      case ADMINISTRATOR:
        displayName += " (Administrator)";
      break;
      case GUEST:
        displayName += " (Guest)";
      break;
      case MANAGER:
        displayName += " (Manager)";
      break;
      case USER:
        displayName += " (User)";
      break;
    }
    
    
    return new PyramusUser(identifierMapper.getStaffIdentifier(user.getId()), user.getFirstName(), user.getLastName(), displayName);
  }
  
  public List<User> createEntity(fi.pyramus.rest.model.User ... users) {
    List<User> result = new ArrayList<>();
    
    for (fi.pyramus.rest.model.User user : users) {
      result.add(createEntity(user));
    }
    
    return result;
  }
  
  public User createEntity(fi.pyramus.rest.model.Student student, fi.pyramus.rest.model.StudyProgramme studyProgramme) {
    StringBuilder displayName = new StringBuilder();
    
    displayName
      .append(student.getFirstName())
      .append(' ')
      .append(student.getLastName());
    
    if (studyProgramme != null) {
      displayName.append(" (")
        .append(studyProgramme.getName())
        .append(')');
    }
    
    return new PyramusUser(identifierMapper.getStudentIdentifier(student.getId()), student.getFirstName(), student.getLastName(), displayName.toString());
  }
  
  public List<User> createEntity(fi.pyramus.rest.model.Student[] students, fi.pyramus.rest.model.StudyProgramme[] studyProgrammes) {
    if (studyProgrammes.length != students.length) {
      throw new RuntimeException("StudyProgramme count does not match student count");
    }
    
    List<User> result = new ArrayList<>();
    
    for (int i = 0, l = students. length; i < l; i++) {
      result.add(createEntity(students[i], studyProgrammes[i])); 
    }
    
    return result;
  }
  
  public EnvironmentRole createEntity(fi.pyramus.rest.model.UserRole role) {
    if (role == null) {
      return null;
    }
    
    EnvironmentRoleArchetype archetype = getEnvironmentRoleArchetype(role);

    return new PyramusEnvironmentRole("ENV-" + role.name(), archetype, role.name());
  }

  public List<EnvironmentRole> createEntity(fi.pyramus.rest.model.UserRole... roles) {
    List<EnvironmentRole> result = new ArrayList<>();
    
    for (fi.pyramus.rest.model.UserRole role : roles) {
      result.add(createEntity(role));
    }
    
    return result;
  }

  public WorkspaceRole createEntity(CourseStaffMemberRole staffMemberRole) {
    if (staffMemberRole == null) {
      return null;
    }
    
    WorkspaceRoleArchetype archetype = getWorkspaceRoleArchetype(staffMemberRole.getId());
    return new PyramusWorkspaceRole(identifierMapper.getWorkspaceStaffRoleIdentifier(staffMemberRole.getId()), staffMemberRole.getName(), archetype);
  }

  public List<WorkspaceRole> createEntity(CourseStaffMemberRole[] staffMemberRoles) {
    List<WorkspaceRole> result = new ArrayList<>();
    
    for (fi.pyramus.rest.model.CourseStaffMemberRole staffMemberRole : staffMemberRoles) {
      result.add(createEntity(staffMemberRole));
    }
    
    return result;
  }
  
  public WorkspaceUser createEntity(CourseStaffMember staffMember) {
    if (staffMember == null) {
      return null;
    }
    
    return new PyramusWorkspaceUser(identifierMapper.getWorkspaceStaffIdentifier(staffMember.getId()), 
      SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
      identifierMapper.getWorkspaceIdentifier(staffMember.getCourseId()),
      SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
      identifierMapper.getStaffIdentifier(staffMember.getUserId()), 
      SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
      identifierMapper.getWorkspaceStaffRoleIdentifier(staffMember.getRoleId())
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
    
    return new PyramusWorkspaceUser(identifierMapper.getWorkspaceStudentIdentifier(courseStudent.getId()),
      SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
      identifierMapper.getWorkspaceIdentifier(courseStudent.getCourseId()),
      SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
      identifierMapper.getStudentIdentifier(courseStudent.getStudentId()), 
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
    
    return new PyramusWorkspace(identifierMapper.getWorkspaceIdentifier(course.getId()), course.getName(), course.getDescription(), "TODO", "TODO");
  }
  
  public List<Workspace> createEntity(Course... courses) {
    List<Workspace> result = new ArrayList<>();
    
    for (Course course : courses) {
      result.add(createEntity(course));
    }
    
    return result;
  }
  
  private EnvironmentRoleArchetype getEnvironmentRoleArchetype(UserRole role) {
    switch (role) {
      case ADMINISTRATOR:
        return EnvironmentRoleArchetype.ADMINISTRATOR;
      case MANAGER:
        return EnvironmentRoleArchetype.MANAGER;
      case STUDENT:
        return EnvironmentRoleArchetype.STUDENT;
      default:
        return EnvironmentRoleArchetype.CUSTOM;
    }
  }
  
  private WorkspaceRoleArchetype getWorkspaceRoleArchetype(Long staffMemberRoleId) {
    String teacherRoleSetting = pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME, "roles.workspace.TEACHER");
    if (StringUtils.isNumeric(teacherRoleSetting)) {
      if (staffMemberRoleId.equals(NumberUtils.createLong(teacherRoleSetting))) {
        return WorkspaceRoleArchetype.TEACHER;
      }
    }
    
    return WorkspaceRoleArchetype.CUSTOM;
  }

}
