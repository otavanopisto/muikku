package fi.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusUserRole;
import fi.muikku.plugins.schooldatapyramus.rest.SystemPyramusClient;
import fi.muikku.schooldata.UserEntityController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserRole;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceUser;
import fi.muikku.schooldata.initializers.SchoolDataEntityInitializerProvider;
import fi.pyramus.rest.model.Course;
import fi.pyramus.rest.model.CourseStaffMember;
import fi.pyramus.rest.model.CourseStaffMemberRole;
import fi.pyramus.rest.model.CourseStudent;
import fi.pyramus.rest.model.Student;

public class PyramusUpdater {

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private PyramusSchoolDataEntityFactory entityFactory;
  
  @Inject
  private SchoolDataEntityInitializerProvider schoolDataEntityInitializerProvider;
  
  @Inject
  private SystemPyramusClient pyramusClient;

  @Inject
  private PyramusIdentifierMapper identifierMapper;
  
  public int updateStudents(int offset, int maxStudents) {
    List<fi.muikku.schooldata.entity.User> newUsers = new ArrayList<>();
    List<String> existingIdentifiers = userEntityController.listUserEntityIdentifiersByDataSource(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    Student[] students = pyramusClient.get("/students/students?firstResult=" + offset + "&maxResults=" + maxStudents, Student[].class);
    
    if (students.length == 0) {
      return -1;
    } else {
      for (Student student : students) {
        fi.muikku.schooldata.entity.User newUser = entityFactory.createEntity(student);
        if (!existingIdentifiers.contains(newUser.getIdentifier())) {
          newUsers.add(newUser);
        }
      }
    }
    
    List<User> users = schoolDataEntityInitializerProvider.initUsers(newUsers);
    
    List<UserRole> userRoles = new ArrayList<>(); 
    Role studentRole = entityFactory.createEntity(fi.pyramus.rest.model.UserRole.STUDENT);
    
    for (User newUser : newUsers) {
      userRoles.add(new PyramusUserRole("PYRAMUS-" + newUser.getIdentifier(), newUser.getIdentifier(), studentRole.getIdentifier()));
    }
    
    schoolDataEntityInitializerProvider.initUserRoles(userRoles);
    
    return users.size();
  }
  
  public int updateUserRoles() {
    int count = 0;
    
    count += schoolDataEntityInitializerProvider.initEnvironmentRoles(entityFactory.createEntity(fi.pyramus.rest.model.UserRole.values())).size();
    count += schoolDataEntityInitializerProvider.initWorkspaceRoles(entityFactory.createEntity(pyramusClient.get("/courses/staffMemberRoles", CourseStaffMemberRole[].class))).size();
    count += schoolDataEntityInitializerProvider.initWorkspaceRoles(Arrays.asList(entityFactory.createCourseStudentRoleEntity())).size();
    
    return count;
  }
  
  public int updateUsers(int offset, int maxStudents) {
    List<fi.muikku.schooldata.entity.User> newUsers = new ArrayList<>();
    List<fi.muikku.schooldata.entity.User> updateUsers = new ArrayList<>();
    Map<String, fi.pyramus.rest.model.User> userMap = new HashMap<>();

    List<String> existingIdentifiers = userEntityController.listUserEntityIdentifiersByDataSource(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    fi.pyramus.rest.model.User[] pyramusUsers = pyramusClient.get("/users/users?firstResult=" + offset + "&maxResults=" + maxStudents, fi.pyramus.rest.model.User[].class);
    if (pyramusUsers.length == 0) {
      return -1;
    } else {
      for (fi.pyramus.rest.model.User pyramusUser : pyramusUsers) {
        fi.muikku.schooldata.entity.User user = entityFactory.createEntity(pyramusUser);
        if (!existingIdentifiers.contains(user.getIdentifier())) {
          newUsers.add(user);
        } else {
          updateUsers.add(user);
        }
        
        userMap.put(user.getIdentifier(), pyramusUser);
      }
    }
    
    schoolDataEntityInitializerProvider.initUsers(newUsers);

    List<fi.muikku.schooldata.entity.UserRole> userRoles = new ArrayList<>(); 

    for (fi.muikku.schooldata.entity.User user : newUsers) {
      fi.pyramus.rest.model.User pyramusUser = userMap.get(user.getIdentifier());
      String roleIdentifier = entityFactory.createEntity(pyramusUser.getRole()).getIdentifier();
      userRoles.add(new PyramusUserRole("PYRAMUS-" + user.getIdentifier(), user.getIdentifier(), roleIdentifier));
    }

    for (fi.muikku.schooldata.entity.User user : updateUsers) {
      fi.pyramus.rest.model.User pyramusUser = userMap.get(user.getIdentifier());
      String roleIdentifier = entityFactory.createEntity(pyramusUser.getRole()).getIdentifier();
      userRoles.add(new PyramusUserRole("PYRAMUS-" + user.getIdentifier(), user.getIdentifier(), roleIdentifier));
    }
    
    schoolDataEntityInitializerProvider.initUserRoles(userRoles);
    
    return userRoles.size();
  }
  
  public int updateWorkspaces(int offset, int maxStudents) {
    List<String> existingIds = workspaceEntityController.listWorkspaceEntityIdentifiersByDataSource(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    Course[] courses = pyramusClient.get("/courses/courses?firstResult=" + offset + "&maxResults=" + maxStudents, Course[].class);
    if ((courses == null) || (courses.length == 0)) {
      return -1;
    } else {
      List<Workspace> newWorkspaces = new ArrayList<>();
      
      for (Course course : courses) {
        Workspace workspace = entityFactory.createEntity(course);
        
        if (!existingIds.contains(workspace.getIdentifier())) {
          newWorkspaces.add(workspace);
        } 
      }
      
      schoolDataEntityInitializerProvider.initWorkspaces(newWorkspaces);
      
      return newWorkspaces.size();
    }
  }
  
  public int updateWorkspaceStaffMembers(WorkspaceEntity workspaceEntity) {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceEntity.getIdentifier());
    
    CourseStaffMember[] staffMembers = pyramusClient.get("/courses/courses/" + courseId + "/staffMembers", CourseStaffMember[].class);
    if (staffMembers != null) {
      List<WorkspaceUser> workspaceUsers = schoolDataEntityInitializerProvider.initWorkspaceUsers(entityFactory.createEntity(staffMembers));
      return workspaceUsers.size();
    }
    
    return 0;
  }

  public int updateWorkspaceStudents(WorkspaceEntity workspaceEntity) {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceEntity.getIdentifier());
    
    CourseStudent[] courseStudents = pyramusClient.get("/courses/courses/" + courseId + "/students", CourseStudent[].class);
    if (courseStudents != null) {
      schoolDataEntityInitializerProvider.initWorkspaceUsers(entityFactory.createEntity(courseStudents));
    }
    
    return 0;
  }

}
