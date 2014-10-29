package fi.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.RoleSchoolDataIdentifier;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.muikku.plugins.schooldatapyramus.rest.SystemPyramusClient;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.EnvironmentRole;
import fi.muikku.schooldata.entity.WorkspaceRole;
import fi.muikku.schooldata.events.SchoolDataEnvironmentRoleDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataEnvironmentRoleRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataUserDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataUserEnvironmentRoleDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataUserEnvironmentRoleRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataUserRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceRoleDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceRoleRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceUserDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceUserRemovedEvent;
import fi.muikku.users.EnvironmentRoleEntityController;
import fi.muikku.users.EnvironmentUserController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEmailEntityController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserSchoolDataIdentifierController;
import fi.muikku.users.WorkspaceRoleEntityController;
import fi.pyramus.rest.model.Course;
import fi.pyramus.rest.model.CourseStaffMember;
import fi.pyramus.rest.model.CourseStaffMemberRole;
import fi.pyramus.rest.model.Email;
import fi.pyramus.rest.model.Student;
import fi.pyramus.rest.model.UserRole;

public class PyramusUpdater {

  @Inject
  private Logger logger;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private UserController userController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private PyramusSchoolDataEntityFactory entityFactory;
  
  @Inject
  private SystemPyramusClient pyramusClient;

  @Inject
  private PyramusIdentifierMapper identifierMapper;
  
  @Inject
  private EnvironmentRoleEntityController environmentRoleEntityController;

  @Inject
  private EnvironmentUserController environmentUserController;
  
  @Inject
  private WorkspaceRoleEntityController workspaceRoleEntityController;
  
  @Inject
  private Event<SchoolDataUserDiscoveredEvent> schoolDataUserDiscoveredEvent;

  @Inject
  private Event<SchoolDataUserRemovedEvent> schoolDataUserRemovedEvent;

  @Inject
  private Event<SchoolDataWorkspaceUserDiscoveredEvent> schoolDataWorkspaceUserDiscoveredEvent;

  @Inject
  private Event<SchoolDataWorkspaceUserRemovedEvent> schoolDataWorkspaceUserRemovedEvent;

  @Inject
  private Event<SchoolDataWorkspaceDiscoveredEvent> schoolDataWorkspaceDiscoveredEvent;

  @Inject
  private Event<SchoolDataWorkspaceRemovedEvent> schoolDataWorkspaceRemovedEvent;

  @Inject
  private Event<SchoolDataEnvironmentRoleDiscoveredEvent> schoolDataEnvironmentRoleDiscoveredEvent;

  @Inject
  private Event<SchoolDataEnvironmentRoleRemovedEvent> schoolDataEnvironmentRoleRemovedEvent;
  
  @Inject
  private Event<SchoolDataWorkspaceRoleDiscoveredEvent> schoolDataWorkspaceRoleDiscoveredEvent;

  @Inject
  private Event<SchoolDataWorkspaceRoleRemovedEvent> schoolDataWorkspaceRoleRemovedEvent;

  @Inject
  private Event<SchoolDataUserEnvironmentRoleDiscoveredEvent> schoolDataUserEnvironmentRoleDiscoveredEvent;

  @Inject
  private Event<SchoolDataUserEnvironmentRoleRemovedEvent> schoolDataUserEnvironmentRoleRemovedEvent;

  /**
   * Updates a student from Pyramus
   * 
   * @param pyramusId id if student in Pyramus
   * @return whether new student was created
   */
  public boolean updateStudent(Long pyramusId) {
    Student student = pyramusClient.get("/students/students/" + pyramusId, Student.class);
    if (student != null) {
      String studentIdentifier = identifierMapper.getStudentIdentifier(pyramusId);
      if (userEntityController.findUserEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, studentIdentifier) == null) {
        fireStudentDiscoverted(student);
        return true;
      }
    }
    
    return false;
  }

  /**
   * Updates students from Pyramus.
   * 
   * @param offset first student to be updated
   * @param maxStudents maximum batch size
   * @return count of updated students or -1 when no students were found with given offset
   */
  public int updateStudents(int offset, int maxStudents) {
    Student[] students = pyramusClient.get("/students/students?firstResult=" + offset + "&maxResults=" + maxStudents, Student[].class);
    if (students.length == 0) {
      return -1;
    }

    List<String> existingIdentifiers = userEntityController.listUserEntityIdentifiersByDataSource(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    
    List<Student> discoveredStudents = new ArrayList<>();
    
    for (Student student : students) {
      String indentifier = identifierMapper.getStudentIdentifier(student.getId());
      if (!existingIdentifiers.contains(indentifier)) {
        discoveredStudents.add(student);
      }
    }
    
    for (Student discoveredStudent : discoveredStudents) {
      fireStudentDiscoverted(discoveredStudent);
    }
    
    return discoveredStudents.size();
  }

  /**
   * Updates staff member from Pyramus
   * 
   * @param pyramusId id of staff member in Pyramus
   * @return returns whether new staff member was created or not
   */
  public boolean updateStaffMember(Long pyramusId) {
    fi.pyramus.rest.model.User staffMember = pyramusClient.get("/staff/members/" + pyramusId, fi.pyramus.rest.model.User.class);
    if (staffMember != null) {
      String staffMemberIdentifier = identifierMapper.getStaffIdentifier(pyramusId);
      if (userEntityController.findUserEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, staffMemberIdentifier) == null) {
        fireStaffMemberDiscovered(staffMember);
      }
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Updates staff members from Pyramus
   * 
   * @param offset first staff member to be updated
   * @param maxStaffMembers maximum batch size
   * @return count of updates staff membres or -1 when no staff members were found with given offset
   */
  public int updateStaffMembers(int offset, int maxStaffMembers) {
    fi.pyramus.rest.model.User[] staffMembers = pyramusClient.get("/staff/members?firstResult=" + offset + "&maxResults=" + maxStaffMembers, fi.pyramus.rest.model.User[].class);
    if (staffMembers.length == 0) {
      return -1;
    }

    List<String> existingIdentifiers = userEntityController.listUserEntityIdentifiersByDataSource(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    List<fi.pyramus.rest.model.User> discoveredStaffMembers = new ArrayList<>();
    Map<Long, UserRole> discoveredUserRoles = new HashMap<>();
    Map<Long, String> removedUserRoles = new HashMap<>();
    
    for (fi.pyramus.rest.model.User staffMember : staffMembers) {
      String indentifier = identifierMapper.getStaffIdentifier(staffMember.getId());
      if (!existingIdentifiers.contains(indentifier)) {
        discoveredStaffMembers.add(staffMember);
        discoveredUserRoles.put(staffMember.getId(), staffMember.getRole());
      } else {
        UserRole role = staffMember.getRole();
        UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, indentifier);
        EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
        if (environmentUser == null) {
          discoveredUserRoles.put(staffMember.getId(), role);
        } else {
          String roleIdentifier = identifierMapper.getEnvironmentRoleIdentifier(role);
          EnvironmentRoleEntity environmentRoleEntity = environmentRoleEntityController.findEnvironmentRoleEntity(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, roleIdentifier);
          if (environmentRoleEntity == null) {
            removedUserRoles.put(staffMember.getId(), roleIdentifier);
          } else {
            if (!environmentUser.getRole().getId().equals(environmentRoleEntity.getId())) {
              RoleSchoolDataIdentifier removedRoleIdentifier = environmentRoleEntityController.findRoleSchoolDataIdentifierByDataSourceAndRoleEntity(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, environmentRoleEntity);
              removedUserRoles.put(staffMember.getId(), removedRoleIdentifier.getIdentifier());
              discoveredUserRoles.put(staffMember.getId(), role);
            }
          }
        }
      }
    }
    
    for (fi.pyramus.rest.model.User discoveredStaffMember : discoveredStaffMembers) {
      fireStaffMemberDiscovered(discoveredStaffMember);
    }
    
    for (Long pyramusId : removedUserRoles.keySet()) {
      String removedRoleIdentifier = removedUserRoles.get(pyramusId);
      fireStaffMemberRoleRemoved(pyramusId, removedRoleIdentifier);
    }
    
    for (Long pyramusId : discoveredUserRoles.keySet()) {
      UserRole userRole = discoveredUserRoles.get(pyramusId);
      fireStaffMemberRoleDiscovered(pyramusId, userRole);
    }
    
    return discoveredStaffMembers.size();
  }
  
  /**
   * Updates a course from Pyramus
   * 
   * @param pyramusId id of course in Pyramus
   * @return returns whether new course was created or not
   */
  public void updateCourse(Long courseId) {
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseId);
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier);
    if (workspaceEntity == null) {
      Course course = pyramusClient.get("/courses/courses/" + courseId, Course.class);
      if (course != null) {
        fireWorkspaceDiscovered(course);
      } else {
        logger.log(Level.WARNING, "Could not find course #" + courseId + " from Pyramus");
      }
    }
  }

  /**
   * Updates courses from Pyramus
   * 
   * @param offset first course to be updated
   * @param maxCourses maximum batch size
   * @return count of updated courses or -1 when no courses were found with given offset
   */
  public int updateCourses(int offset, int maxCourses) {
    Course[] courses = pyramusClient.get("/courses/courses?firstResult=" + offset + "&maxResults=" + maxCourses, Course[].class);
    if ((courses == null) || (courses.length == 0)) {
      return -1;
    }
    
    List<String> existingIdentifiers = workspaceEntityController.listWorkspaceEntityIdentifiersByDataSource(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    List<Course> discoveredCourses = new ArrayList<>();

    for (Course course : courses) {
      String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(course.getId());
      if (!existingIdentifiers.contains(workspaceIdentifier)) {
        discoveredCourses.add(course); 
      }
    }
    
    for (Course discoveredCourse : discoveredCourses) {
      fireWorkspaceDiscovered(discoveredCourse);
    }

    return discoveredCourses.size();
  }
  
  /**
   * Updates course staff member from Pyramus
   * 
   * @param courseStaffMemberId id of course staff member in Pyramus
   * @param courseId id of course in Pyramus
   * @param staffMemberId id of staff member in Pyramus
   * @return returns whether new staff member was created or not
   */
  public boolean updateCourseStaffMember(Long courseStaffMemberId, Long courseId, Long staffMemberId) {
    CourseStaffMember staffMember = pyramusClient.get("/courses/courses/" + courseId + "/staffMembers/" + courseStaffMemberId, CourseStaffMember.class);
    if (staffMember != null) {
      String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseId);
      String identifier = identifierMapper.getWorkspaceStaffIdentifier(courseStaffMemberId);

      WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier);
      if (workspaceEntity != null) {
        WorkspaceUserEntity workspaceUserEntity = workspaceController.findWorkspaceUserEntityByWorkspaceAndIdentifier(workspaceEntity, identifier);
        if (workspaceUserEntity == null) {
          fireCourseStaffMemberDiscovered(staffMember);
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Updates course staff members from Pyramus
   * 
   * @param courseId id of course in Pyramus
   * @return count of updated courses staff members
   */
  public int updateCourseStaffMembers(Long courseId) {
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseId);
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier);
    
    CourseStaffMember[] staffMembers = pyramusClient.get("/courses/courses/" + courseId + "/staffMembers", CourseStaffMember[].class);
    if (staffMembers != null) {
      
      for (CourseStaffMember staffMember : staffMembers) {
        String staffIdentifier = identifierMapper.getWorkspaceStaffIdentifier(staffMember.getId());
        WorkspaceUserEntity workspaceUserEntity = workspaceController.findWorkspaceUserEntityByWorkspaceAndIdentifier(workspaceEntity, staffIdentifier);
        if (workspaceUserEntity == null) {
          fireCourseStaffMemberDiscovered(staffMember);
        }
      }

    }
    
    return 0;
  }
  
  public int updateUserRoles() {
    int count = 0;
    
    for (fi.pyramus.rest.model.UserRole userRole : fi.pyramus.rest.model.UserRole.values()) {
      String roleIdentifier = identifierMapper.getEnvironmentRoleIdentifier(userRole);
      if (environmentRoleEntityController.findEnvironmentRoleEntity(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, roleIdentifier) == null) {
        EnvironmentRole environmentRole = entityFactory.createEntity(userRole);
        schoolDataEnvironmentRoleDiscoveredEvent.fire(new SchoolDataEnvironmentRoleDiscoveredEvent(environmentRole.getSchoolDataSource(), environmentRole.getIdentifier(), environmentRole.getArchetype(), environmentRole.getName())); 
        count++;
      }
    }
    
    CourseStaffMemberRole[] staffMemberRoles = pyramusClient.get("/courses/staffMemberRoles", CourseStaffMemberRole[].class);
    for (CourseStaffMemberRole staffMemberRole : staffMemberRoles) {
      String identifier = identifierMapper.getWorkspaceStaffRoleIdentifier(staffMemberRole.getId());
      WorkspaceRoleEntity workspaceRoleEntity = workspaceRoleEntityController.findWorkspaceRoleEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier);
      if (workspaceRoleEntity == null) {
        WorkspaceRole workspaceRole = entityFactory.createEntity(staffMemberRole);
        schoolDataWorkspaceRoleDiscoveredEvent.fire(new SchoolDataWorkspaceRoleDiscoveredEvent(workspaceRole.getSchoolDataSource(), workspaceRole.getIdentifier(), workspaceRole.getArchetype(), workspaceRole.getName()));
        count++;
      }
    }
    
    WorkspaceRole studentRole = entityFactory.createCourseStudentRoleEntity();
    WorkspaceRoleEntity studentWorkspaceRoleEntity = workspaceRoleEntityController.findWorkspaceRoleEntityByDataSourceAndIdentifier(studentRole.getSchoolDataSource(), studentRole.getIdentifier());
    if (studentWorkspaceRoleEntity == null) {
      schoolDataWorkspaceRoleDiscoveredEvent.fire(new SchoolDataWorkspaceRoleDiscoveredEvent(studentRole.getSchoolDataSource(), studentRole.getIdentifier(), studentRole.getArchetype(), studentRole.getName()));
      count++;
    }
    
    return count;
  }

  public int updateWorkspaceStudents(WorkspaceEntity workspaceEntity) {
//    Long courseId = identifierMapper.getPyramusCourseId(workspaceEntity.getIdentifier());
//    
//    CourseStudent[] courseStudents = pyramusClient.get("/courses/courses/" + courseId + "/students", CourseStudent[].class);
//    if (courseStudents != null) {
//      schoolDataEntityInitializerProvider.initWorkspaceUsers(entityFactory.createEntity(courseStudents));
//    }
//    
//    return 0;
    return 0;
  }

  private void synchronizeStudents(List<fi.muikku.schooldata.entity.User> newUsers, List<fi.muikku.schooldata.entity.User> updateUsers) {
//    List<UserEmail> userEmails = new ArrayList<>();
//    
//    if (newUsers != null) {
//      schoolDataEntityInitializerProvider.initUsers(newUsers);
//      
//      List<UserRole> userRoles = new ArrayList<>(); 
//      Role studentRole = entityFactory.createEntity(fi.pyramus.rest.model.UserRole.STUDENT);
//      
//      for (User newUser : newUsers) {
//        userRoles.add(new PyramusUserRole("PYRAMUS-" + newUser.getIdentifier(), newUser.getIdentifier(), studentRole.getIdentifier()));
//      }
//      
//      schoolDataEntityInitializerProvider.initUserRoles(userRoles);
//      
//      for (fi.muikku.schooldata.entity.User user : newUsers) {
//        Long pyramusStudentId = identifierMapper.getPyramusStudentId(user.getIdentifier());
//        Email[] studentEmails = pyramusClient.get("/students/students/" + pyramusStudentId.toString() + "/emails", Email[].class);
//        
//        for (Email studentEmail : studentEmails) {
//          userEmails.add(new PyramusUserEmail("PYRAMUS-" + studentEmail.getId().toString(), user.getIdentifier(), studentEmail.getAddress()));
//        }
//      }
//    }
//
//    if (updateUsers != null) {
//      for (fi.muikku.schooldata.entity.User user : updateUsers) {
//        Long pyramusStudentId = identifierMapper.getPyramusStudentId(user.getIdentifier());
//        Email[] studentEmails = pyramusClient.get("/students/students/" + pyramusStudentId.toString() + "/emails", Email[].class);
//  
//        if (studentEmails != null) {
//          for (Email studentEmail : studentEmails) {
//            userEmails.add(new PyramusUserEmail("PYRAMUS-" + studentEmail.getId().toString(), user.getIdentifier(), studentEmail.getAddress()));
//          }
//        }
//      }
//    }
//    
//    schoolDataEntityInitializerProvider.initUserEmails(userEmails);
  }
  
  private void fireStaffMemberDiscovered(fi.pyramus.rest.model.User staffMember) {
    String staffMemberIdentifier = identifierMapper.getStaffIdentifier(staffMember.getId());
    List<String> emails = new ArrayList<>();
    
    Email[] studentEmails = pyramusClient.get("/staff/members/" + staffMember.getId() + "/emails", Email[].class);
    for (Email studentEmail : studentEmails) {
      emails.add(studentEmail.getAddress());
    }
    
    schoolDataUserDiscoveredEvent.fire(new SchoolDataUserDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, staffMemberIdentifier, emails));
  }

  private void fireStudentDiscoverted(Student student) {
    String studentIdentifier = identifierMapper.getStudentIdentifier(student.getId());
 
   List<String> emails = new ArrayList<>();
    
    Email[] studentEmails = pyramusClient.get("/students/students/" + student.getId() + "/emails", Email[].class);
    for (Email studentEmail : studentEmails) {
      emails.add(studentEmail.getAddress());
    }
    
    schoolDataUserDiscoveredEvent.fire(new SchoolDataUserDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, studentIdentifier, emails));
  }

  private void fireWorkspaceDiscovered(Course course) {
    String identifier = identifierMapper.getWorkspaceIdentifier(course.getId());
    schoolDataWorkspaceDiscoveredEvent.fire(new SchoolDataWorkspaceDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier, course.getName()));
  }

  private void fireStaffMemberRoleDiscovered(Long pyramusId, UserRole userRole) {
    String roleIdentifier = identifierMapper.getEnvironmentRoleIdentifier(userRole);
    String userIdentifier = identifierMapper.getStaffIdentifier(pyramusId);
    schoolDataUserEnvironmentRoleDiscoveredEvent.fire(new SchoolDataUserEnvironmentRoleDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, roleIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userIdentifier));
  }

  private void fireStaffMemberRoleRemoved(Long pyramusId, String roleIdentifier) {
    String userIdentifier = identifierMapper.getStaffIdentifier(pyramusId);
    schoolDataUserEnvironmentRoleDiscoveredEvent.fire(new SchoolDataUserEnvironmentRoleDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, roleIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userIdentifier));
  }
  
  private void fireCourseStaffMemberDiscovered(CourseStaffMember courseStaffMember) {
    String identifier = identifierMapper.getWorkspaceStaffIdentifier(courseStaffMember.getId());
    String userIdentifier = identifierMapper.getStaffIdentifier(courseStaffMember.getUserId());
    String roleIdentifier = identifierMapper.getWorkspaceStaffRoleIdentifier(courseStaffMember.getRoleId());
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseStaffMember.getCourseId());

    schoolDataWorkspaceUserDiscoveredEvent.fire(new SchoolDataWorkspaceUserDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        userIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, roleIdentifier));
  }
}
