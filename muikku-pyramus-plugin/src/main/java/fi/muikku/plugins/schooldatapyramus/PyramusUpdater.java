package fi.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.RoleSchoolDataIdentifier;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserRoleType;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.muikku.plugins.schooldatapyramus.rest.PyramusClient;
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
import fi.muikku.schooldata.events.SchoolDataUserUpdatedEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceRoleDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceRoleRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceUpdatedEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceUserDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceUserRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceUserUpdatedEvent;
import fi.muikku.users.EnvironmentRoleEntityController;
import fi.muikku.users.EnvironmentUserController;
import fi.muikku.users.RoleSchoolDataIdentifierController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.WorkspaceRoleEntityController;
import fi.muikku.users.WorkspaceUserEntityController;
import fi.pyramus.rest.model.ContactType;
import fi.pyramus.rest.model.Course;
import fi.pyramus.rest.model.CourseStaffMember;
import fi.pyramus.rest.model.CourseStaffMemberRole;
import fi.pyramus.rest.model.CourseStudent;
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
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private PyramusSchoolDataEntityFactory entityFactory;
  
  @Inject
  private PyramusClient pyramusClient;

  @Inject
  private PyramusIdentifierMapper identifierMapper;
  
  @Inject
  private EnvironmentRoleEntityController environmentRoleEntityController;

  @Inject
  private RoleSchoolDataIdentifierController roleSchoolDataIdentifierController;
  
  @Inject
  private EnvironmentUserController environmentUserController;
  
  @Inject
  private WorkspaceRoleEntityController workspaceRoleEntityController;
  
  @Inject
  private Event<SchoolDataUserDiscoveredEvent> schoolDataUserDiscoveredEvent;

  @Inject
  private Event<SchoolDataUserUpdatedEvent> schoolDataUserUpdatedEvent;

  @Inject
  private Event<SchoolDataUserRemovedEvent> schoolDataUserRemovedEvent;

  @Inject
  private Event<SchoolDataWorkspaceUserDiscoveredEvent> schoolDataWorkspaceUserDiscoveredEvent;

  @Inject
  private Event<SchoolDataWorkspaceUserUpdatedEvent> schoolDataWorkspaceUserUpdatedEvent;

  @Inject
  private Event<SchoolDataWorkspaceUserRemovedEvent> schoolDataWorkspaceUserRemovedEvent;

  @Inject
  private Event<SchoolDataWorkspaceDiscoveredEvent> schoolDataWorkspaceDiscoveredEvent;

  @Inject
  private Event<SchoolDataWorkspaceUpdatedEvent> schoolDataWorkspaceUpdatedEvent;

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
    String studentIdentifier = identifierMapper.getStudentIdentifier(pyramusId);
    UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, studentIdentifier);

    Student student = pyramusClient.get("/students/students/" + pyramusId, Student.class);
    if (student != null) {
      if (userEntity == null) {
        fireStudentDiscovered(student);
        return true;
      } else {
        fireStudentUpdated(student);
        return false;
      }
    } else {
      if (userEntity != null) {
        fireStudentRemoved(pyramusId);
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
    Student[] students = pyramusClient.get("/students/students?filterArchived=false&firstResult=" + offset + "&maxResults=" + maxStudents, Student[].class);
    if (students.length == 0) {
      return -1;
    }

    List<String> existingIdentifiers = userEntityController.listUserEntityIdentifiersByDataSource(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    
    List<Student> discoveredStudents = new ArrayList<>();
    List<Student> removedStudents = new ArrayList<>();
    Map<Long, UserRole> discoveredUserRoles = new HashMap<>();
    Map<Long, String> removedUserRoles = new HashMap<>();
    
    for (Student student : students) {
      String indentifier = identifierMapper.getStudentIdentifier(student.getId());
      
      if (student.getArchived()) {
        if (existingIdentifiers.contains(indentifier)) {
          removedStudents.add(student);
          
          String roleIdentifier = identifierMapper.getEnvironmentRoleIdentifier(UserRole.STUDENT);
          removedUserRoles.put(student.getId(), roleIdentifier);
        }
      } else {
        if (!existingIdentifiers.contains(indentifier)) {
          discoveredStudents.add(student);
          discoveredUserRoles.put(student.getId(), UserRole.STUDENT);
        }
      }
    }
    
    for (Student removedStudent : removedStudents) {
      fireStudentRemoved(removedStudent.getId());
    }
    
    for (Student discoveredStudent : discoveredStudents) {
      fireStudentDiscovered(discoveredStudent);
    }
    
    for (Long pyramusId : removedUserRoles.keySet()) {
      String removedRoleIdentifier = removedUserRoles.get(pyramusId);
      fireStudentRoleRemoved(pyramusId, removedRoleIdentifier);
    }
    
    for (Long pyramusId : discoveredUserRoles.keySet()) {
      UserRole userRole = discoveredUserRoles.get(pyramusId);
      fireStudentRoleDiscovered(pyramusId, userRole);
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
    fi.pyramus.rest.model.StaffMember staffMember = pyramusClient.get("/staff/members/" + pyramusId, fi.pyramus.rest.model.StaffMember.class);
    String staffMemberIdentifier = identifierMapper.getStaffIdentifier(pyramusId);
    UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, staffMemberIdentifier);
    
    if (staffMember != null) {
      if (userEntity == null) {
        fireStaffMemberDiscovered(staffMember);
        return true;
      } else {
        fireStaffMemberUpdated(staffMember);
        return false;
      }
    } else {
      if (userEntity != null) {
        fireStaffMemberRemoved(pyramusId);
      }
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
    fi.pyramus.rest.model.StaffMember[] staffMembers = pyramusClient.get("/staff/members?firstResult=" + offset + "&maxResults=" + maxStaffMembers, fi.pyramus.rest.model.StaffMember[].class);
    if (staffMembers.length == 0) {
      return -1;
    }
    
    // TODO: staff member removals can be left unnoticed if webhooks fails
    //  because they do not have archived flag

    List<String> existingIdentifiers = userEntityController.listUserEntityIdentifiersByDataSource(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    List<fi.pyramus.rest.model.StaffMember> discoveredStaffMembers = new ArrayList<>();
    Map<Long, UserRole> discoveredUserRoles = new HashMap<>();
    Map<Long, String> removedUserRoles = new HashMap<>();
    
    for (fi.pyramus.rest.model.StaffMember staffMember : staffMembers) {
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
            if (environmentUser.getRole() == null) {
              discoveredUserRoles.put(staffMember.getId(), role);
            } else {
              if (!environmentUser.getRole().getId().equals(environmentRoleEntity.getId())) {
                RoleSchoolDataIdentifier removedRoleIdentifier = roleSchoolDataIdentifierController.findRoleSchoolDataIdentifierByDataSourceAndRoleEntity(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, environmentUser.getRole());
                removedUserRoles.put(staffMember.getId(), removedRoleIdentifier.getIdentifier());
                discoveredUserRoles.put(staffMember.getId(), role);
              }
            }
          }
        }
      }
    }
    
    for (fi.pyramus.rest.model.StaffMember discoveredStaffMember : discoveredStaffMembers) {
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
    Course course = pyramusClient.get("/courses/courses/" + courseId, Course.class);
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier);

    if (course != null) {
      if (workspaceEntity == null) {
        fireWorkspaceDiscovered(course);
      } else {
        fireWorkspaceUpdated(course);
      }
    } else {
      if (workspaceEntity != null) {
        fireWorkspaceRemoved(courseId);
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
    Course[] courses = pyramusClient.get("/courses/courses?filterArchived=false&firstResult=" + offset + "&maxResults=" + maxCourses, Course[].class);
    if ((courses == null) || (courses.length == 0)) {
      return -1;
    }
    
    List<String> existingIdentifiers = workspaceEntityController.listWorkspaceEntityIdentifiersByDataSource(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    List<Course> discoveredCourses = new ArrayList<>();
    List<Course> removedCourses = new ArrayList<>();
    
    for (Course course : courses) {
      String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(course.getId());
      
      if (course.getArchived()) {
        if (existingIdentifiers.contains(workspaceIdentifier)) {
          removedCourses.add(course); 
        }
      } else {
        if (!existingIdentifiers.contains(workspaceIdentifier)) {
          discoveredCourses.add(course); 
        }
      }
    }
    
    for (Course discoveredCourse : discoveredCourses) {
      fireWorkspaceDiscovered(discoveredCourse);
    }
    
    for (Course removedCourse : removedCourses) {
      fireWorkspaceRemoved(removedCourse.getId());
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
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseId);
    String identifier = identifierMapper.getWorkspaceStaffIdentifier(courseStaffMemberId);

    // TODO: course staff member removals can be left unnoticed if 
    // webhooks fails because they do not have archived flag

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier);
    if (workspaceEntity == null) {
      updateCourse(courseId);
      workspaceEntity = workspaceController.findWorkspaceEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier);
    }
    
    if (workspaceEntity != null) {
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndIdentifier(workspaceEntity, identifier);
      
      CourseStaffMember staffMember = pyramusClient.get("/courses/courses/" + courseId + "/staffMembers/" + courseStaffMemberId, CourseStaffMember.class);
      if (staffMember != null) {
        if (workspaceUserEntity == null) {
          fireCourseStaffMemberDiscovered(staffMember);
          return true;
        } else {
          fireCourseStaffMemberUpdated(staffMember);
        }
      } else {
        if (workspaceUserEntity != null) {
          fireCourseStaffMemberRemoved(courseStaffMemberId, staffMemberId, courseId);
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
        WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndIdentifier(workspaceEntity, staffIdentifier);
        if (workspaceUserEntity == null) {
          fireCourseStaffMemberDiscovered(staffMember);
        }
      }

    }
    
    return 0;
  }
  
  /**
   * Updates user roles from Pyramus
   * 
   * @return count of updates roles
   */
  public int updateUserRoles() {
    int count = 0;

    List<RoleSchoolDataIdentifier> existingRoleIdentifiers = roleSchoolDataIdentifierController.listRoleSchoolDataIdentifiersByDataSource(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    Map<String, RoleSchoolDataIdentifier> removedIdentifiers = new HashMap<>();
    for (RoleSchoolDataIdentifier existingRoleIdentifier : existingRoleIdentifiers) {
      removedIdentifiers.put(existingRoleIdentifier.getIdentifier(), existingRoleIdentifier);
    }
    
    for (fi.pyramus.rest.model.UserRole userRole : fi.pyramus.rest.model.UserRole.values()) {
      String roleIdentifier = identifierMapper.getEnvironmentRoleIdentifier(userRole);
      removedIdentifiers.remove(roleIdentifier);
      
      if (environmentRoleEntityController.findEnvironmentRoleEntity(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, roleIdentifier) == null) {
        EnvironmentRole environmentRole = entityFactory.createEntity(userRole);
        schoolDataEnvironmentRoleDiscoveredEvent.fire(new SchoolDataEnvironmentRoleDiscoveredEvent(environmentRole.getSchoolDataSource(), environmentRole.getIdentifier(), environmentRole.getArchetype(), environmentRole.getName())); 
        count++;
      }
    }
    
    CourseStaffMemberRole[] staffMemberRoles = pyramusClient.get("/courses/staffMemberRoles", CourseStaffMemberRole[].class);
    for (CourseStaffMemberRole staffMemberRole : staffMemberRoles) {
      String identifier = identifierMapper.getWorkspaceStaffRoleIdentifier(staffMemberRole.getId());
      removedIdentifiers.remove(identifier);

      WorkspaceRoleEntity workspaceRoleEntity = workspaceRoleEntityController.findWorkspaceRoleEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier);
      if (workspaceRoleEntity == null) {
        WorkspaceRole workspaceRole = entityFactory.createEntity(staffMemberRole);
        schoolDataWorkspaceRoleDiscoveredEvent.fire(new SchoolDataWorkspaceRoleDiscoveredEvent(workspaceRole.getSchoolDataSource(), workspaceRole.getIdentifier(), workspaceRole.getArchetype(), workspaceRole.getName()));
        count++;
      }
    }
    
    WorkspaceRole studentRole = entityFactory.createCourseStudentRoleEntity();
    removedIdentifiers.remove(studentRole.getIdentifier());

    WorkspaceRoleEntity studentWorkspaceRoleEntity = workspaceRoleEntityController.findWorkspaceRoleEntityByDataSourceAndIdentifier(studentRole.getSchoolDataSource(), studentRole.getIdentifier());
    if (studentWorkspaceRoleEntity == null) {
      schoolDataWorkspaceRoleDiscoveredEvent.fire(new SchoolDataWorkspaceRoleDiscoveredEvent(studentRole.getSchoolDataSource(), studentRole.getIdentifier(), studentRole.getArchetype(), studentRole.getName()));
      count++;
    }
    
    Set<String> removedIdentifierIds = removedIdentifiers.keySet();
    
    for (String removedIdentifierId : removedIdentifierIds) {
      RoleSchoolDataIdentifier removedIdentifier = removedIdentifiers.get(removedIdentifierId);
      if (removedIdentifier.getRoleEntity().getType() == UserRoleType.ENVIRONMENT) {
        schoolDataEnvironmentRoleRemovedEvent.fire(new SchoolDataEnvironmentRoleRemovedEvent(removedIdentifier.getDataSource().getIdentifier(), removedIdentifier.getIdentifier()));
      } else if (removedIdentifier.getRoleEntity().getType() == UserRoleType.WORKSPACE) {
        schoolDataWorkspaceRoleRemovedEvent.fire(new SchoolDataWorkspaceRoleRemovedEvent(removedIdentifier.getDataSource().getIdentifier(), removedIdentifier.getIdentifier()));
      }
    }
    
    return count;
  }

  /**
   * Updates course student from Pyramus
   * 
   * @param courseStudentId id of course student in Pyramus
   * @param courseId id of course in Pyramus
   * @param studentId id of student in Pyramus
   * @return returns whether new course student was created or not
   */
  public boolean updateCourseStudent(Long courseStudentId, Long courseId, Long studentId) {
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseId);
    String identifier = identifierMapper.getWorkspaceStudentIdentifier(courseStudentId);
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier);
    if (workspaceEntity == null) {
      updateCourse(courseId);
      workspaceEntity = workspaceController.findWorkspaceEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier);
    }
    
    if (workspaceEntity != null) {
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndIdentifier(workspaceEntity, identifier);

      CourseStudent courseStudent = pyramusClient.get("/courses/courses/" + courseId + "/students/" + courseStudentId, CourseStudent.class);
      if (courseStudent != null) {
        if (workspaceUserEntity == null) {
          fireCourseStudentDiscovered(courseStudent);
          return true;
        } else {
          fireCourseStudentUpdated(courseStudent);
        }
      } else {
        if (workspaceUserEntity != null) {
          fireCourseStudentRemoved(courseStudentId, studentId, courseId);
        }
      }
    }
    
    return false;
  }

  /**
   * Updates course students from Pyramus
   * 
   * @param courseId id of course in Pyramus
   * @return count of updated course students
   */
  public int updateWorkspaceStudents(WorkspaceEntity workspaceEntity) {
    int count = 0;
    Long courseId = identifierMapper.getPyramusCourseId(workspaceEntity.getIdentifier());

    CourseStudent[] courseStudents = pyramusClient.get("/courses/courses/" + courseId + "/students?filterArchived=false", CourseStudent[].class);
    if (courseStudents != null) {
      for (CourseStudent courseStudent : courseStudents) {
        String identifier = identifierMapper.getWorkspaceStudentIdentifier(courseStudent.getId());
        WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndIdentifier(workspaceEntity, identifier);
        if (courseStudent.getArchived()) {
          if (workspaceUserEntity != null) {
            fireCourseStudentRemoved(courseStudent.getId(), courseStudent.getStudentId(), courseStudent.getCourseId());
            count++;
          }
        } else {
          if (workspaceUserEntity == null) {
            fireCourseStudentDiscovered(courseStudent);
            count++;
          }
        }
      }
    }
    
    return count;
  }
 
  private void fireStaffMemberDiscovered(fi.pyramus.rest.model.StaffMember staffMember) {
    String staffMemberIdentifier = identifierMapper.getStaffIdentifier(staffMember.getId());
    List<String> emails = new ArrayList<>();
    
    Email[] staffMemberEmails = pyramusClient.get("/staff/members/" + staffMember.getId() + "/emails", Email[].class);
    for (Email staffMemberEmail : staffMemberEmails) {
      if (staffMemberEmail.getContactTypeId() != null) {
        ContactType contactType = pyramusClient.get("/common/contactTypes/" + staffMemberEmail.getContactTypeId(), ContactType.class);
      
        if (!contactType.getNonUnique())
          emails.add(staffMemberEmail.getAddress());
      } else
        logger.log(Level.WARNING, "ContactType of email is null - email is ignored");
    }
    
    schoolDataUserDiscoveredEvent.fire(new SchoolDataUserDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, staffMemberIdentifier, emails));
  }
 
  private void fireStaffMemberUpdated(fi.pyramus.rest.model.StaffMember staffMember) {
    String staffMemberIdentifier = identifierMapper.getStaffIdentifier(staffMember.getId());
    List<String> emails = new ArrayList<>();
    
    Email[] staffMemberEmails = pyramusClient.get("/staff/members/" + staffMember.getId() + "/emails", Email[].class);
    for (Email staffMemberEmail : staffMemberEmails) {
      if (staffMemberEmail.getContactTypeId() != null) {
        ContactType contactType = pyramusClient.get("/common/contactTypes/" + staffMemberEmail.getContactTypeId(), ContactType.class);
      
        if (!contactType.getNonUnique())
          emails.add(staffMemberEmail.getAddress());
      } else
        logger.log(Level.WARNING, "ContactType of email is null - email is ignored");
    }
    
    schoolDataUserUpdatedEvent.fire(new SchoolDataUserUpdatedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, staffMemberIdentifier, emails));
  }
 
  private void fireStaffMemberRemoved(Long staffMemberId) {
    String staffMemberIdentifier = identifierMapper.getStaffIdentifier(staffMemberId);
    schoolDataUserRemovedEvent.fire(new SchoolDataUserRemovedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, staffMemberIdentifier));
  }

  private void fireStudentDiscovered(Student student) {
    String studentIdentifier = identifierMapper.getStudentIdentifier(student.getId());
 
    List<String> emails = new ArrayList<>();

    Email[] studentEmails = pyramusClient.get("/students/students/" + student.getId() + "/emails", Email[].class);
    for (Email studentEmail : studentEmails) {
      if (studentEmail.getContactTypeId() != null) {
        ContactType contactType = pyramusClient.get("/common/contactTypes/" + studentEmail.getContactTypeId(), ContactType.class);
      
        if (!contactType.getNonUnique())
          emails.add(studentEmail.getAddress());
      } else
        logger.log(Level.WARNING, "ContactType of email is null - email is ignored");
    }
    
    schoolDataUserDiscoveredEvent.fire(new SchoolDataUserDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, studentIdentifier, emails));
  }

  private void fireStudentUpdated(Student student) {
    String studentIdentifier = identifierMapper.getStudentIdentifier(student.getId());
 
    List<String> emails = new ArrayList<>();
    
    Email[] studentEmails = pyramusClient.get("/students/students/" + student.getId() + "/emails", Email[].class);
    for (Email studentEmail : studentEmails) {
      if (studentEmail.getContactTypeId() != null) {
        ContactType contactType = pyramusClient.get("/common/contactTypes/" + studentEmail.getContactTypeId(), ContactType.class);
      
        if (!contactType.getNonUnique())
          emails.add(studentEmail.getAddress());
      } else
        logger.log(Level.WARNING, "ContactType of email is null - email is ignored");
    }
    
    schoolDataUserUpdatedEvent.fire(new SchoolDataUserUpdatedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, studentIdentifier, emails));
  }
  
  private void fireStudentRemoved(Long studentId) {
    String studentIdentifier = identifierMapper.getStudentIdentifier(studentId);
    schoolDataUserRemovedEvent.fire(new SchoolDataUserRemovedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, studentIdentifier));
  }

  private void fireWorkspaceDiscovered(Course course) {
    String identifier = identifierMapper.getWorkspaceIdentifier(course.getId());
    Map<String, Object> extra = new HashMap<>();
    extra.put("pyramusVariables", course.getVariables());
    schoolDataWorkspaceDiscoveredEvent.fire(new SchoolDataWorkspaceDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier, course.getName(), extra));
  }

  private void fireWorkspaceUpdated(Course course) {
    String identifier = identifierMapper.getWorkspaceIdentifier(course.getId());
    schoolDataWorkspaceUpdatedEvent.fire(new SchoolDataWorkspaceUpdatedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier, course.getName()));
  }

  private void fireWorkspaceRemoved(Long courseId) {
    String identifier = identifierMapper.getWorkspaceIdentifier(courseId);
    schoolDataWorkspaceRemovedEvent.fire(new SchoolDataWorkspaceRemovedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier));
  }

  private void fireStaffMemberRoleDiscovered(Long pyramusId, UserRole userRole) {
    String roleIdentifier = identifierMapper.getEnvironmentRoleIdentifier(userRole);
    String userIdentifier = identifierMapper.getStaffIdentifier(pyramusId);
    schoolDataUserEnvironmentRoleDiscoveredEvent.fire(new SchoolDataUserEnvironmentRoleDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, roleIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userIdentifier));
  }

  private void fireStaffMemberRoleRemoved(Long pyramusId, String roleIdentifier) {
    String userIdentifier = identifierMapper.getStaffIdentifier(pyramusId);
    schoolDataUserEnvironmentRoleRemovedEvent.fire(new SchoolDataUserEnvironmentRoleRemovedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, roleIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userIdentifier));
  }
  
  private void fireStudentRoleDiscovered(Long pyramusId, UserRole userRole) {
    String roleIdentifier = identifierMapper.getEnvironmentRoleIdentifier(userRole);
    String userIdentifier = identifierMapper.getStudentIdentifier(pyramusId);
    schoolDataUserEnvironmentRoleDiscoveredEvent.fire(new SchoolDataUserEnvironmentRoleDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, roleIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userIdentifier));
  }

  private void fireStudentRoleRemoved(Long pyramusId, String roleIdentifier) {
    String userIdentifier = identifierMapper.getStudentIdentifier(pyramusId);
    schoolDataUserEnvironmentRoleRemovedEvent.fire(new SchoolDataUserEnvironmentRoleRemovedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, roleIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userIdentifier));
  }
  
  private void fireCourseStaffMemberDiscovered(CourseStaffMember courseStaffMember) {
    String identifier = identifierMapper.getWorkspaceStaffIdentifier(courseStaffMember.getId());
    String userIdentifier = identifierMapper.getStaffIdentifier(courseStaffMember.getStaffMemberId());
    String roleIdentifier = identifierMapper.getWorkspaceStaffRoleIdentifier(courseStaffMember.getRoleId());
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseStaffMember.getCourseId());

    schoolDataWorkspaceUserDiscoveredEvent.fire(new SchoolDataWorkspaceUserDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        userIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, roleIdentifier));
  }
  
  private void fireCourseStaffMemberUpdated(CourseStaffMember courseStaffMember) {
    String identifier = identifierMapper.getWorkspaceStaffIdentifier(courseStaffMember.getId());
    String userIdentifier = identifierMapper.getStaffIdentifier(courseStaffMember.getStaffMemberId());
    String roleIdentifier = identifierMapper.getWorkspaceStaffRoleIdentifier(courseStaffMember.getRoleId());
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseStaffMember.getCourseId());

    schoolDataWorkspaceUserUpdatedEvent.fire(new SchoolDataWorkspaceUserUpdatedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        userIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, roleIdentifier));
  }

  private void fireCourseStaffMemberRemoved(Long courseStaffMemberId, Long staffMemberId, Long courseId) {
    String identifier = identifierMapper.getWorkspaceStaffIdentifier(courseStaffMemberId);
    String userIdentifier = identifierMapper.getStaffIdentifier(staffMemberId);
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseId);

    schoolDataWorkspaceUserRemovedEvent.fire(new SchoolDataWorkspaceUserRemovedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        userIdentifier));
  }

  private void fireCourseStudentDiscovered(CourseStudent courseStudent) {
    String identifier = identifierMapper.getWorkspaceStudentIdentifier(courseStudent.getId());
    String userIdentifier = identifierMapper.getStudentIdentifier(courseStudent.getStudentId());
    String roleIdentifier = identifierMapper.getWorkspaceStudentRoleIdentifier();
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseStudent.getCourseId());

    schoolDataWorkspaceUserDiscoveredEvent.fire(new SchoolDataWorkspaceUserDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        userIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, roleIdentifier));
  }

  private void fireCourseStudentUpdated(CourseStudent courseStudent) {
    String identifier = identifierMapper.getWorkspaceStudentIdentifier(courseStudent.getId());
    String userIdentifier = identifierMapper.getStudentIdentifier(courseStudent.getStudentId());
    String roleIdentifier = identifierMapper.getWorkspaceStudentRoleIdentifier();
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseStudent.getCourseId());

    schoolDataWorkspaceUserUpdatedEvent.fire(new SchoolDataWorkspaceUserUpdatedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        userIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, roleIdentifier));
  }

  private void fireCourseStudentRemoved(Long courseStudentId, Long studentId, Long courseId) {
    String identifier = identifierMapper.getWorkspaceStudentIdentifier(courseStudentId);
    String userIdentifier = identifierMapper.getStudentIdentifier(studentId);
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseId);

    schoolDataWorkspaceUserRemovedEvent.fire(new SchoolDataWorkspaceUserRemovedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        userIdentifier));
  }
}
