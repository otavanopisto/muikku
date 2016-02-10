package fi.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.AccessTimeout;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Stateless;
import javax.enterprise.event.Event;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.joda.time.DateTime;

import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.RoleSchoolDataIdentifier;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.users.UserGroupUserEntity;
import fi.muikku.model.users.UserRoleType;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.muikku.schooldata.SchoolDataIdentifier;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.EnvironmentRole;
import fi.muikku.schooldata.entity.WorkspaceRole;
import fi.muikku.schooldata.events.SchoolDataEnvironmentRoleDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataEnvironmentRoleRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupUpdatedEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupUserDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupUserRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupUserUpdatedEvent;
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
import fi.muikku.users.UserEmailEntityController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserGroupEntityController;
import fi.muikku.users.UserSchoolDataIdentifierController;
import fi.muikku.users.WorkspaceRoleEntityController;
import fi.muikku.users.WorkspaceUserEntityController;
import fi.pyramus.rest.model.ContactType;
import fi.pyramus.rest.model.Course;
import fi.pyramus.rest.model.CourseStaffMember;
import fi.pyramus.rest.model.CourseStaffMemberRole;
import fi.pyramus.rest.model.CourseStudent;
import fi.pyramus.rest.model.Email;
import fi.pyramus.rest.model.Person;
import fi.pyramus.rest.model.StaffMember;
import fi.pyramus.rest.model.Student;
import fi.pyramus.rest.model.StudentGroup;
import fi.pyramus.rest.model.StudentGroupStudent;
import fi.pyramus.rest.model.StudentGroupUser;
import fi.pyramus.rest.model.StudyProgramme;
import fi.pyramus.rest.model.UserRole;

@Stateless
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
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private PyramusSchoolDataEntityFactory entityFactory;
  
  @Inject
  private Instance<PyramusClient> pyramusClient;

  @Inject
  private PyramusIdentifierMapper identifierMapper;
  
  @Inject
  private EnvironmentRoleEntityController environmentRoleEntityController;

  @Inject
  private RoleSchoolDataIdentifierController roleSchoolDataIdentifierController;
  
  @Inject
  private WorkspaceRoleEntityController workspaceRoleEntityController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private EnvironmentUserController environmentUserController;

  @Inject
  private UserEmailEntityController userEmailEntityController;
  
  @Inject
  private Event<SchoolDataUserUpdatedEvent> schoolDataUserUpdatedEvent;

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
  private Event<SchoolDataUserGroupDiscoveredEvent> schoolDataUserGroupDiscoveredEvent;

  @Inject
  private Event<SchoolDataUserGroupUpdatedEvent> schoolDataUserGroupUpdatedEvent;

  @Inject
  private Event<SchoolDataUserGroupRemovedEvent> schoolDataUserGroupRemovedEvent;

  @Inject
  private Event<SchoolDataUserGroupUserDiscoveredEvent> schoolDataUserGroupUserDiscoveredEvent;

  @Inject
  private Event<SchoolDataUserGroupUserUpdatedEvent> schoolDataUserGroupUserUpdatedEvent;

  @Inject
  private Event<SchoolDataUserGroupUserRemovedEvent> schoolDataUserGroupUserRemovedEvent;

  public int updateStudyProgrammes() {
    StudyProgramme[] studyProgrammes = pyramusClient.get().get("/students/studyProgrammes", StudyProgramme[].class);
    
    if (studyProgrammes == null || studyProgrammes.length == 0)
      return -1;
    
    for (StudyProgramme studyProgramme : studyProgrammes) {
      updateStudyProgramme(studyProgramme.getId());
    }
    
    return studyProgrammes.length;
  }

  public void updateStudyProgramme(Long pyramusId) {
    StudyProgramme studentGroup = pyramusClient.get().get(String.format("/students/studyProgrammes/%d", pyramusId), StudyProgramme.class);
    String identifier = identifierMapper.getStudyProgrammeIdentifier(pyramusId);
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier, true);
    
    if (studentGroup == null) {
      if (userGroupEntity != null)
        fireUserGroupRemoved(identifier);
    } else {
      if (userGroupEntity == null) {
        fireUserGroupDiscovered(identifier);
      } else {
        fireUserGroupUpdated(identifier);
      }
    }
  }
  
  public int updateStudyProgrammeMembers(int offset, int maxStudents) {
    Student[] students = pyramusClient.get().get("/students/students?filterArchived=false&firstResult=" + offset + "&maxResults=" + maxStudents, Student[].class);
    if (students == null || students.length == 0) {
      return -1;
    }

    for (Student student : students) {
      updateStudyProgrammeMember(student);
    }
    
    return students.length;
  }

  public void updateStudyProgrammeMember(Student student) {
    if (student.getStudyProgrammeId() != null) {
      String studyProgrammeIdentifier = identifierMapper.getStudyProgrammeIdentifier(student.getStudyProgrammeId());
      String studyProgrammeStudentIdentifier = identifierMapper.getStudyProgrammeStudentIdentifier(student.getId());

      UserGroupUserEntity userGroupUserEntity = userGroupEntityController.findUserGroupUserEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, studyProgrammeStudentIdentifier);
      
      boolean isActive = (!student.getArchived()) && (student.getStudyEndDate() == null);
      
      if (isActive) {
        if (userGroupUserEntity == null) {
          String userEntityIdentifier = identifierMapper.getStudentIdentifier(student.getId());
          fireUserGroupUserDiscovered(studyProgrammeStudentIdentifier, studyProgrammeIdentifier, userEntityIdentifier);
        } else
          fireUserGroupUserUpdated(studyProgrammeStudentIdentifier, studyProgrammeIdentifier, userGroupUserEntity.getUserSchoolDataIdentifier().getIdentifier());
      } else {
        if (userGroupUserEntity != null)
          fireUserGroupUserRemoved(studyProgrammeStudentIdentifier, studyProgrammeIdentifier, userGroupUserEntity.getUserSchoolDataIdentifier().getIdentifier());
      }
    }
  }
  
  public int updateStudentGroups(int offset, int batchSize) {
    StudentGroup[] userGroups = pyramusClient.get().get("/students/studentGroups?firstResult=" + offset + "&maxResults=" + batchSize, StudentGroup[].class);
    
    if (userGroups == null || userGroups.length == 0)
      return -1;
    
    for (StudentGroup userGroup : userGroups) {
      updateStudentGroup(userGroup.getId());
    }
    
    return userGroups.length;
  }
  
  public void updateStudentGroup(Long pyramusId) {
    StudentGroup studentGroup = pyramusClient.get().get(String.format("/students/studentGroups/%d", pyramusId), StudentGroup.class);
    String identifier = identifierMapper.getStudentGroupIdentifier(pyramusId);
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier, true);
    
    if (studentGroup == null) {
      if (userGroupEntity != null)
        fireUserGroupRemoved(identifier);
    } else {
      if (userGroupEntity == null) {
        fireUserGroupDiscovered(identifier);
      } else {
        fireUserGroupUpdated(identifier);
      }
    }
  }

  public int updateStudyProgrammeGroupUsers(Long studyProgrammeId) {
    // TODO: There's no endpoint to do this efficiently atm
    
    return 0;
  }
  
  public int updateStudentGroupUsers(Long studentGroupId) {
    String userGroupIdentifier = identifierMapper.getStudentGroupIdentifier(studentGroupId);
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userGroupIdentifier);    

    if (userGroupEntity != null) {
      List<UserGroupUserEntity> existingUsers = userGroupEntityController.listUserGroupUserEntitiesByUserGroupEntity(userGroupEntity);
      List<String> existingGroupUserIds = new ArrayList<String>();
      for (UserGroupUserEntity existingUser : existingUsers) {
        existingGroupUserIds.add(existingUser.getIdentifier());
      }
  
      List<String> foundGroupUserIds = new ArrayList<String>();

      int count = 0;
      
      StudentGroupUser[] userGroupStaffMembers = pyramusClient.get().get(String.format("/students/studentGroups/%d/staffmembers", studentGroupId), StudentGroupUser[].class);
      if (userGroupStaffMembers != null) {
        for (StudentGroupUser sgStaffMember : userGroupStaffMembers) {
          String identifier = identifierMapper.getStudentGroupStaffMemberIdentifier(sgStaffMember.getId());

          foundGroupUserIds.add(identifier);
          
          // If not existing, then it's a new one
          if (!existingGroupUserIds.contains(identifier)) {
            String staffMemberIdentifier = identifierMapper.getStaffIdentifier(sgStaffMember.getStaffMemberId());
            fireUserGroupUserDiscovered(identifier, userGroupIdentifier, staffMemberIdentifier);
          }
        }
        
        count += userGroupStaffMembers.length;
      }
      
      StudentGroupStudent[] userGroupStudents = pyramusClient.get().get(String.format("/students/studentGroups/%d/students", studentGroupId), StudentGroupStudent[].class);
      if (userGroupStudents != null) {
        for (StudentGroupStudent sgs : userGroupStudents) {
          String identifier = identifierMapper.getStudentGroupStudentIdentifier(sgs.getId());
  
          foundGroupUserIds.add(identifier);

          // If not existing, then it's a new one
          if (!existingGroupUserIds.contains(identifier)) {
            String studentIdentifier = identifierMapper.getStudentIdentifier(sgs.getStudentId());
            fireUserGroupUserDiscovered(identifier, userGroupIdentifier, studentIdentifier);
          }
        }
        
        count += userGroupStudents.length;
      }

      // Remove found ids from existing and we'll get the ones to remove
      existingGroupUserIds.removeAll(foundGroupUserIds);
      
      for (String identifier : existingGroupUserIds) {
        UserGroupUserEntity ugu = userGroupEntityController.findUserGroupUserEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier);
        if (ugu != null)
          fireUserGroupUserRemoved(identifier, userGroupIdentifier, ugu.getUserSchoolDataIdentifier().getIdentifier());
      }
      
      return count;
    } else  {
      logger.log(Level.WARNING, String.format("UserGroup is null for id %d - update of users is skipped", studentGroupId));
    }
    
    return 0;
  }
  
  public void updateStudentGroupStudent(Long studentGroupId, Long studentGroupStudentId) {
    StudentGroupStudent studentGroupStudent = pyramusClient.get().get(String.format("/students/studentGroups/%d/students/%d", studentGroupId, studentGroupStudentId), StudentGroupStudent.class);
    String identifier = identifierMapper.getStudentGroupStudentIdentifier(studentGroupStudentId);
    UserGroupUserEntity userGroupUserEntity = userGroupEntityController.findUserGroupUserEntityByDataSourceAndIdentifier(
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier);
    
    String userGroupIdentifier = identifierMapper.getStudentGroupIdentifier(studentGroupId);

    if (studentGroupStudent == null) {
      if (userGroupUserEntity != null)
        fireUserGroupUserRemoved(identifier, userGroupIdentifier, userGroupUserEntity.getUserSchoolDataIdentifier().getIdentifier());
    } else {
      if (userGroupUserEntity == null) {
        String studentIdentifier = identifierMapper.getStudentIdentifier(studentGroupStudent.getStudentId());
        fireUserGroupUserDiscovered(identifier, userGroupIdentifier, studentIdentifier);
      } else {
        fireUserGroupUserUpdated(identifier, userGroupIdentifier, userGroupUserEntity.getUserSchoolDataIdentifier().getIdentifier());
      }
    }
  }

  public void updateStudentGroupStaffMember(Long studentGroupId, Long studentGroupStaffMemberId) {
    StudentGroupUser studentGroupStaffMember = pyramusClient.get().get(String.format("/students/studentGroups/%d/staffmembers/%d", studentGroupId, studentGroupStaffMemberId), StudentGroupUser.class);
    String identifier = identifierMapper.getStudentGroupStaffMemberIdentifier(studentGroupStaffMemberId);
    UserGroupUserEntity userGroupUserEntity = userGroupEntityController.findUserGroupUserEntityByDataSourceAndIdentifier(
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier);
    
    String userGroupIdentifier = identifierMapper.getStudentGroupIdentifier(studentGroupId);

    if (studentGroupStaffMember == null) {
      if (userGroupUserEntity != null)
        fireUserGroupUserRemoved(identifier, userGroupIdentifier, userGroupUserEntity.getUserSchoolDataIdentifier().getIdentifier());
    } else {
      if (userGroupUserEntity == null) {
        String staffMemberIdentifier = identifierMapper.getStaffIdentifier(studentGroupStaffMember.getStaffMemberId());
        fireUserGroupUserDiscovered(identifier, userGroupIdentifier, staffMemberIdentifier);
      } else {
        fireUserGroupUserUpdated(identifier, userGroupIdentifier, userGroupUserEntity.getUserSchoolDataIdentifier().getIdentifier());
      }
    }
  }

  /**
   * Updates a course from Pyramus
   * 
   * @param pyramusId id of course in Pyramus
   * @return returns whether new course was created or not
   */
  public void updateCourse(Long courseId) {
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseId);
    Course course = pyramusClient.get().get("/courses/courses/" + courseId, Course.class);
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
    Course[] courses = pyramusClient.get().get("/courses/courses?filterArchived=false&firstResult=" + offset + "&maxResults=" + maxCourses, Course[].class);
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
      SchoolDataIdentifier workspaceUserIdentifier = new SchoolDataIdentifier(identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifierIncludeArchived(workspaceUserIdentifier);
      
      CourseStaffMember staffMember = pyramusClient.get().get("/courses/courses/" + courseId + "/staffMembers/" + courseStaffMemberId, CourseStaffMember.class);
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
    CourseStaffMember[] staffMembers = pyramusClient.get().get("/courses/courses/" + courseId + "/staffMembers", CourseStaffMember[].class);
    if (staffMembers != null) {
      for (CourseStaffMember staffMember : staffMembers) {
        String staffIdentifier = identifierMapper.getWorkspaceStaffIdentifier(staffMember.getId());
        SchoolDataIdentifier workspaceUserIdentifier = new SchoolDataIdentifier(staffIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
        WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifier(workspaceUserIdentifier);
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
    
    CourseStaffMemberRole[] staffMemberRoles = pyramusClient.get().get("/courses/staffMemberRoles", CourseStaffMemberRole[].class);
    if (staffMemberRoles != null) {
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
      SchoolDataIdentifier workspaceUserIdentifier = new SchoolDataIdentifier(identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifierIncludeArchived(workspaceUserIdentifier);
      CourseStudent courseStudent = pyramusClient.get().get("/courses/courses/" + courseId + "/students/" + courseStudentId, CourseStudent.class);
      if (courseStudent != null && !courseStudent.getArchived()) {
        boolean studentActive = isStudentActive(courseStudent.getStudentId());
        
        if (workspaceUserEntity == null && studentActive) {
          fireCourseStudentDiscovered(courseStudent);
          return true;
        } else {
          if (studentActive) {
            fireCourseStudentUpdated(courseStudent);
          } else {
            fireCourseStudentRemoved(courseStudentId, studentId, courseId);
          }
        }
      } else {
        if (workspaceUserEntity != null) {
          fireCourseStudentRemoved(courseStudentId, studentId, courseId);
        }
      }
    }
    
    return false;
  }

  private boolean isStudentActive(Long studentId) {
    Student student = pyramusClient.get().get(String.format("/students/students/%d", studentId), Student.class);
    if (student == null || student.getArchived()) {
      logger.severe(String.format("Tried to resolve activity for non existings student (%d)", studentId));
      return false;  
    }
    
    DateTime studyStartDate = student.getStudyStartDate();
    DateTime studyEndDate = student.getStudyEndDate();
    
    if (studyStartDate == null && studyEndDate == null) {
      // It's a never ending study programme
      return true;
    }
    
    boolean startedStudies = studyStartDate != null && studyStartDate.isBefore(System.currentTimeMillis());
    boolean finishedStudies = studyEndDate != null && studyEndDate.isBefore(System.currentTimeMillis());
    
    return startedStudies && !finishedStudies;
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

    CourseStudent[] courseStudents = pyramusClient.get().get("/courses/courses/" + courseId + "/students?filterArchived=false&activeStudents=true", CourseStudent[].class);
    if (courseStudents != null) {
      for (CourseStudent courseStudent : courseStudents) {
        SchoolDataIdentifier workspaceUserIdentifier = toIdentifier(identifierMapper.getWorkspaceStudentIdentifier(courseStudent.getId()));
        WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifierIncludeArchived(workspaceUserIdentifier);
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
    
    CourseStudent[] nonActiveCourseStudents = pyramusClient.get().get("/courses/courses/" + courseId + "/students?filterArchived=false&activeStudents=false", CourseStudent[].class);
    if (nonActiveCourseStudents != null) {
      for (CourseStudent nonActiveCourseStudent : nonActiveCourseStudents) {
        SchoolDataIdentifier workspaceUserIdentifier = toIdentifier(identifierMapper.getWorkspaceStudentIdentifier(nonActiveCourseStudent.getId()));
        WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifierIncludeArchived(workspaceUserIdentifier);
        if (workspaceUserEntity != null) {
          fireCourseStudentRemoved(nonActiveCourseStudent.getId(), nonActiveCourseStudent.getStudentId(), nonActiveCourseStudent.getCourseId());
          count++;
        }
      }
    }
    
    return count;
  }
  
  private void fireWorkspaceDiscovered(Course course) {
    String identifier = identifierMapper.getWorkspaceIdentifier(course.getId());
    Map<String, Object> extra = new HashMap<>();
    extra.put("pyramusVariables", course.getVariables());
    schoolDataWorkspaceDiscoveredEvent.fire(new SchoolDataWorkspaceDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier, course.getName(), extra));
  }

  private void fireWorkspaceUpdated(Course course) {
    String identifier = identifierMapper.getWorkspaceIdentifier(course.getId());
    Map<String, Object> extra = new HashMap<>();
    extra.put("pyramusVariables", course.getVariables());
    schoolDataWorkspaceUpdatedEvent.fire(new SchoolDataWorkspaceUpdatedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier, course.getName(), extra));
  }

  private void fireWorkspaceRemoved(Long courseId) {
    String identifier = identifierMapper.getWorkspaceIdentifier(courseId);
    String searchId = identifier + '/' + SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
    schoolDataWorkspaceRemovedEvent.fire(new SchoolDataWorkspaceRemovedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier, searchId));
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

  private void fireUserGroupDiscovered(String userGroupIdentifier) {
    schoolDataUserGroupDiscoveredEvent.fire(new SchoolDataUserGroupDiscoveredEvent(
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userGroupIdentifier));
  }

  private void fireUserGroupUpdated(String userGroupIdentifier) {
    schoolDataUserGroupUpdatedEvent.fire(new SchoolDataUserGroupUpdatedEvent(
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userGroupIdentifier));
  }
  
  private void fireUserGroupRemoved(String userGroupIdentifier) {
    String searchId = userGroupIdentifier + '/' + SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
    schoolDataUserGroupRemovedEvent.fire(new SchoolDataUserGroupRemovedEvent(
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userGroupIdentifier,
        searchId));
  }
  
  private void fireUserGroupUserDiscovered(String userGroupUserIdentifier, String userGroupIdentifier, String userEntityIdentifier) {
    schoolDataUserGroupUserDiscoveredEvent.fire(new SchoolDataUserGroupUserDiscoveredEvent(
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userGroupUserIdentifier,
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userGroupIdentifier,
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userEntityIdentifier));
  }

  private void fireUserGroupUserUpdated(String userGroupUserIdentifier, String userGroupIdentifier, String userIdentifier) {
    schoolDataUserGroupUserUpdatedEvent.fire(new SchoolDataUserGroupUserUpdatedEvent(
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userGroupUserIdentifier,
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userGroupIdentifier,
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userIdentifier));
  }
  
  private void fireUserGroupUserRemoved(String userGroupUserIdentifier, String userGroupIdentifier, String userIdentifier) {
    schoolDataUserGroupUserRemovedEvent.fire(new SchoolDataUserGroupUserRemovedEvent(
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userGroupUserIdentifier,
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userGroupIdentifier,
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userIdentifier));
  }

  public void updatePerson(Long personId) {
    Person person = pyramusClient.get().get(String.format("/persons/persons/%d", personId), Person.class);
    if (person != null) {
      updatePerson(person);
    } else {
      logger.severe(String.format("Person %d could not be found. Skipping synchronization", personId));
    }
  }
  
  @Lock (LockType.WRITE)
  @AccessTimeout(value=30000)
  public void updatePerson(Person person) {
    Long userEntityId = null;
    
    String defaultIdentifier = null;
    Long defaultUserId = person.getDefaultUserId();
    UserRole defaultUserPyramusRole = null;
    List<String> identifiers = new ArrayList<>();
    List<String> removedIdentifiers = new ArrayList<>();
    List<String> updatedIdentifiers = new ArrayList<>();
    List<String> discoveredIdentifiers = new ArrayList<>();
    List<String> emails = new ArrayList<>();
    
    // List all person's students and staffMembers
    Student[] students = pyramusClient.get().get(String.format("/persons/persons/%d/students", person.getId()), Student[].class);
    StaffMember[] staffMembers = pyramusClient.get().get(String.format("/persons/persons/%d/staffMembers", person.getId()), StaffMember[].class);
    
    // If person does not have a defaultUserId specified, we try to guess something
    if (defaultUserId == null) {
      if ((staffMembers != null) && (staffMembers.length > 0)) {
        // If person has a staffMember instance, lets use that one
        defaultUserId = staffMembers[0].getId();
      } else {
        if (students != null) {
          // Otherwise just use first non archived student (if any)
          for (Student student : students) {
            if (!student.getArchived()) {
              defaultUserId = student.getId();
              break;
            }
          }
        }
      }
    }
    
    if (students != null) {
      // Iterate over all student instances
      for (Student student : students) {
        String identifier = identifierMapper.getStudentIdentifier(student.getId());
  
        if (!student.getArchived()) {
          // If student is not archived, add it to identifiers list 
          identifiers.add(identifier);
          
          // If it's the specified defaultUserId, update defaultIdentifier and role accordingly
          if ((defaultIdentifier == null) && student.getId().equals(defaultUserId)) {
            defaultIdentifier = identifier;
            defaultUserPyramusRole = UserRole.STUDENT;
          }
          
          // List emails and add all emails that are not specified non unique (e.g. contact persons) to the emails list
          Email[] studentEmails = pyramusClient.get().get("/students/students/" + student.getId() + "/emails", Email[].class);
          if (studentEmails != null) {
            for (Email studentEmail : studentEmails) {
              if (studentEmail.getContactTypeId() != null) {
                ContactType contactType = pyramusClient.get().get("/common/contactTypes/" + studentEmail.getContactTypeId(), ContactType.class);
                if (!contactType.getNonUnique() && !emails.contains(studentEmail.getAddress())) {
                  emails.add(studentEmail.getAddress());
                }
              } else {
                logger.log(Level.WARNING, "ContactType of email is null - email is ignored");
              }
            }
          }
        } else {
          // If the student instance if archived, we add it the the removed indentifiers list
          removedIdentifiers.add(identifier);
        }
      }
    }
    
    if (staffMembers != null) {
      for (StaffMember staffMember : staffMembers) {
        // Add staffMember identifier into the identifier list
        String identifier = identifierMapper.getStaffIdentifier(staffMember.getId());
        identifiers.add(identifier);
        
        // If it's the specified defaultUserId, update defaultIdentifier and role accordingly
        if ((defaultIdentifier == null) && staffMember.getId().equals(defaultUserId)) {
          defaultIdentifier = identifier;
          defaultUserPyramusRole = staffMember.getRole();
        }
      
        // List emails and add all emails that are not specified non unique (e.g. contact persons) to the emails list
        Email[] staffMemberEmails = pyramusClient.get().get("/staff/members/" + staffMember.getId() + "/emails", Email[].class);
        if (staffMemberEmails != null) {
          for (Email staffMemberEmail : staffMemberEmails) {
            if (staffMemberEmail.getContactTypeId() != null) {
              ContactType contactType = pyramusClient.get().get("/common/contactTypes/" + staffMemberEmail.getContactTypeId(), ContactType.class);
              if (!contactType.getNonUnique() && !emails.contains(staffMemberEmail.getAddress())) {
                emails.add(staffMemberEmail.getAddress());
              }
            } else {
              logger.log(Level.WARNING, "ContactType of email is null - email is ignored");
            }
          }
        }
      }
    }
    
    // Iterate over all discovered identifiers (students and staff members)
    for (String identifier : identifiers) {
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier);
      if (userSchoolDataIdentifier == null) {
        // If no user entity can be found by the identifier, add it the the discovered identities list
        discoveredIdentifiers.add(identifier);
      } else {
        // user entity found with given identity, so we need to make sure they all belong to same user
        UserEntity userEntity = userSchoolDataIdentifier.getUserEntity();
        if (userEntityId == null) {
          userEntityId = userEntity.getId();
        } else if (!userEntityId.equals(userEntity.getId())) {
          logger.warning(String.format("Person %d synchronization failed. Found two userEntitys bound to it (%d and %d)", person.getId(), userEntityId, userEntity.getId()));
          return;
        }
      }
    }
    
    UserEntity userEntity = userEntityId != null ? userEntityController.findUserEntityById(userEntityId) : null;
    
    if (userEntity != null) {
      // User already exists in the system so we check which of the idetifiers have been removed and which just updated
      List<UserSchoolDataIdentifier> existingSchoolDataIdentifiers = userSchoolDataIdentifierController.listUserSchoolDataIdentifiersByUserEntity(userEntity);
      for (UserSchoolDataIdentifier existingSchoolDataIdentifier : existingSchoolDataIdentifiers) {
        if (existingSchoolDataIdentifier.getDataSource().getIdentifier().equals(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE)) {
          if (!identifiers.contains(existingSchoolDataIdentifier.getIdentifier())) {
            if (!removedIdentifiers.contains(existingSchoolDataIdentifier.getIdentifier())) {
              removedIdentifiers.add(existingSchoolDataIdentifier.getIdentifier());
            }
          } else if (!discoveredIdentifiers.contains(existingSchoolDataIdentifier.getIdentifier())) {
            updatedIdentifiers.add(existingSchoolDataIdentifier.getIdentifier());
          }
        }
      }
    }
    
    // Resolve the user's desired environment role
    SchoolDataIdentifier environmentRoleIdentifier = null;
    if (defaultUserPyramusRole != null) {
      String roleIdentifier = identifierMapper.getEnvironmentRoleIdentifier(defaultUserPyramusRole);
      environmentRoleIdentifier = new SchoolDataIdentifier(roleIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    }
    
    // And finally fire the update event
    fireSchoolDataUserUpdated(userEntityId, defaultIdentifier, removedIdentifiers, updatedIdentifiers, discoveredIdentifiers, emails, environmentRoleIdentifier);
  }

  private void fireSchoolDataUserUpdated(Long userEntityId, SchoolDataIdentifier defaultIdentifier, List<SchoolDataIdentifier> removedIdentifiers, List<SchoolDataIdentifier> updatedIdentifiers,
      List<SchoolDataIdentifier> discoveredIdentifiers, List<String> emails, SchoolDataIdentifier enivormentRoleIdentifier) {

    if (discoveredIdentifiers == null) {
      discoveredIdentifiers = Collections.emptyList();
    }
    
    if (updatedIdentifiers == null) {
      updatedIdentifiers = Collections.emptyList();
    }
    
    if (removedIdentifiers == null) {
      removedIdentifiers = Collections.emptyList();
    }

    schoolDataUserUpdatedEvent.fire(new SchoolDataUserUpdatedEvent(userEntityId, 
        enivormentRoleIdentifier, 
        discoveredIdentifiers, 
        updatedIdentifiers, 
        removedIdentifiers, 
        defaultIdentifier, 
        emails));
    
  }
  
  private void fireSchoolDataUserUpdated(Long userEntityId, String defaultIdentifier, List<String> removedIdentifiers, List<String> updatedIdentifiers,
      List<String> discoveredIdentifiers, List<String> emails, SchoolDataIdentifier enivormentRoleIdentifier) {
    
    fireSchoolDataUserUpdated(userEntityId, 
        toIdentifier(defaultIdentifier), 
        toIdentifiers(removedIdentifiers),
        toIdentifiers(updatedIdentifiers),
        toIdentifiers(discoveredIdentifiers),
        emails,
        enivormentRoleIdentifier
    );
  }
  
  private SchoolDataIdentifier toIdentifier(String identifier) {
    return new SchoolDataIdentifier(identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }
  
  private List<SchoolDataIdentifier> toIdentifiers(List<String> identifiers) {
    List<SchoolDataIdentifier> result = new ArrayList<>();
    
    for (String identifier : identifiers) {
      result.add(toIdentifier(identifier));
    }
    
    return result;
  }

  public void updateStaffMember(Long staffMemberId) {
    StaffMember staffMember = pyramusClient.get().get(String.format("/staff/members/%d", staffMemberId), StaffMember.class);
    if (staffMember != null) {
      updatePerson(staffMember.getPersonId());
    } else {
      identifierRemoved(toIdentifier(identifierMapper.getStaffIdentifier(staffMemberId)));
    }
  }

  public void updateStudent(Long studentId) {
    Student student = pyramusClient.get().get(String.format("/students/students/%d", studentId), Student.class);
    if (student != null) {
      updatePerson(student.getPersonId());
    } else {
      identifierRemoved(toIdentifier(identifierMapper.getStudentIdentifier(studentId)));
    }
  }

  private void identifierRemoved(SchoolDataIdentifier identifier) {
    UserSchoolDataIdentifier schoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(identifier.getDataSource(), identifier.getIdentifier());
    if (schoolDataIdentifier != null) {
      UserEntity userEntity = schoolDataIdentifier.getUserEntity();
      
      List<UserSchoolDataIdentifier> existingIdentifiers = userSchoolDataIdentifierController.listUserSchoolDataIdentifiersByUserEntity(userEntity);
      
      SchoolDataIdentifier defaultIdentifier = null;
      List<SchoolDataIdentifier> removedIdentifiers = Arrays.asList(identifier);
      List<SchoolDataIdentifier> updatedIdentifiers = new ArrayList<>();
      List<SchoolDataIdentifier> discoveredIdentifiers = new ArrayList<>();
      
      for (UserSchoolDataIdentifier existingIdentifier : existingIdentifiers) {
        if (!(existingIdentifier.getDataSource().getIdentifier().equals(identifier.getDataSource()) && 
            existingIdentifier.getIdentifier().equals(identifier.getIdentifier()))) {
          updatedIdentifiers.add(new SchoolDataIdentifier(existingIdentifier.getIdentifier(), existingIdentifier.getDataSource().getIdentifier()));
        }
      }
      
      SchoolDataIdentifier enivormentRoleIdentifier = getUserEntityEnvironmentRoleIdentifier(userEntity);
      List<String> emails = userEmailEntityController.listAddressesByUserEntity(userEntity);
      
      fireSchoolDataUserUpdated(userEntity.getId(), 
          defaultIdentifier, 
          removedIdentifiers, 
          updatedIdentifiers, 
          discoveredIdentifiers, 
          emails, 
          enivormentRoleIdentifier);
    }
  }
  
  private SchoolDataIdentifier getUserEntityEnvironmentRoleIdentifier(UserEntity userEntity) {
    EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
    if (environmentUser != null) {
      List<RoleSchoolDataIdentifier> identifiers = environmentRoleEntityController.listRoleSchoolDataIdentifiersByEnvironmentRoleEntity(environmentUser.getRole());
      for (RoleSchoolDataIdentifier identifier : identifiers) {
        if (SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE.equals(identifier.getDataSource().getIdentifier())) {
          return new SchoolDataIdentifier(identifier.getIdentifier(), identifier.getDataSource().getIdentifier());
        }
      }
    }
    
    return null;
  }
  
  public int updatePersons(int offset, int maxCourses) {
    Person[] persons = pyramusClient.get().get(String.format("/persons/persons?filterArchived=false&firstResult=%d&maxResults=%d", offset, maxCourses), Person[].class);
    if ((persons == null) || (persons.length == 0)) {
      return -1;
    }
    
    for (Person person : persons) {
      updatePerson(person);
    }
    
    return 0;
  }

}
