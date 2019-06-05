package fi.otavanopisto.muikku.schooldata.events;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.users.OrganizationEntityController;

public class DefaultSchoolDataOrganizationListener {
  
  @Inject
  private Logger logger;

  @Inject
  private OrganizationEntityController organizationEntityController;
  
  @PostConstruct
  public void init() {
    discoveredOrganizations = new HashMap<>();
  }
  
  public void onSchoolDataOrganizationDiscoveredEvent(@Observes SchoolDataOrganizationDiscoveredEvent event) {
    String discoverId = "ORG-" + event.getDataSource() + "/" + event.getIdentifier();
    if (discoveredOrganizations.containsKey(discoverId)) {
      event.setDiscoveredOrganizationEntityId(discoveredOrganizations.get(discoverId));
      return;
    }
    
    OrganizationEntity organizationEntity = organizationEntityController.findByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (organizationEntity == null) {
      organizationEntity = organizationEntityController.createOrganizationEntity(event.getDataSource(), event.getIdentifier(), event.getName());
      discoveredOrganizations.put(discoverId, organizationEntity.getId());
      event.setDiscoveredOrganizationEntityId(organizationEntity.getId());
    }
    else if (Boolean.TRUE.equals(organizationEntity.getArchived())) {
      organizationEntityController.unarchive(organizationEntity);
      discoveredOrganizations.put(discoverId, organizationEntity.getId());
      event.setDiscoveredOrganizationEntityId(organizationEntity.getId());
    }
    else {
      logger.warning("OrganizationEntity for " + event.getIdentifier() + "/" + event.getDataSource() + " already exists");
    }
  }
  
  public void onSchoolDataOrganizationUpdated(@Observes SchoolDataOrganizationUpdatedEvent event) {
    OrganizationEntity organizationEntity = organizationEntityController.findByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (organizationEntity != null) {
      organizationEntityController.updateName(organizationEntity, event.getName());
    }
    else {
      // If organization create event was missed, do it here 
      organizationEntity = organizationEntityController.createOrganizationEntity(event.getDataSource(), event.getIdentifier(), event.getName());
      String discoverId = "ORG-" + event.getDataSource() + "/" + event.getIdentifier();
      discoveredOrganizations.put(discoverId, organizationEntity.getId());
    }
  }
  
  public void onSchoolDataOrganizationRemoved(@Observes SchoolDataOrganizationRemovedEvent event) {
    OrganizationEntity organizationEntity = organizationEntityController.findByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (organizationEntity != null) {
      organizationEntityController.archive(organizationEntity);
    }
  }

  private Map<String, Long> discoveredOrganizations;
}
