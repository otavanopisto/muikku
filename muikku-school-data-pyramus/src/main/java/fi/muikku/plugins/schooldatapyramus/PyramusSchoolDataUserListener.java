package fi.muikku.plugins.schooldatapyramus;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Event;
import javax.enterprise.event.Observes;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.users.UserGroupUserEntity;
import fi.muikku.plugins.schooldatapyramus.PyramusIdentifierMapper.StudentGroupType;
import fi.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.muikku.schooldata.SchoolDataIdentifier;
import fi.muikku.schooldata.events.SchoolDataUserGroupUserDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupUserRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupUserUpdatedEvent;
import fi.muikku.schooldata.events.SchoolDataUserUpdatedEvent;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserGroupEntityController;
import fi.pyramus.rest.model.Student;

@ApplicationScoped
public class PyramusSchoolDataUserListener {
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private Instance<PyramusClient> pyramusClient;

  @Inject
  private PyramusIdentifierMapper identifierMapper;
  
  @Inject
  private Event<SchoolDataUserGroupUserDiscoveredEvent> schoolDataUserGroupUserDiscoveredEvent;

  @Inject
  private Event<SchoolDataUserGroupUserUpdatedEvent> schoolDataUserGroupUserUpdatedEvent;

  @Inject
  private Event<SchoolDataUserGroupUserRemovedEvent> schoolDataUserGroupUserRemovedEvent;
  
  public void onSchoolDataUserUpdatedEvent(@Observes SchoolDataUserUpdatedEvent event) {
    for (SchoolDataIdentifier identifier : event.getDiscoveredIdentifiers()) {
      if (identifier.getDataSource().equals(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE)) {
        handlePyramusUserDiscovered(identifier);
      }
    }
    
    for (SchoolDataIdentifier identifier : event.getUpdatedIdentifiers()) {
      if (identifier.getDataSource().equals(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE)) {
        handlePyramusUserUpdated(identifier);
      }
    }
    
    for (SchoolDataIdentifier identifier : event.getRemovedIdentifiers()) {
      if (identifier.getDataSource().equals(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE)) {
        handlePyramusUserRemoved(identifier);
      }
    }
  }
  
  private void handlePyramusUserDiscovered(SchoolDataIdentifier identifier) {
    Long pyramusStudentId = identifierMapper.getPyramusStudentId(identifier.getIdentifier());
    if (pyramusStudentId != null) {
      Student student = pyramusClient.get().get(String.format("/students/students/%d", pyramusStudentId), Student.class);

      if (student != null) {
        Long pyramusStudyProgrammeId = student.getStudyProgrammeId();
        
        if (pyramusStudyProgrammeId != null) {
          boolean isActive = (!student.getArchived()) && (student.getStudyEndDate() == null);

          if (isActive) {
            String userGroupUserIdentifier = identifierMapper.getStudyProgrammeStudentIdentifier(pyramusStudentId);
            String userGroupIdentifier = identifierMapper.getStudyProgrammeIdentifier(pyramusStudyProgrammeId);
            String userEntityIdentifier = identifier.getIdentifier();
            fireUserGroupUserDiscovered(userGroupUserIdentifier, userGroupIdentifier, userEntityIdentifier);
          }
        }
      }
    }
  }
  
  private void handlePyramusUserUpdated(SchoolDataIdentifier identifier) {
    Long pyramusStudentId = identifierMapper.getPyramusStudentId(identifier.getIdentifier());
    if (pyramusStudentId != null) {
      Student student = pyramusClient.get().get(String.format("/students/students/%d", pyramusStudentId), Student.class);
    
      if (student != null) {
        Long pyramusStudyProgrammeId = student.getStudyProgrammeId();
        
        if (pyramusStudyProgrammeId != null) {
          String userGroupIdentifier = identifierMapper.getStudyProgrammeIdentifier(pyramusStudyProgrammeId);

          boolean found = false;
          boolean isActive = (!student.getArchived()) && (student.getStudyEndDate() == null);
          
          UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(identifier.getDataSource(), identifier.getIdentifier());
          // Remove StudyProgrammeGroups
          List<UserGroupUserEntity> userGroupUsers = userGroupEntityController.listUserGroupUsersByUser(userEntity);
          for (UserGroupUserEntity userGroupUser : userGroupUsers) {
            UserGroupEntity userGroup = userGroupUser.getUserGroupEntity();
            StudentGroupType studentGroupType = identifierMapper.getStudentGroupType(userGroup.getIdentifier());
            if (studentGroupType == StudentGroupType.STUDYPROGRAMME) {
              if ((!isActive) || (!userGroup.getIdentifier().equals(userGroupIdentifier)))
                fireUserGroupUserRemoved(userGroupUser.getIdentifier(), userGroup.getIdentifier(), identifier.getIdentifier());
              else
                found = true;
            }
          }
          
          if (!found) {
            if (isActive) {
              String userGroupUserIdentifier = identifierMapper.getStudyProgrammeStudentIdentifier(pyramusStudentId);
              String userEntityIdentifier = identifier.getIdentifier();
              fireUserGroupUserDiscovered(userGroupUserIdentifier, userGroupIdentifier, userEntityIdentifier);
            }
          }
        }
      }
    }
  }
  
  private void handlePyramusUserRemoved(SchoolDataIdentifier identifier) {
    UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(identifier.getDataSource(), identifier.getIdentifier());
    
    // Remove StudyProgrammeGroups
    List<UserGroupUserEntity> userGroupUsers = userGroupEntityController.listUserGroupUsersByUser(userEntity);
    for (UserGroupUserEntity userGroupUser : userGroupUsers) {
      UserGroupEntity userGroup = userGroupUser.getUserGroupEntity();
      StudentGroupType studentGroupType = identifierMapper.getStudentGroupType(userGroup.getIdentifier());
      if (studentGroupType == StudentGroupType.STUDYPROGRAMME) {
        fireUserGroupUserRemoved(userGroupUser.getIdentifier(), userGroup.getIdentifier(), identifier.getIdentifier());
      }
    } 
  }
  
  private void fireUserGroupUserDiscovered(String userGroupUserIdentifier, String userGroupIdentifier, String userEntityIdentifier) {
    schoolDataUserGroupUserDiscoveredEvent.fire(new SchoolDataUserGroupUserDiscoveredEvent(
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userGroupUserIdentifier,
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userGroupIdentifier,
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, userEntityIdentifier));
  }

  @SuppressWarnings("unused")
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
}
