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
import fi.muikku.plugins.schooldatapyramus.rest.SystemPyramusClient;
import fi.muikku.schooldata.UserEntityController;
import fi.muikku.schooldata.initializers.SchoolDataEntityInitializerProvider;
import fi.pyramus.rest.model.User;

@Singleton
public class PyramusSchoolDataUsersUpdateScheduler {
  
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
      logger.info("Synchronizing Users from Pyramus");
      
      List<fi.muikku.schooldata.entity.User> newUsers = new ArrayList<>();
      List<String> existingIdentifiers = userEntityController.listUserEntityIdentifiersByDataSource(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
      User[] users = pyramusClient.get("/users/users?firstResult=" + offset + "&maxResults=" + BATCH_SIZE, User[].class);
      if (users.length == 0) {
        offset = 0;
      } else {
        for (User user : users) {
          fi.muikku.schooldata.entity.User newUser = entityFactory.createEntity(user);
          if (!existingIdentifiers.contains(newUser.getIdentifier())) {
            newUsers.add(newUser);
          }
        }
        
        offset += users.length;
      }
      
      schoolDataEntityInitializerProvider.initUsers(newUsers);
      
      logger.info("Synchronized " + newUsers.size() + " new users from Pyramus");
    }
  }

  private boolean contextInitialized;
  private int offset;
}
   

 


