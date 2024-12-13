package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import java.time.OffsetDateTime;
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

import fi.otavanopisto.muikku.model.users.RoleSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserGroupUserEntity;
import fi.otavanopisto.muikku.model.users.UserRoleType;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusUserEmail;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.EnvironmentRole;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataEnvironmentRoleDiscoveredEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataEnvironmentRoleRemovedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataOrganizationDiscoveredEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataOrganizationRemovedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataOrganizationUpdatedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserEventIdentifier;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserGroupDiscoveredEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserGroupRemovedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserGroupUpdatedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserGroupUserDiscoveredEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserGroupUserRemovedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserGroupUserUpdatedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserUpdatedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceDiscoveredEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceRemovedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUpdatedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUserDiscoveredEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUserRemovedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUserUpdatedEvent;
import fi.otavanopisto.muikku.users.EnvironmentRoleEntityController;
import fi.otavanopisto.muikku.users.RoleSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.pyramus.rest.model.ContactType;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.CourseStudent;
import fi.otavanopisto.pyramus.rest.model.Email;
import fi.otavanopisto.pyramus.rest.model.Person;
import fi.otavanopisto.pyramus.rest.model.StaffMember;
import fi.otavanopisto.pyramus.rest.model.Student;
import fi.otavanopisto.pyramus.rest.model.StudentGroup;
import fi.otavanopisto.pyramus.rest.model.StudentGroupStudent;
import fi.otavanopisto.pyramus.rest.model.StudentGroupUser;
import fi.otavanopisto.pyramus.rest.model.StudentParent;
import fi.otavanopisto.pyramus.rest.model.StudyProgramme;
import fi.otavanopisto.pyramus.rest.model.UserRole;

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
  private UserGroupEntityController userGroupEntityController;

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

  @Inject
  private Event<SchoolDataOrganizationDiscoveredEvent> schoolDataOrganizationDiscoveredEvent;

  @Inject
  private Event<SchoolDataOrganizationUpdatedEvent> schoolDataOrganizationUpdatedEvent;

  @Inject
  private Event<SchoolDataOrganizationRemovedEvent> schoolDataOrganizationRemovedEvent;

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
    String identifier = identifierMapper.getStudyProgrammeIdentifier(pyramusId).getIdentifier();
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier, true);
    
    if (studentGroup == null) {
      if (userGroupEntity != null)
        fireUserGroupRemoved(identifier);
    }
    else {
      String organizationIdentifier = identifierMapper.getOrganizationIdentifier(studentGroup.getOrganizationId()).getIdentifier();
      if (userGroupEntity == null) {
        fireUserGroupDiscovered(identifier, organizationIdentifier);
      } else {
        fireUserGroupUpdated(identifier, organizationIdentifier);
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
      String studyProgrammeIdentifier = identifierMapper.getStudyProgrammeIdentifier(student.getStudyProgrammeId()).getIdentifier();
      String studyProgrammeStudentIdentifier = identifierMapper.getStudyProgrammeStudentIdentifier(student.getId());

      UserGroupUserEntity userGroupUserEntity = userGroupEntityController.findUserGroupUserEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, studyProgrammeStudentIdentifier);
      
      boolean isActive = !student.getArchived() && (student.getStudyEndDate() == null || student.getStudyEndDate().isAfter(OffsetDateTime.now()));
      
      if (isActive) {
        if (userGroupUserEntity == null) {
          String userEntityIdentifier = identifierMapper.getStudentIdentifier(student.getId()).getIdentifier();
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
    }
    else {
      String organizationIdentifier = identifierMapper.getOrganizationIdentifier(studentGroup.getOrganizationId()).getIdentifier();
      if (userGroupEntity == null) {
        fireUserGroupDiscovered(identifier, organizationIdentifier);
      } else {
        fireUserGroupUpdated(identifier, organizationIdentifier);
      }
    }
  }

  public int updateStudentGroupUsers(Long studentGroupId) {
    String userGroupIdentifier = identifierMapper.getStudentGroupIdentifier(studentGroupId);
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userGroupIdentifier, true);    
    if (userGroupEntity != null) {
      if (userGroupEntity.getArchived()) {
        // Just skip archived user groups
        return 0;
      }
        
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
            String staffMemberIdentifier = identifierMapper.getStaffIdentifier(sgStaffMember.getStaffMemberId()).getIdentifier();
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
            String studentIdentifier = identifierMapper.getStudentIdentifier(sgs.getStudentId()).getIdentifier();
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
      String studentIdentifier = identifierMapper.getStudentIdentifier(studentGroupStudent.getStudentId()).getIdentifier();
      if (userGroupUserEntity == null) {
        fireUserGroupUserDiscovered(identifier, userGroupIdentifier, studentIdentifier);
      } else {
        fireUserGroupUserUpdated(identifier, userGroupIdentifier, studentIdentifier);
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
        String staffMemberIdentifier = identifierMapper.getStaffIdentifier(studentGroupStaffMember.getStaffMemberId()).getIdentifier();
        fireUserGroupUserDiscovered(identifier, userGroupIdentifier, staffMemberIdentifier);
      } else {
        fireUserGroupUserUpdated(identifier, userGroupIdentifier, userGroupUserEntity.getUserSchoolDataIdentifier().getIdentifier());
      }
    }
  }

  public void createOrganization(Long id, String name) {
    SchoolDataIdentifier identifier = identifierMapper.getOrganizationIdentifier(id);
    if (identifier != null) {
      schoolDataOrganizationDiscoveredEvent.fire(new SchoolDataOrganizationDiscoveredEvent(identifier.getDataSource(), identifier.getIdentifier(), name));
    }
  }

  public void updateOrganization(Long id, String name) {
    SchoolDataIdentifier identifier = identifierMapper.getOrganizationIdentifier(id);
    if (identifier != null) {
      schoolDataOrganizationUpdatedEvent.fire(new SchoolDataOrganizationUpdatedEvent(identifier.getDataSource(), identifier.getIdentifier(), name));
    }
  }

  public void archiveOrganization(Long id) {
    SchoolDataIdentifier identifier = identifierMapper.getOrganizationIdentifier(id);
    if (identifier != null) {
      schoolDataOrganizationRemovedEvent.fire(new SchoolDataOrganizationRemovedEvent(identifier.getDataSource(), identifier.getIdentifier()));
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
    
    // List of staff members according to Muikku
    
    List<WorkspaceUserEntity> currentStaffMembers;
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseId);
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier);
    if (workspaceEntity != null) {
      currentStaffMembers = workspaceUserEntityController.listActiveWorkspaceStaffMembers(workspaceEntity);
    }
    else {
      currentStaffMembers = Collections.emptyList();
    }
    
    // List of staff members according to Pyramus
    
    CourseStaffMember[] staffMembers = pyramusClient.get().get("/courses/courses/" + courseId + "/staffMembers", CourseStaffMember[].class);
    if (staffMembers != null) {
      for (CourseStaffMember staffMember : staffMembers) {
        String staffIdentifier = identifierMapper.getWorkspaceStaffIdentifier(staffMember.getId());
        SchoolDataIdentifier workspaceUserIdentifier = new SchoolDataIdentifier(staffIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
        WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifier(workspaceUserIdentifier);
        if (workspaceUserEntity == null) {
          fireCourseStaffMemberDiscovered(staffMember);
        }
        else {
          for (int i = currentStaffMembers.size() - 1; i >= 0; i--) {
            if (currentStaffMembers.get(i).getId().equals(workspaceUserEntity.getId())) {
              currentStaffMembers.remove(i);
            }
          }
        }
      }
    }
    
    // At this point current staff members only contain those that Pyramus no longer acknowledges.
    // We have somehow missed their original removal event but fake them here to get staff in sync.
    
    for (WorkspaceUserEntity currentStaffMember : currentStaffMembers) {
      try {
        String courseStaffMemberIdentifier = currentStaffMember.getIdentifier();
        String staffMemberIdentifier = currentStaffMember.getUserSchoolDataIdentifier().getUserEntity().getDefaultIdentifier();
        Long courseStaffMemberId = identifierMapper.getPyramusCourseStaffId(courseStaffMemberIdentifier); 
        Long staffMemberId = identifierMapper.getPyramusStaffId(staffMemberIdentifier);
        fireCourseStaffMemberRemoved(courseStaffMemberId, staffMemberId, courseId);
      }
      catch (Exception e) {
        logger.log(Level.WARNING, String.format("Error re-syncing WorkspaceUserEntity %d",  currentStaffMember.getId()), e);
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
    
    for (fi.otavanopisto.pyramus.rest.model.UserRole userRole : fi.otavanopisto.pyramus.rest.model.UserRole.values()) {
      String roleIdentifier = identifierMapper.getEnvironmentRoleIdentifier(userRole);
      removedIdentifiers.remove(roleIdentifier);
      
      if (environmentRoleEntityController.findEnvironmentRoleEntity(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, roleIdentifier) == null) {
        EnvironmentRole environmentRole = entityFactory.createEntity(userRole);
        schoolDataEnvironmentRoleDiscoveredEvent.fire(new SchoolDataEnvironmentRoleDiscoveredEvent(environmentRole.getSchoolDataSource(), environmentRole.getIdentifier(), environmentRole.getArchetype(), environmentRole.getName())); 
        count++;
      }
    }
    
    Set<String> removedIdentifierIds = removedIdentifiers.keySet();
    
    for (String removedIdentifierId : removedIdentifierIds) {
      RoleSchoolDataIdentifier removedIdentifier = removedIdentifiers.get(removedIdentifierId);
      if (removedIdentifier.getRoleEntity().getType() == UserRoleType.ENVIRONMENT) {
        schoolDataEnvironmentRoleRemovedEvent.fire(new SchoolDataEnvironmentRoleRemovedEvent(removedIdentifier.getDataSource().getIdentifier(), removedIdentifier.getIdentifier()));
      } else if (removedIdentifier.getRoleEntity().getType() == UserRoleType.WORKSPACE) {
//        schoolDataWorkspaceRoleRemovedEvent.fire(new SchoolDataWorkspaceRoleRemovedEvent(removedIdentifier.getDataSource().getIdentifier(), removedIdentifier.getIdentifier()));
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
        if (workspaceUserEntity == null) {
          fireCourseStudentDiscovered(courseStudent, studentActive);
          return true;
        }
        else {
          fireCourseStudentUpdated(courseStudent, studentActive);
        }
      }
      else {
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
    
    OffsetDateTime studyStartDate = student.getStudyStartDate();
    OffsetDateTime studyEndDate = student.getStudyEndDate();
    
    if (studyStartDate == null && studyEndDate == null) {
      // It's a never ending study programme
      return true;
    }
    
    boolean startedStudies = studyStartDate != null && studyStartDate.isBefore(OffsetDateTime.now());
    boolean finishedStudies = studyEndDate != null && studyEndDate.isBefore(OffsetDateTime.now());
    
    return startedStudies && !finishedStudies;
  }

  private void fireWorkspaceDiscovered(Course course) {
    String identifier = identifierMapper.getWorkspaceIdentifier(course.getId());
    Map<String, Object> extra = new HashMap<>();
    extra.put("pyramusVariables", course.getVariables());
    extra.put("organizationId", course.getOrganizationId());
    schoolDataWorkspaceDiscoveredEvent.fire(new SchoolDataWorkspaceDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier, course.getName(), extra));
  }

  private void fireWorkspaceUpdated(Course course) {
    String identifier = identifierMapper.getWorkspaceIdentifier(course.getId());
    Map<String, Object> extra = new HashMap<>();
    extra.put("pyramusVariables", course.getVariables());
    extra.put("organizationId", course.getOrganizationId());
    schoolDataWorkspaceUpdatedEvent.fire(new SchoolDataWorkspaceUpdatedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier, course.getName(), extra));
  }

  private void fireWorkspaceRemoved(Long courseId) {
    String identifier = identifierMapper.getWorkspaceIdentifier(courseId);
    String searchId = identifier + '/' + SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
    schoolDataWorkspaceRemovedEvent.fire(new SchoolDataWorkspaceRemovedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier, searchId));
  }
  
  private void fireCourseStaffMemberDiscovered(CourseStaffMember courseStaffMember) {
    String identifier = identifierMapper.getWorkspaceStaffIdentifier(courseStaffMember.getId());
    String userIdentifier = identifierMapper.getStaffIdentifier(courseStaffMember.getStaffMemberId()).getIdentifier();
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseStaffMember.getCourseId());
    WorkspaceRoleArchetype role = identifierMapper.getWorkspaceRoleArchetype(courseStaffMember.getRole());
    
    schoolDataWorkspaceUserDiscoveredEvent.fire(new SchoolDataWorkspaceUserDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        userIdentifier, role, true));
  }
  
  private void fireCourseStaffMemberUpdated(CourseStaffMember courseStaffMember) {
    String identifier = identifierMapper.getWorkspaceStaffIdentifier(courseStaffMember.getId());
    String userIdentifier = identifierMapper.getStaffIdentifier(courseStaffMember.getStaffMemberId()).getIdentifier();
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseStaffMember.getCourseId());
    WorkspaceRoleArchetype role = identifierMapper.getWorkspaceRoleArchetype(courseStaffMember.getRole());

    schoolDataWorkspaceUserUpdatedEvent.fire(new SchoolDataWorkspaceUserUpdatedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        userIdentifier, role, true));
  }

  private void fireCourseStaffMemberRemoved(Long courseStaffMemberId, Long staffMemberId, Long courseId) {
    String identifier = identifierMapper.getWorkspaceStaffIdentifier(courseStaffMemberId);
    String userIdentifier = identifierMapper.getStaffIdentifier(staffMemberId).getIdentifier();
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseId);

    schoolDataWorkspaceUserRemovedEvent.fire(new SchoolDataWorkspaceUserRemovedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        userIdentifier));
  }

  private void fireCourseStudentDiscovered(CourseStudent courseStudent, boolean isActive) {
    String identifier = identifierMapper.getWorkspaceStudentIdentifier(courseStudent.getId());
    String userIdentifier = identifierMapper.getStudentIdentifier(courseStudent.getStudentId()).getIdentifier();
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseStudent.getCourseId());
    WorkspaceRoleArchetype role = WorkspaceRoleArchetype.STUDENT;
    
    schoolDataWorkspaceUserDiscoveredEvent.fire(new SchoolDataWorkspaceUserDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        userIdentifier, role, isActive));
  }

  private void fireCourseStudentUpdated(CourseStudent courseStudent, boolean isActive) {
    String identifier = identifierMapper.getWorkspaceStudentIdentifier(courseStudent.getId());
    String userIdentifier = identifierMapper.getStudentIdentifier(courseStudent.getStudentId()).getIdentifier();
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseStudent.getCourseId());
    WorkspaceRoleArchetype role = WorkspaceRoleArchetype.STUDENT;
    
    schoolDataWorkspaceUserUpdatedEvent.fire(new SchoolDataWorkspaceUserUpdatedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        userIdentifier, role, isActive));
  }

  private void fireCourseStudentRemoved(Long courseStudentId, Long studentId, Long courseId) {
    String identifier = identifierMapper.getWorkspaceStudentIdentifier(courseStudentId);
    String userIdentifier = identifierMapper.getStudentIdentifier(studentId).getIdentifier();
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseId);

    schoolDataWorkspaceUserRemovedEvent.fire(new SchoolDataWorkspaceUserRemovedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE,
        userIdentifier));
  }

  private void fireUserGroupDiscovered(String identifier, String organizationIdentifier) {
    Map<String, Object> extra = new HashMap<>();
    extra.put("organizationIdentifier", organizationIdentifier);
    schoolDataUserGroupDiscoveredEvent.fire(new SchoolDataUserGroupDiscoveredEvent(
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier, extra));
  }

  private void fireUserGroupUpdated(String identifier, String organizationIdentifier) {
    Map<String, Object> extra = new HashMap<>();
    extra.put("organizationIdentifier", organizationIdentifier);
    schoolDataUserGroupUpdatedEvent.fire(new SchoolDataUserGroupUpdatedEvent(
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier, extra));
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
    
    final SchoolDataIdentifier studentRoleIdentifier = new SchoolDataIdentifier(identifierMapper.getEnvironmentRoleIdentifier(UserRole.STUDENT), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    final SchoolDataIdentifier studentParentRoleIdentifier = new SchoolDataIdentifier(identifierMapper.getEnvironmentRoleIdentifier(UserRole.STUDENT_PARENT), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    
    String defaultIdentifier = null;
    Long defaultUserId = person.getDefaultUserId();
    List<String> identifiers = new ArrayList<>();
    List<String> removedIdentifiers = new ArrayList<>();
    List<String> updatedIdentifiers = new ArrayList<>();
    List<String> discoveredIdentifiers = new ArrayList<>();
    Map<SchoolDataIdentifier, List<UserEmail>> emails = new HashMap<>();
    Map<SchoolDataIdentifier, List<SchoolDataIdentifier>> roles = new HashMap<>();
    Map<SchoolDataIdentifier, SchoolDataIdentifier> organizations = new HashMap<>();
    
    // List all person's students and staffMembers
    Student[] students = pyramusClient.get().get(String.format("/persons/persons/%d/students", person.getId()), Student[].class);
    StaffMember[] staffMembers = pyramusClient.get().get(String.format("/persons/persons/%d/staffMembers", person.getId()), StaffMember[].class);
    StudentParent[] studentParents = pyramusClient.get().get(String.format("/persons/persons/%d/studentParents", person.getId()), StudentParent[].class);
    
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
        String identifier = identifierMapper.getStudentIdentifier(student.getId()).getIdentifier();
        SchoolDataIdentifier schoolDataIdentifier = toIdentifier(identifier);
        List<UserEmail> identifierEmails = new ArrayList<UserEmail>();

        if (!student.getArchived()) {
          // If student is not archived, add it to identifiers list 
          identifiers.add(identifier);

          roles.put(schoolDataIdentifier, Arrays.asList(studentRoleIdentifier));

          if (student.getStudyProgrammeId() != null) {
            StudyProgramme studyProgramme = pyramusClient.get().get("/students/studyProgrammes/" + student.getStudyProgrammeId(), StudyProgramme.class);
            if (studyProgramme != null && studyProgramme.getOrganizationId() != null) {
              Long organizationId = studyProgramme.getOrganizationId();
              SchoolDataIdentifier organizationIdentifier = identifierMapper.getOrganizationIdentifier(organizationId);
              organizations.put(schoolDataIdentifier, organizationIdentifier);
            }
          }
          
          // If it's the specified defaultUserId, update defaultIdentifier
          if ((defaultIdentifier == null) && student.getId().equals(defaultUserId)) {
            defaultIdentifier = identifier;
          }
          
          // List emails and add all emails that are not specified non unique (e.g. contact persons) to the emails list
          Email[] studentEmails = pyramusClient.get().get("/students/students/" + student.getId() + "/emails", Email[].class);
          identifierEmails = pyramusEmailsToMuikkuEmails(studentEmails, schoolDataIdentifier);
        } else {
          // If the student instance if archived, we add it the the removed identifiers list
          removedIdentifiers.add(identifier);
        }
        
        emails.put(schoolDataIdentifier, identifierEmails);
      }
    }
    
    if (staffMembers != null) {
      for (StaffMember staffMember : staffMembers) {
        // Add staffMember identifier into the identifier list
        String identifier = identifierMapper.getStaffIdentifier(staffMember.getId()).getIdentifier();
        SchoolDataIdentifier schoolDataIdentifier = toIdentifier(identifier);

        identifiers.add(identifier);

        List<SchoolDataIdentifier> roleIdentifiers = new ArrayList<>();
        for (UserRole role : staffMember.getRoles()) {
          roleIdentifiers.add(new SchoolDataIdentifier(identifierMapper.getEnvironmentRoleIdentifier(role), 
              SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE));
        }
        roles.put(schoolDataIdentifier, roleIdentifiers);

        SchoolDataIdentifier organizationIdentifier = staffMember.getOrganizationId() != null ? identifierMapper.getOrganizationIdentifier(staffMember.getOrganizationId()) : null;
        organizations.put(schoolDataIdentifier, organizationIdentifier);
        
        // If it's the specified defaultUserId, update defaultIdentifier and role accordingly
        if ((defaultIdentifier == null) && staffMember.getId().equals(defaultUserId)) {
          defaultIdentifier = identifier;
        }
      
        // List emails and add all emails that are not specified non unique (e.g. contact persons) to the emails list
        Email[] staffMemberEmails = pyramusClient.get().get("/staff/members/" + staffMember.getId() + "/emails", Email[].class);
        emails.put(schoolDataIdentifier, pyramusEmailsToMuikkuEmails(staffMemberEmails, schoolDataIdentifier));
      }
    }
    
    if (studentParents != null) {
      for (StudentParent studentParent : studentParents) {
        // Add staffMember identifier into the identifier list
        SchoolDataIdentifier schoolDataIdentifier = identifierMapper.getStudentParentIdentifier(studentParent.getId());
        String identifier = schoolDataIdentifier.getIdentifier();

        identifiers.add(identifier);

        roles.put(schoolDataIdentifier, Arrays.asList(studentParentRoleIdentifier));

        SchoolDataIdentifier organizationIdentifier = studentParent.getOrganizationId() != null ? identifierMapper.getOrganizationIdentifier(studentParent.getOrganizationId()) : null;
        organizations.put(schoolDataIdentifier, organizationIdentifier);
        
        // If it's the specified defaultUserId, update defaultIdentifier and role accordingly
        if ((defaultIdentifier == null) && studentParent.getId().equals(defaultUserId)) {
          defaultIdentifier = identifier;
        }
      
        // List emails and add all emails that are not specified non unique (e.g. contact persons) to the emails list
        Email[] studentParentEmails = pyramusClient.get().get("/studentparents/studentparents/" + studentParent.getId() + "/emails", Email[].class);
        emails.put(schoolDataIdentifier, pyramusEmailsToMuikkuEmails(studentParentEmails, schoolDataIdentifier));
      }
    }
    
    // Iterate over all discovered identifiers (students and staff members)
    for (String identifier : identifiers) {
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifierIncludeArchived(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier);
      if (userSchoolDataIdentifier == null || userSchoolDataIdentifier.getArchived()) {
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
      // User already exists in the system so we check which of the identifiers have been removed and which just updated
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
        
    // And finally fire the update event
    fireSchoolDataUserUpdated(userEntityId, defaultIdentifier, removedIdentifiers, updatedIdentifiers, discoveredIdentifiers, emails, roles, organizations);
  }

  private List<UserEmail> pyramusEmailsToMuikkuEmails(Email[] pyramusEmails, SchoolDataIdentifier userIdentifier) {
    List<UserEmail> identifierEmails = new ArrayList<UserEmail>();

    if (pyramusEmails != null) {
      for (Email pyramusEmail : pyramusEmails) {
        ContactType contactType = pyramusEmail.getContactTypeId() != null ? pyramusClient.get().get("/common/contactTypes/" + pyramusEmail.getContactTypeId(), ContactType.class) : null;
        if (contactType != null) {
          boolean userEmailAlreadyInList = identifierEmails.stream().anyMatch(m -> m.getAddress().equals(pyramusEmail.getAddress()));
          if (!contactType.getNonUnique() && !userEmailAlreadyInList) {
            identifierEmails.add(new PyramusUserEmail(
                toIdentifier(identifierMapper.getEmailIdentifier(pyramusEmail.getId())),
                userIdentifier,
                pyramusEmail.getAddress(),
                null, // contact type; irrelevant for updater
                pyramusEmail.getDefaultAddress()));
          }
        } else {
          logger.log(Level.WARNING, String.format("ContactType of email was not found by id (%d) - email is ignored", pyramusEmail.getContactTypeId()));
        }
      }
    }
    
    return identifierEmails;
  }
  
  private void fireSchoolDataUserUpdated(Long userEntityId, SchoolDataIdentifier defaultIdentifier, List<SchoolDataIdentifier> removedIdentifiers, List<SchoolDataIdentifier> updatedIdentifiers,
      List<SchoolDataIdentifier> discoveredIdentifiers, Map<SchoolDataIdentifier, List<UserEmail>> emails, Map<SchoolDataIdentifier, List<SchoolDataIdentifier>> roles, Map<SchoolDataIdentifier, SchoolDataIdentifier> organizations) {

    SchoolDataUserUpdatedEvent event = new SchoolDataUserUpdatedEvent(userEntityId, defaultIdentifier);
    
    if (discoveredIdentifiers != null) {
      for (SchoolDataIdentifier identifier : discoveredIdentifiers) {
        List<SchoolDataIdentifier> roleIdentifiers = roles.get(identifier);
        SchoolDataIdentifier organizationIdentifier = organizations.get(identifier);
        
        SchoolDataUserEventIdentifier eventIdentifier = event.addDiscoveredIdentifier(identifier, roleIdentifiers, organizationIdentifier);
        if (emails.containsKey(identifier)) {
          List<UserEmail> identifierEmails = emails.get(identifier);
          identifierEmails.forEach(email -> eventIdentifier.addEmail(email));
        }
      }
    }
    
    if (updatedIdentifiers != null) {
      for (SchoolDataIdentifier identifier : updatedIdentifiers) {
        List<SchoolDataIdentifier> roleIdentifiers = roles.get(identifier);
        SchoolDataIdentifier organizationIdentifier = organizations.get(identifier);

        SchoolDataUserEventIdentifier eventIdentifier = event.addUpdatedIdentifier(identifier, roleIdentifiers, organizationIdentifier);
        if (emails.containsKey(identifier)) {
          List<UserEmail> identifierEmails = emails.get(identifier);
          identifierEmails.forEach(email -> eventIdentifier.addEmail(email));
        }
      }
    }
    
    if (removedIdentifiers != null) {
      for (SchoolDataIdentifier identifier : removedIdentifiers) {
        List<SchoolDataIdentifier> roleIdentifiers = roles.get(identifier);
        SchoolDataIdentifier organizationIdentifier = organizations.get(identifier);

        SchoolDataUserEventIdentifier eventIdentifier = event.addRemovedIdentifier(identifier, roleIdentifiers, organizationIdentifier);
        if (emails.containsKey(identifier)) {
          List<UserEmail> identifierEmails = emails.get(identifier);
          identifierEmails.forEach(email -> eventIdentifier.addEmail(email));
        }
      }
    }

    schoolDataUserUpdatedEvent.fire(event);
  }
  
  private void fireSchoolDataUserUpdated(Long userEntityId, String defaultIdentifier, List<String> removedIdentifiers, List<String> updatedIdentifiers,
      List<String> discoveredIdentifiers, Map<SchoolDataIdentifier, List<UserEmail>> emails, Map<SchoolDataIdentifier, List<SchoolDataIdentifier>> roles, 
      Map<SchoolDataIdentifier, SchoolDataIdentifier> organizations) {
    
    fireSchoolDataUserUpdated(userEntityId, 
        toIdentifier(defaultIdentifier), 
        toIdentifiers(removedIdentifiers),
        toIdentifiers(updatedIdentifiers),
        toIdentifiers(discoveredIdentifiers),
        emails,
        roles,
        organizations
    );
  }
  
  private SchoolDataIdentifier toIdentifier(String identifier) {
    return new SchoolDataIdentifier(identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }
  
  private List<SchoolDataIdentifier> toIdentifiers(List<String> identifiers) {
    List<SchoolDataIdentifier> result = new ArrayList<>();
    
    if (identifiers != null && !identifiers.isEmpty()) {
      for (String identifier : identifiers) {
        result.add(toIdentifier(identifier));
      }
    }
    
    return result;
  }

  public void updateStaffMember(Long staffMemberId) {
    StaffMember staffMember = pyramusClient.get().get(String.format("/staff/members/%d", staffMemberId), StaffMember.class);
    if (staffMember != null) {
      updatePerson(staffMember.getPersonId());
    } else {
      identifierRemoved(identifierMapper.getStaffIdentifier(staffMemberId));
    }
  }

  public void updateStudentParent(Long studentParentId) {
    StudentParent studentParent = pyramusClient.get().get(String.format("/studentparents/studentparents/%d", studentParentId), StudentParent.class);
    if (studentParent != null) {
      updatePerson(studentParent.getPersonId());
    } else {
      identifierRemoved(identifierMapper.getStudentParentIdentifier(studentParentId));
    }
  }

  public void updateStudent(Long studentId) {
    Student student = pyramusClient.get().get(String.format("/students/students/%d", studentId), Student.class);
    if (student != null) {
      updatePerson(student.getPersonId());
      updateStudyProgrammeMember(student);
    } else {
      identifierRemoved(identifierMapper.getStudentIdentifier(studentId));
    }
  }

  private void identifierRemoved(SchoolDataIdentifier identifier) {
    UserSchoolDataIdentifier schoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(identifier.getDataSource(), identifier.getIdentifier());
    if (schoolDataIdentifier != null) {
      UserEntity userEntity = schoolDataIdentifier.getUserEntity();
      
      SchoolDataIdentifier defaultIdentifier = null;
      SchoolDataUserUpdatedEvent event = new SchoolDataUserUpdatedEvent(userEntity.getId(), defaultIdentifier);
      
      event.addRemovedIdentifier(identifier, null, null);

      schoolDataUserUpdatedEvent.fire(event);
    }
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
