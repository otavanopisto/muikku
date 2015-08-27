package fi.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Event;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.RoleSchoolDataIdentifier;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.users.UserGroupUserEntity;
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
import fi.muikku.schooldata.events.SchoolDataUserGroupDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupUpdatedEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupUserDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupUserRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupUserUpdatedEvent;
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
import fi.muikku.users.UserGroupEntityController;
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
  private Instance<PyramusClient> pyramusClient;

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
  private UserGroupEntityController userGroupEntityController;
  
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

  /**
   * Updates students from Pyramus.
   * 
   * @param offset first student to be updated
   * @param maxStudents maximum batch size
   * @return count of updated students or -1 when no students were found with given offset
   */
  public int updateStudents(int offset, int maxStudents) {
    Student[] students = pyramusClient.get().get("/students/students?filterArchived=false&firstResult=" + offset + "&maxResults=" + maxStudents, Student[].class);
    if (students.length == 0) {
      return -1;
    }

    for (Student student : students) {
      Person person = pyramusClient.get().get(String.format("/persons/persons/%d", student.getPersonId()), Person.class);
      if (person.getDefaultUserId() != null && person.getDefaultUserId().equals(student.getId())) {
        updateStudent(person, student, true);
      }
    }
    
    return students.length;
  }

  /**
   * Updates staff members from Pyramus
   * 
   * @param offset first staff member to be updated
   * @param maxStaffMembers maximum batch size
   * @return count of updates staff membres or -1 when no staff members were found with given offset
   */
  public int updateStaffMembers(int offset, int maxStaffMembers) {
    fi.pyramus.rest.model.StaffMember[] staffMembers = pyramusClient.get().get("/staff/members?firstResult=" + offset + "&maxResults=" + maxStaffMembers, fi.pyramus.rest.model.StaffMember[].class);
    if (staffMembers.length == 0) {
      return -1;
    }
    
    for (StaffMember staffMember : staffMembers) {
      Person person = pyramusClient.get().get(String.format("/persons/persons/%d", staffMember.getPersonId()), Person.class);
      if (person.getDefaultUserId() != null && person.getDefaultUserId().equals(staffMember.getId())) {
        updateStaffMember(person, staffMember, true);
      }
    }
    
    return staffMembers.length;
  }

  public int updateStudyProgrammes() {
    StudyProgramme[] studyProgrammes = pyramusClient.get().get("/students/studyProgrammes", StudyProgramme[].class);
    
    if (studyProgrammes.length == 0)
      return -1;
    
    for (StudyProgramme studyProgramme : studyProgrammes) {
      updateStudyProgramme(studyProgramme.getId());
    }
    
    return studyProgrammes.length;
  }

  public void updateStudyProgramme(Long pyramusId) {
    StudyProgramme studentGroup = pyramusClient.get().get(String.format("/students/studyProgrammes/%d", pyramusId), StudyProgramme.class);
    String identifier = identifierMapper.getStudyProgrammeIdentifier(pyramusId);
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier);
    
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
    if (students.length == 0) {
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
          fireUserGroupUserUpdated(studyProgrammeStudentIdentifier);
      } else {
        if (userGroupUserEntity != null)
          fireUserGroupUserRemoved(studyProgrammeStudentIdentifier, studyProgrammeIdentifier);
      }
    }
  }
  
  public int updateStudentGroups(int offset, int batchSize) {
    StudentGroup[] userGroups = pyramusClient.get().get("/students/studentGroups?firstResult=" + offset + "&maxResults=" + batchSize, StudentGroup[].class);
    
    if (userGroups.length == 0)
      return -1;
    
    for (StudentGroup userGroup : userGroups) {
      updateStudentGroup(userGroup.getId());
    }
    
    return userGroups.length;
  }
  
  public void updateStudentGroup(Long pyramusId) {
    StudentGroup studentGroup = pyramusClient.get().get(String.format("/students/studentGroups/%d", pyramusId), StudentGroup.class);
    String identifier = identifierMapper.getStudentGroupIdentifier(pyramusId);
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifier);
    
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
        fireUserGroupUserRemoved(identifier, userGroupIdentifier);
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
        fireUserGroupUserRemoved(identifier, userGroupIdentifier);
    } else {
      if (userGroupUserEntity == null) {
        String studentIdentifier = identifierMapper.getStudentIdentifier(studentGroupStudent.getStudentId());
        fireUserGroupUserDiscovered(identifier, userGroupIdentifier, studentIdentifier);
      } else {
        fireUserGroupUserUpdated(identifier);
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
        fireUserGroupUserRemoved(identifier, userGroupIdentifier);
    } else {
      if (userGroupUserEntity == null) {
        String staffMemberIdentifier = identifierMapper.getStaffIdentifier(studentGroupStaffMember.getStaffMemberId());
        fireUserGroupUserDiscovered(identifier, userGroupIdentifier, staffMemberIdentifier);
      } else {
        fireUserGroupUserUpdated(identifier);
      }
    }
  }

  /**
   * Updates staff member from Pyramus
   * 
   * @param pyramusId id of staff member in Pyramus
   * @return returns whether new staff member was created or not
   */
  public void updateStaffMember(Long pyramusId) {
    StaffMember staffMember = pyramusClient.get().get(String.format("/staff/members/%d", pyramusId), StaffMember.class);
    if (staffMember == null) {
      UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifierMapper.getStaffIdentifier(pyramusId));
      if (userEntity != null) {
        fireStaffMemberRemoved(pyramusId);
      }
    } else {
      String defaultIdentifier = null;

      Person person = pyramusClient.get().get(String.format("/persons/persons/%d", staffMember.getPersonId()), Person.class);
      if (person.getDefaultUserId() != null && person.getDefaultUserId().equals(staffMember.getId())) {
        updateStaffMember(person, staffMember, false);
        defaultIdentifier = identifierMapper.getStaffIdentifier(staffMember.getId());
      }
      
      if (defaultIdentifier == null) {
        UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifierMapper.getStaffIdentifier(pyramusId));
        if (userEntity != null) {
          defaultIdentifier = userEntity.getDefaultIdentifier();
        }
      }
      
      if (defaultIdentifier != null) {
        fireStaffMemberUpdated(staffMember, defaultIdentifier);
      }
    }
  }

  /**
   * Updates a student from Pyramus
   * 
   * @param pyramusId id if student in Pyramus
   * @return whether new student was created
   */
  public void updateStudent(Long pyramusId) {
    Student student = pyramusClient.get().get(String.format("/students/students/%d", pyramusId), Student.class);
    if (student == null) {
      UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifierMapper.getStudentIdentifier(pyramusId));
      if (userEntity != null) {
        fireStudentRemoved(pyramusId);
      }
    } else {
      String defaultIdentifier = null;
      
      Person person = pyramusClient.get().get(String.format("/persons/persons/%d", student.getPersonId()), Person.class);
      if (person.getDefaultUserId() != null && person.getDefaultUserId().equals(student.getId())) {
        updateStudent(person, student, false);
        defaultIdentifier = identifierMapper.getStudentIdentifier(student.getId());
      }
      
      if (defaultIdentifier == null) {
        UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, identifierMapper.getStudentIdentifier(pyramusId));
        if (userEntity != null) {
          defaultIdentifier = userEntity.getDefaultIdentifier();
        }
      }
      
      if (defaultIdentifier != null) {
        fireStudentUpdated(student, defaultIdentifier);
      }
    }
  }

  /**
   * Updates a person from Pyramus
   * 
   * @param pyramusId id if student in Pyramus
   * @return whether new student was created
   */
  public void updatePerson(Long personId) {
    Person person = pyramusClient.get().get(String.format("/persons/persons/%d", personId), Person.class);
    updatePerson(person);
  }
  
  private void updateStudent(Person person, Student student, boolean fireUpdate) {
    String userIdentifier = identifierMapper.getStudentIdentifier(student.getId());

    // Student found
    if (student.getArchived()) {
      // ...but is archived and we have an UserEntity, so we just fire removed event
      UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userIdentifier);
      if (userEntity != null) {
        fireStudentRemoved(student.getId());
      }
    } else {
      UserRole userPyramusRole = UserRole.STUDENT; 
      String roleIdentifier = identifierMapper.getEnvironmentRoleIdentifier(userPyramusRole);
      EnvironmentRoleEntity environmentRoleEntity = environmentRoleEntityController.findEnvironmentRoleEntity(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, roleIdentifier);
      if (environmentRoleEntity == null) {
        logger.warning(String.format("Could not find a EnvironmentRoleEntity for Pyramus role '%s'", userPyramusRole));
      } else {
        UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userIdentifier);
        if (userEntity != null) {
          // Existing user entity found
          EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
          if ((environmentUser == null)||(environmentUser.getRole() == null)) {
            // ... but no environment user / environment role, so we add new role for the user
            fireStudentRoleDiscovered(student.getId(), userPyramusRole);
          } else {
            // ... and an existing environment user
            if (!environmentUser.getRole().getId().equals(environmentRoleEntity.getId())) {
              // with an incorrect role
              RoleSchoolDataIdentifier removedRoleIdentifier = roleSchoolDataIdentifierController.findRoleSchoolDataIdentifierByDataSourceAndRoleEntity(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, environmentUser.getRole());
              
              if (environmentUser.getRole().getArchetype() == EnvironmentRoleArchetype.STUDENT) {
                fireStudentRoleRemoved(student.getId(), removedRoleIdentifier.getIdentifier());
              } else {
                Long staffMemberId = null;
                
                if (userEntity.getDefaultIdentifier() != null) {
                  staffMemberId = identifierMapper.getPyramusStaffId(userEntity.getDefaultIdentifier());
                }
                
                if (staffMemberId == null) {
                  // fall back to student id (staff member role has been assignment to student due a bug)
                  staffMemberId = student.getId();
                }
                
                fireStudentRoleRemoved(staffMemberId, removedRoleIdentifier.getIdentifier());
              }
              
              fireStudentRoleDiscovered(student.getId(), userPyramusRole);
            } 
          }
          
          if (fireUpdate) {
            if (!StringUtils.equals(identifierMapper.getStudentIdentifier(student.getId()), userEntity.getDefaultIdentifier())) {
              fireStudentUpdated(student, userIdentifier);
            }
          }
          
        } else {
          // New user
          fireStudentDiscovered(student);
          fireStudentRoleDiscovered(student.getId(), userPyramusRole);
        }
      }
    }
  }

  private void updateStaffMember(Person person, StaffMember staffMember, boolean fireUpdate) {
    UserRole userPyramusRole = staffMember.getRole();
    String userIdentifier = identifierMapper.getStaffIdentifier(staffMember.getId());
    
    String roleIdentifier = identifierMapper.getEnvironmentRoleIdentifier(userPyramusRole);
    EnvironmentRoleEntity environmentRoleEntity = environmentRoleEntityController.findEnvironmentRoleEntity(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, roleIdentifier);
    if (environmentRoleEntity == null) {
      logger.warning(String.format("Could not find a EnvironmentRoleEntity for Pyramus role '%s'", userPyramusRole));
    } else {
      UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userIdentifier);
      if (userEntity != null) {
        // Existing user entity found
        EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
        if ((environmentUser == null)||(environmentUser.getRole() == null)) {
          // ... but no environment user / environment role, so we add new role for the user
          fireStaffMemberRoleDiscovered(staffMember.getId(), userPyramusRole);
        } else {
          // ... and an existing environment user
          if (!environmentUser.getRole().getId().equals(environmentRoleEntity.getId())) {
            // with an incorrect role
            RoleSchoolDataIdentifier removedRoleIdentifier = roleSchoolDataIdentifierController.findRoleSchoolDataIdentifierByDataSourceAndRoleEntity(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, environmentUser.getRole());
            if (environmentUser.getRole().getArchetype() == EnvironmentRoleArchetype.STUDENT) {
              Long studentId = null;
              
              if (userEntity.getDefaultIdentifier() != null) {
                studentId = identifierMapper.getPyramusStudentId(userEntity.getDefaultIdentifier());
              }

              if (studentId == null) {
                // fall back to staff member id (staff member role has been assignment to student due a bug)
                studentId = staffMember.getId();
              }
              
              fireStudentRoleRemoved(studentId, removedRoleIdentifier.getIdentifier());
            } else {
              fireStaffMemberRoleRemoved(staffMember.getId(), removedRoleIdentifier.getIdentifier());
            }
            
            fireStaffMemberRoleDiscovered(staffMember.getId(), userPyramusRole);
          } 
        }
                
        if (fireUpdate) {
          if (!StringUtils.equals(identifierMapper.getStaffIdentifier(staffMember.getId()), userEntity.getDefaultIdentifier())) {
            fireStaffMemberUpdated(staffMember, userIdentifier);
          }
        }
      } else {
        // New user
        fireStaffMemberDiscovered(staffMember);
        fireStaffMemberRoleDiscovered(staffMember.getId(), userPyramusRole);
      }
    }
  }
  
  private void updatePerson(Person person) {
    Long defaultUserId = person.getDefaultUserId();
    if (defaultUserId != null) {
      // Try to find a student from Pyramus
      Student student = pyramusClient.get().get(String.format("/students/students/%d", defaultUserId), Student.class);
      if (student != null) {
        // ... and update it
        updateStudent(person, student, true);
      } else {
        // ... could not find a student, lets try a staff member
        StaffMember staffMember = pyramusClient.get().get(String.format("/staff/members/%d", defaultUserId), StaffMember.class);
        if (staffMember != null) {
          // and update it
          updateStaffMember(person, staffMember, true);
        } else {
          // couldn't find a staff member or student for default user
          logger.warning(String.format("Could not find student or staff member for defaultUserId: %d", defaultUserId));
        }          
      }
    } else {
      logger.warning(String.format("Person %d does not have a defaultUserId", person.getId()));
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
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndIdentifier(workspaceEntity, identifier);
      
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
    String workspaceIdentifier = identifierMapper.getWorkspaceIdentifier(courseId);
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByDataSourceAndIdentifier(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, workspaceIdentifier);
    
    CourseStaffMember[] staffMembers = pyramusClient.get().get("/courses/courses/" + courseId + "/staffMembers", CourseStaffMember[].class);
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
    
    CourseStaffMemberRole[] staffMemberRoles = pyramusClient.get().get("/courses/staffMemberRoles", CourseStaffMemberRole[].class);
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

      CourseStudent courseStudent = pyramusClient.get().get("/courses/courses/" + courseId + "/students/" + courseStudentId, CourseStudent.class);
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

    CourseStudent[] courseStudents = pyramusClient.get().get("/courses/courses/" + courseId + "/students?filterArchived=false", CourseStudent[].class);
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
    
    Email[] staffMemberEmails = pyramusClient.get().get("/staff/members/" + staffMember.getId() + "/emails", Email[].class);
    for (Email staffMemberEmail : staffMemberEmails) {
      if (staffMemberEmail.getContactTypeId() != null) {
        ContactType contactType = pyramusClient.get().get("/common/contactTypes/" + staffMemberEmail.getContactTypeId(), ContactType.class);
      
        if (!contactType.getNonUnique())
          emails.add(staffMemberEmail.getAddress());
      } else
        logger.log(Level.WARNING, "ContactType of email is null - email is ignored");
    }
    
    schoolDataUserDiscoveredEvent.fire(new SchoolDataUserDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, staffMemberIdentifier, emails));
  }
 
  private void fireStaffMemberUpdated(fi.pyramus.rest.model.StaffMember staffMember, String defaultIdentifier) {
    String staffMemberIdentifier = identifierMapper.getStaffIdentifier(staffMember.getId());
    List<String> emails = new ArrayList<>();
    
    Email[] staffMemberEmails = pyramusClient.get().get("/staff/members/" + staffMember.getId() + "/emails", Email[].class);
    for (Email staffMemberEmail : staffMemberEmails) {
      if (staffMemberEmail.getContactTypeId() != null) {
        ContactType contactType = pyramusClient.get().get("/common/contactTypes/" + staffMemberEmail.getContactTypeId(), ContactType.class);
      
        if (!contactType.getNonUnique())
          emails.add(staffMemberEmail.getAddress());
      } else
        logger.log(Level.WARNING, "ContactType of email is null - email is ignored");
    }
    
    schoolDataUserUpdatedEvent.fire(new SchoolDataUserUpdatedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
        staffMemberIdentifier, 
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
        defaultIdentifier,
        emails));
  }
 
  private void fireStaffMemberRemoved(Long staffMemberId) {
    String staffMemberIdentifier = identifierMapper.getStaffIdentifier(staffMemberId);
    String searchId = staffMemberIdentifier + '/' + SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
    schoolDataUserRemovedEvent.fire(new SchoolDataUserRemovedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, staffMemberIdentifier, searchId));
  }

  private void fireStudentDiscovered(Student student) {
    String studentIdentifier = identifierMapper.getStudentIdentifier(student.getId());
 
    List<String> emails = new ArrayList<>();

    Email[] studentEmails = pyramusClient.get().get("/students/students/" + student.getId() + "/emails", Email[].class);
    for (Email studentEmail : studentEmails) {
      if (studentEmail.getContactTypeId() != null) {
        ContactType contactType = pyramusClient.get().get("/common/contactTypes/" + studentEmail.getContactTypeId(), ContactType.class);
      
        if (!contactType.getNonUnique())
          emails.add(studentEmail.getAddress());
      } else
        logger.log(Level.WARNING, "ContactType of email is null - email is ignored");
    }
    
    schoolDataUserDiscoveredEvent.fire(new SchoolDataUserDiscoveredEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, studentIdentifier, emails));
  }

  private void fireStudentUpdated(Student student, String defaultIdentifier) {
    String studentIdentifier = identifierMapper.getStudentIdentifier(student.getId());
 
    List<String> emails = new ArrayList<>();
    
    Email[] studentEmails = pyramusClient.get().get("/students/students/" + student.getId() + "/emails", Email[].class);
    for (Email studentEmail : studentEmails) {
      if (studentEmail.getContactTypeId() != null) {
        ContactType contactType = pyramusClient.get().get("/common/contactTypes/" + studentEmail.getContactTypeId(), ContactType.class);
      
        if (!contactType.getNonUnique())
          emails.add(studentEmail.getAddress());
      } else {
        logger.log(Level.WARNING, "ContactType of email is null - email is ignored");
      }
    }
    
    schoolDataUserUpdatedEvent.fire(new SchoolDataUserUpdatedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
        studentIdentifier,
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, 
        defaultIdentifier,
        emails));
  }
  
  private void fireStudentRemoved(Long studentId) {
    String studentIdentifier = identifierMapper.getStudentIdentifier(studentId);
    String searchId = studentIdentifier + '/' + SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
    schoolDataUserRemovedEvent.fire(new SchoolDataUserRemovedEvent(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, studentIdentifier, searchId));
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

  private void fireUserGroupUserUpdated(String userGroupUserIdentifier) {
    schoolDataUserGroupUserUpdatedEvent.fire(new SchoolDataUserGroupUserUpdatedEvent(
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userGroupUserIdentifier));
  }
  
  private void fireUserGroupUserRemoved(String userGroupUserIdentifier, String userGroupIdentifier) {
    schoolDataUserGroupUserRemovedEvent.fire(new SchoolDataUserGroupUserRemovedEvent(
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userGroupUserIdentifier,
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userGroupIdentifier));
  }

}
