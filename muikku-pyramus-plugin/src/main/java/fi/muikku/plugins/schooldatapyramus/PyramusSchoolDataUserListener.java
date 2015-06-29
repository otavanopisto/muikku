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
import fi.muikku.schooldata.events.SchoolDataUserDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupUserDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupUserRemovedEvent;
import fi.muikku.schooldata.events.SchoolDataUserGroupUserUpdatedEvent;
import fi.muikku.schooldata.events.SchoolDataUserRemovedEvent;
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

  public void onSchoolDataUserDiscoveredEvent(@Observes SchoolDataUserDiscoveredEvent event) {
    if (SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE.equals(event.getDataSource())) {
      Long pyramusStudentId = identifierMapper.getPyramusStudentId(event.getIdentifier());
      if (pyramusStudentId != null) {
        Student student = pyramusClient.get().get(String.format("/students/students/%d", pyramusStudentId), Student.class);

        if (student != null) {
          Long pyramusStudyProgrammeId = student.getStudyProgrammeId();
          
          if (pyramusStudyProgrammeId != null) {
            boolean isActive = (!student.getArchived()) && (student.getStudyEndDate() == null);

            if (isActive) {
              String userGroupUserIdentifier = identifierMapper.getStudyProgrammeStudentIdentifier(pyramusStudentId);
              String userGroupIdentifier = identifierMapper.getStudyProgrammeIdentifier(pyramusStudyProgrammeId);
              String userEntityIdentifier = event.getIdentifier();
              fireUserGroupUserDiscovered(userGroupUserIdentifier, userGroupIdentifier, userEntityIdentifier);
            }
          }
        }
      }
    }
  }
  
  public void onSchoolDataUserUpdatedEvent(@Observes SchoolDataUserUpdatedEvent event) {
    if (SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE.equals(event.getDataSource())) {
      Long pyramusStudentId = identifierMapper.getPyramusStudentId(event.getIdentifier());
      if (pyramusStudentId != null) {
        Student student = pyramusClient.get().get(String.format("/students/students/%d", pyramusStudentId), Student.class);
      
        if (student != null) {
          Long pyramusStudyProgrammeId = student.getStudyProgrammeId();
          
          if (pyramusStudyProgrammeId != null) {
            String userGroupIdentifier = identifierMapper.getStudyProgrammeIdentifier(pyramusStudyProgrammeId);

            boolean found = false;
            boolean isActive = (!student.getArchived()) && (student.getStudyEndDate() == null);
            
            UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
            // Remove StudyProgrammeGroups
            List<UserGroupUserEntity> userGroupUsers = userGroupEntityController.listUserGroupUsersByUser(userEntity);
            for (UserGroupUserEntity userGroupUser : userGroupUsers) {
              UserGroupEntity userGroup = userGroupUser.getUserGroupEntity();
              StudentGroupType studentGroupType = identifierMapper.getStudentGroupType(userGroup.getIdentifier());
              if (studentGroupType == StudentGroupType.STUDYPROGRAMME) {
                if ((!isActive) || (!userGroup.getIdentifier().equals(userGroupIdentifier)))
                  fireUserGroupUserRemoved(userGroupUser.getIdentifier(), userGroup.getIdentifier());
                else
                  found = true;
              }
            }
            
            if (!found) {
              if (isActive) {
                String userGroupUserIdentifier = identifierMapper.getStudyProgrammeStudentIdentifier(pyramusStudentId);
                String userEntityIdentifier = event.getIdentifier();
                fireUserGroupUserDiscovered(userGroupUserIdentifier, userGroupIdentifier, userEntityIdentifier);
              }
            }
          }
        }
      }
    }
  }
  
  public void onSchoolDataUserRemoved(@Observes SchoolDataUserRemovedEvent event) {
    if (SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE.equals(event.getDataSource())) {
      UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
      
      // Remove StudyProgrammeGroups
      List<UserGroupUserEntity> userGroupUsers = userGroupEntityController.listUserGroupUsersByUser(userEntity);
      for (UserGroupUserEntity userGroupUser : userGroupUsers) {
        UserGroupEntity userGroup = userGroupUser.getUserGroupEntity();
        StudentGroupType studentGroupType = identifierMapper.getStudentGroupType(userGroup.getIdentifier());
        if (studentGroupType == StudentGroupType.STUDYPROGRAMME) {
          fireUserGroupUserRemoved(userGroupUser.getIdentifier(), userGroup.getIdentifier());
        }
      }
    }
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
