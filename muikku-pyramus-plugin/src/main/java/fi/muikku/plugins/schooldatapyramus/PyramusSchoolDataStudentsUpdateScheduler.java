package fi.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.events.ContextInitializedEvent;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusUserRole;
import fi.muikku.plugins.schooldatapyramus.rest.SystemPyramusClient;
import fi.muikku.schooldata.UserEntityController;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserRole;
import fi.muikku.schooldata.initializers.SchoolDataEntityInitializerProvider;
import fi.pyramus.rest.model.Student;

@Singleton
public class PyramusSchoolDataStudentsUpdateScheduler {
  
  private static final int BATCH_SIZE = 100;
  
  @Inject
  private Logger logger;

  @Inject
  private SystemPyramusClient pyramusClient;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private PyramusSchoolDataEntityFactory entityFactory;

  @Inject
  private SchoolDataEntityInitializerProvider schoolDataEntityInitializerProvider;
  
  @PostConstruct
  public void init() {
    contextInitialized = false;
    offset = 0;
  }
  
  public void onContextInitialized(@Observes ContextInitializedEvent event) {
    contextInitialized = true;
  }
  
  @Schedule(minute = "*/1", hour = "*", persistent = false)
  public void synchronizeWorkspaceUsers() {
    if (contextInitialized) {
      logger.info("Synchronizing students from Pyramus");
      
      List<fi.muikku.schooldata.entity.User> newUsers = new ArrayList<>();
      List<String> existingIdentifiers = userEntityController.listUserEntityIdentifiersByDataSource(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
      Student[] students = pyramusClient.get("/students/students?firstResult=" + offset + "&maxResults=" + BATCH_SIZE, Student[].class);
      if (students.length == 0) {
        offset = 0;
      } else {
        for (Student student : students) {
          fi.muikku.schooldata.entity.User newUser = entityFactory.createEntity(student);
          if (!existingIdentifiers.contains(newUser.getIdentifier())) {
            newUsers.add(newUser);
          }
        }
        
        offset += students.length;
      }
      
      schoolDataEntityInitializerProvider.initUsers(newUsers);

      List<UserRole> userRoles = new ArrayList<>(); 

      Role studentRole = entityFactory.createEntity(fi.pyramus.rest.model.UserRole.STUDENT);
      
      for (User newUser : newUsers) {
        userRoles.add(new PyramusUserRole("PYRAMUS-" + newUser.getIdentifier(), newUser.getIdentifier(), studentRole.getIdentifier()));
      }
      
      schoolDataEntityInitializerProvider.initUserRoles(userRoles);
      
      logger.info("Synchronized " + newUsers.size() + " new students from Pyramus");
    }
  }

  private boolean contextInitialized;
  private int offset;
}
   

 


