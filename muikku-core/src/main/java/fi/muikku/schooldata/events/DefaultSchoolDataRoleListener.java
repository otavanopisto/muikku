package fi.muikku.schooldata.events;

import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.users.EnvironmentRoleEntityController;

public class DefaultSchoolDataRoleListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private EnvironmentRoleEntityController environmentRoleEntityController;
  
  public void onSchoolDataEnvironmentRoleDiscoveredEvent(@Observes SchoolDataEnvironmentRoleDiscoveredEvent event) {
    EnvironmentRoleEntity environmentRoleEntity = environmentRoleEntityController.findEnvironmentRoleEntity(event.getDataSource(), event.getIdentifier());
    if (environmentRoleEntity == null) {
      EnvironmentRoleArchetype roleArchetype = EnvironmentRoleArchetype.valueOf(event.getArchetype().name());
      environmentRoleEntityController.createEnvironmentRoleEntity(event.getDataSource(), event.getIdentifier(), roleArchetype, event.getName());
    } else {
      logger.warning("EnvironmentRoleEntity for " + event.getIdentifier() + "/" + event.getDataSource() + " already exists");
    }
  }
  
}
