package fi.otavanopisto.muikku.schooldata.events;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class DefaultSchoolDataWorkspaceListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private OrganizationEntityController organizationEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @PostConstruct
  public void init() {
    discoveredWorkspaces = new HashMap<>();
    discoveredWorkspaceUsers = new HashMap<>();
  }
  
  public synchronized void onSchoolDataWorkspaceDiscoveredEvent(@Observes SchoolDataWorkspaceDiscoveredEvent event) {
    String discoverId = "WS-" + event.getDataSource() + "/" + event.getIdentifier();
    if (discoveredWorkspaces.containsKey(discoverId)) {
      event.setDiscoveredWorkspaceEntityId(discoveredWorkspaces.get(discoverId));
      return;
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (workspaceEntity == null) {
      // workspace url name
      String urlNameBase = generateWorkspaceUrlName(event.getName());
      String urlName = urlNameBase;
      int urlNameIterator = 1;
      while (workspaceEntityController.findWorkspaceByUrlName(urlName) != null) {
        urlName = urlNameBase + "-" + ++urlNameIterator; 
      }
      // organization
      String organizationId = String.valueOf(event.getExtra().get("organizationId"));
      OrganizationEntity organizationEntity = organizationEntityController.findByDataSourceAndIdentifier(event.getDataSource(), organizationId);
      // workspace
      workspaceEntity = workspaceEntityController.createWorkspaceEntity(event.getDataSource(), event.getIdentifier(), urlName, organizationEntity);
    } else {
      logger.warning("workspaceEntity #" + event.getDataSource() + '/' + event.getIdentifier() + " already exists");
    }
    // workspace bookkeeping
    discoveredWorkspaces.put(discoverId, workspaceEntity.getId());
    event.setDiscoveredWorkspaceEntityId(workspaceEntity.getId());
  }
  
  public void onSchoolDataWorkspaceUpdated(@Observes SchoolDataWorkspaceUpdatedEvent event) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (workspaceEntity != null) {
      String organizationId = String.valueOf(event.getExtra().get("organizationId"));
      OrganizationEntity organizationEntity = organizationEntityController.findByDataSourceAndIdentifier(event.getDataSource(), organizationId);
      if (organizationEntity != null) {
        if (workspaceEntity.getOrganizationEntity() == null || !organizationEntity.getId().equals(workspaceEntity.getOrganizationEntity().getId())) {
          workspaceEntityController.updateOrganizationEntity(workspaceEntity, organizationEntity);
        }
      }
      // TODO: How should we handle the updating of URL names?
    } else {
      logger.warning("Updated workspaceEntity #" + event.getDataSource() + '/' + event.getIdentifier() + " could not be found");
    }
  }
  
  public void onSchoolDataWorkspaceRemoved(@Observes SchoolDataWorkspaceRemovedEvent event) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (workspaceEntity != null) {
      workspaceEntity = workspaceEntityController.archiveWorkspaceEntity(workspaceEntity);
    } 
  }
  
  public synchronized void onSchoolDataWorkspaceUserDiscoveredEvent(@Observes SchoolDataWorkspaceUserDiscoveredEvent event) {
    String discoverId = "WSU-" + event.getDataSource() + "/" + event.getIdentifier();
    if (discoveredWorkspaceUsers.containsKey(discoverId)) {
      event.setDiscoveredWorkspaceUserEntityId(discoveredWorkspaceUsers.get(discoverId));
      return;
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getWorkspaceDataSource(), event.getWorkspaceIdentifier());
    if (workspaceEntity != null) {
      WorkspaceRoleEntity workspaceUserRole = workspaceController.findWorkspaceRoleEntityByArchetype(event.getRole());
      if (workspaceUserRole != null) {
        UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(event.getUserDataSource(), event.getUserIdentifier());
        if (userSchoolDataIdentifier != null) {
          WorkspaceUserEntity workspaceUserEntity = 
              workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserSchoolDataIdentifierIncludeArchived(
                  workspaceEntity,
                  userSchoolDataIdentifier);
          if (workspaceUserEntity == null) {
            workspaceUserEntity = workspaceUserEntityController.createWorkspaceUserEntity(userSchoolDataIdentifier, workspaceEntity, event.getIdentifier(), workspaceUserRole);
            discoveredWorkspaceUsers.put(discoverId, workspaceUserEntity.getId());
            event.setDiscoveredWorkspaceUserEntityId(workspaceUserEntity.getId());
          }
          else {
            if (!workspaceUserEntity.getIdentifier().equals(event.getIdentifier())) {
              workspaceUserEntityController.updateIdentifier(workspaceUserEntity, event.getIdentifier());
            }
            // #3806: WorkspaceUserEntity exists; check if role has changed
            if (workspaceUserEntity.getWorkspaceUserRole() == null || !workspaceUserRole.getId().equals(workspaceUserEntity.getWorkspaceUserRole().getId())) {
              workspaceUserEntityController.updateWorkspaceUserRole(workspaceUserEntity, workspaceUserRole);
            }
            workspaceUserEntityController.unarchiveWorkspaceUserEntity(workspaceUserEntity);
          }
          
          // For newly discovered workspace students, always set their activity based on their ongoing studies 
          
          if (!workspaceUserEntity.getActive().equals(event.getIsActive())) {
            workspaceUserEntityController.updateActive(workspaceUserEntity, event.getIsActive());
          }

        } else {
          logger.warning("could not add workspace user because userSchoolDataIdentifier #" + event.getUserIdentifier() + '/' + event.getUserDataSource() +  " could not be found");
        }
      } else {
        logger.warning("could not init workspace user because workspace role " + event.getRole() +  " could not be found");
      }      
    } else {
      logger.warning("could not init workspace user because workspace entity #" + event.getWorkspaceIdentifier() + '/' + event.getWorkspaceDataSource() +  " could not be found"); 
    }
  }
  
  public void onSchoolDataWorkspaceUserUpdatedEvent(@Observes SchoolDataWorkspaceUserUpdatedEvent event) {
    UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(event.getUserDataSource(), event.getUserIdentifier());
    if (userEntity != null) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getWorkspaceDataSource(), event.getWorkspaceIdentifier());
      if (workspaceEntity != null) {
        SchoolDataIdentifier workspaceUserIdentifier = new SchoolDataIdentifier(event.getIdentifier(), event.getDataSource());
        WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifierIncludeArchived(workspaceUserIdentifier);
        if (workspaceUserEntity != null) {
          String currentUserIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier();
          if (!StringUtils.equals(currentUserIdentifier, event.getUserIdentifier())) {
            
            // WorkspaceUserEntity found, but it points to a different study program
            
            UserSchoolDataIdentifier newUserIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(
                event.getUserDataSource(), event.getUserIdentifier());
            if (newUserIdentifier == null) {
              logger.warning(String.format("Unable to update workspace user. UserSchoolDataIdentifier for %s/%s not found", event.getUserDataSource(), event.getUserIdentifier()));
            }
            else {
              
              // #5549: If USDI of existing WorkspaceUserEntity changes (someone changed the line of an existing course student in Pyramus),
              // make sure that the new USDI is not already in use by some other WorkspaceUserEntity. If it is, that WorkspaceUserEntity has
              // to be permanently deleted to avoid database unique check from crashing (can't have two WorkspaceEntity + USDI).

              WorkspaceUserEntity conflictingUser = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserIdentifierIncludeArchived(
                  workspaceEntity, newUserIdentifier.schoolDataIdentifier());
              if (conflictingUser != null) {
                workspaceUserEntityController.deleteWorkspaceUserEntity(conflictingUser);
              }

              workspaceUserEntity = workspaceUserEntityController.updateUserSchoolDataIdentifier(workspaceUserEntity, newUserIdentifier);
              // #3308: If the new study program is active, reactivate the corresponding workspace student in Muikku 
              if (event.getIsActive() && !workspaceUserEntity.getActive()) {
                workspaceUserEntity = workspaceUserEntityController.updateActive(workspaceUserEntity, event.getIsActive());
              }
            }
          }
          else {
            WorkspaceRoleEntity workspaceRoleEntity = workspaceController.findWorkspaceRoleEntityByArchetype(event.getRole());
            if (workspaceRoleEntity != null && !workspaceRoleEntity.getId().equals(workspaceUserEntity.getWorkspaceUserRole().getId())) {
              workspaceUserEntity = workspaceUserEntityController.updateWorkspaceUserRole(workspaceUserEntity, workspaceRoleEntity);
            }
          }

          // If a student has ended their studies but they are still active in the workspace, change them inactive (but not vice versa)
          
          if (!event.getIsActive() && workspaceUserEntity.getActive()) {
            workspaceUserEntity = workspaceUserEntityController.updateActive(workspaceUserEntity, event.getIsActive());
          }
          
          // #5549: We may have resurrected a previously archived WorkspaceUserEntity so restore it if needed
          
          if (workspaceUserEntity.getArchived()) {
            workspaceUserEntity = workspaceUserEntityController.unarchiveWorkspaceUserEntity(workspaceUserEntity);
          }
        }
      }
      else {
        logger.warning("could not update workspace user because workspace entity #" + event.getWorkspaceIdentifier() + '/' + event.getWorkspaceDataSource() +  " could not be found");
      }
    }
    else {
      logger.warning("could not update workspace user because user entity #" + event.getUserIdentifier() + '/' + event.getUserDataSource() +  " could not be found");
    }
  }

  public void onSchoolDataWorkspaceUserRemovedEvent(@Observes SchoolDataWorkspaceUserRemovedEvent event) {
    UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(event.getUserDataSource(), event.getUserIdentifier());
    if (userEntity != null) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getWorkspaceDataSource(), event.getWorkspaceIdentifier());
      if (workspaceEntity != null) {
        SchoolDataIdentifier workspaceUserIdentifier = new SchoolDataIdentifier(event.getIdentifier(), event.getDataSource());
        WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifier(workspaceUserIdentifier);
        if (workspaceUserEntity != null) {
          // #5549: To better preserve WorkspaceEntity + USDI integrity in the future , course students archived
          // from Pyramus (should be a very rare occurence, anyway) are permanently deleted from WorkspaceUserEntity in Muikku
          workspaceUserEntityController.deleteWorkspaceUserEntity(workspaceUserEntity);
        }
      } else {
        logger.warning("could not remove workspace user because workspace entity #" + event.getWorkspaceIdentifier() + '/' + event.getWorkspaceDataSource() +  " could not be found");
      }
    } else {
      logger.warning("could not remove workspace user because user entity #" + event.getUserIdentifier() + '/' + event.getUserDataSource() +  " could not be found");
    }
  }
  
  /**
   * Generates URL name from workspace name.
   * 
   * @param name original workspace name
   * @return URL name
   */
  private String generateWorkspaceUrlName(String name) {
    // convert to lower-case and replace spaces and slashes with a minus sign
    String urlName = name == null ? "" : StringUtils.lowerCase(name.replaceAll(" ", "-").replaceAll("/", "-"));
    // truncate consecutive minus signs into just one
    while (urlName.indexOf("--") >= 0) {
      urlName = urlName.replace("--", "-");
    }
    // get rid of accented characters and all special characters other than minus, period, and underscore
    urlName = StringUtils.stripAccents(urlName).replaceAll("[^a-z0-9\\-\\.\\_]", "");
    return StringUtils.isBlank(urlName) ? StringUtils.substringBefore(UUID.randomUUID().toString(), "-") : urlName;
  }
  
  private Map<String, Long> discoveredWorkspaceUsers;
  private Map<String, Long> discoveredWorkspaces;
}
