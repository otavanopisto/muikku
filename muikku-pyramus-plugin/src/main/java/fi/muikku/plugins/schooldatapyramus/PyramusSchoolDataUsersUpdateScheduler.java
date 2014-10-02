package fi.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
      List<fi.muikku.schooldata.entity.User> updateUsers = new ArrayList<>();
      Map<String, User> userMap = new HashMap<>();

      List<String> existingIdentifiers = userEntityController.listUserEntityIdentifiersByDataSource(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
      User[] pyramusUsers = pyramusClient.get("/users/users?firstResult=" + offset + "&maxResults=" + BATCH_SIZE, User[].class);
      if (pyramusUsers.length == 0) {
        offset = 0;
      } else {
        for (User pyramusUser : pyramusUsers) {
          fi.muikku.schooldata.entity.User user = entityFactory.createEntity(pyramusUser);
          if (!existingIdentifiers.contains(user.getIdentifier())) {
            newUsers.add(user);
          } else {
            updateUsers.add(user);
          }
          
          userMap.put(user.getIdentifier(), pyramusUser);
        }
        
        offset += pyramusUsers.length;
      }
      
      schoolDataEntityInitializerProvider.initUsers(newUsers);

      List<fi.muikku.schooldata.entity.UserRole> userRoles = new ArrayList<>(); 

      for (fi.muikku.schooldata.entity.User user : newUsers) {
        User pyramusUser = userMap.get(user.getIdentifier());
        String roleIdentifier = entityFactory.createEntity(pyramusUser.getRole()).getIdentifier();
        userRoles.add(new PyramusUserRole("PYRAMUS-" + user.getIdentifier(), user.getIdentifier(), roleIdentifier));
      }

      for (fi.muikku.schooldata.entity.User user : updateUsers) {
        User pyramusUser = userMap.get(user.getIdentifier());
        String roleIdentifier = entityFactory.createEntity(pyramusUser.getRole()).getIdentifier();
        userRoles.add(new PyramusUserRole("PYRAMUS-" + user.getIdentifier(), user.getIdentifier(), roleIdentifier));
      }
      
      schoolDataEntityInitializerProvider.initUserRoles(userRoles);
      
      logger.info("Synchronized " + newUsers.size() + " new users from Pyramus");
    }
  }

  private boolean contextInitialized;
  private int offset;
}
   

 


