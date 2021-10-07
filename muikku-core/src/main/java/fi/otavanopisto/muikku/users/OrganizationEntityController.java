package fi.otavanopisto.muikku.users;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.users.OrganizationEntityDAO;
import fi.otavanopisto.muikku.model.base.Archived;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.OrganizationWorkspaceVisibility;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.OrganizationRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.PublicityRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.TemplateRestriction;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;

public class OrganizationEntityController {

  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private OrganizationEntityDAO organizationEntityDAO;
  
  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  public OrganizationEntity createOrganizationEntity(String dataSource, String identifier, String name, OrganizationWorkspaceVisibility workspaceVisibility) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    return createOrganizationEntity(schoolDataSource, identifier, name, workspaceVisibility);
  }
  
  public OrganizationEntity createOrganizationEntity(SchoolDataSource dataSource, String identifier, String name, OrganizationWorkspaceVisibility workspaceVisibility) {
    return organizationEntityDAO.create(dataSource, identifier, name, workspaceVisibility);
  }
  
  public OrganizationEntity archive(OrganizationEntity organizationEntity) {
    return organizationEntityDAO.archive(organizationEntity);
  }

  public OrganizationEntity unarchive(OrganizationEntity organizationEntity) {
    return organizationEntityDAO.unarchive(organizationEntity);
  }
  
  public OrganizationEntity updateName(OrganizationEntity organizationEntity, String name) {
    return organizationEntityDAO.updateName(organizationEntity, name);
  }
  
  public List<OrganizationEntity> listLoggedUserOrganizations() {
    if (sessionController.isLoggedIn()) {
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_ALL_ORGANIZATIONS)) {
        SchoolDataIdentifier loggedUser = sessionController.getLoggedUser();
        UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(loggedUser );
        return (userSchoolDataIdentifier != null && userSchoolDataIdentifier.getOrganization() != null) ?
            Arrays.asList(userSchoolDataIdentifier.getOrganization()) : Collections.emptyList();
      } else {
        // User can access all organizations
        return listUnarchived();
      }
    } else {
      return Collections.emptyList();
    }
  }
  
  public List<OrganizationEntity> listByWorkspaceVisibility(OrganizationWorkspaceVisibility visibility, Archived archived) {
    return organizationEntityDAO.listByWorkspaceVisibility(visibility, archived);
  }
  
  public List<OrganizationEntity> listUnarchived() {
    return organizationEntityDAO.listUnarchived();
  }

  public List<OrganizationEntity> listByDataSource(String dataSource) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return listByDataSource(schoolDataSource);
  }
  
  public List<OrganizationEntity> listByDataSource(SchoolDataSource schoolDataSource) {
    return organizationEntityDAO.listByDataSource(schoolDataSource);
  }

  public List<OrganizationEntity> listByDataSourceAndArchived(String dataSource, Boolean archived) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return listByDataSourceAndArchived(schoolDataSource, archived);
  }
  
  public List<OrganizationEntity> listByDataSourceAndArchived(SchoolDataSource schoolDataSource, Boolean archived) {
    return organizationEntityDAO.listByDataSource(schoolDataSource);
  }
  
  public OrganizationEntity findBy(SchoolDataIdentifier identifier) {
    return findByDataSourceAndIdentifier(identifier.getDataSource(), identifier.getIdentifier());
  }
  
  public OrganizationEntity findById(Long organizationEntityId) {
    return organizationEntityDAO.findById(organizationEntityId);
  }

  public OrganizationEntity findByDataSourceAndIdentifier(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return findByDataSourceAndIdentifier(schoolDataSource, identifier);
  }
  
  public OrganizationEntity findByDataSourceAndIdentifier(SchoolDataSource schoolDataSource, String identifier) {
    return organizationEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
  }

  public OrganizationEntity findByDataSourceAndIdentifierAndArchived(String dataSource, String identifier, Boolean archived) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return findByDataSourceAndIdentifierAndArchived(schoolDataSource, identifier, archived);
  }
  
  public OrganizationEntity findByDataSourceAndIdentifierAndArchived(SchoolDataSource schoolDataSource, String identifier, Boolean archived) {
    return organizationEntityDAO.findByDataSourceAndIdentifierAndArchived(schoolDataSource, identifier, archived);
  }

  public void delete(OrganizationEntity organizationEntity) {
    organizationEntityDAO.delete(organizationEntity);
  }
  
  public OrganizationEntity getCurrentUserOrganization() {
    UserSchoolDataIdentifier usdi = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByUserEntity(
        sessionController.getLoggedUserEntity());
    return usdi != null ? usdi.getOrganization() : null;
  }
  
  public boolean canCurrentUserAccessAllOrganizations() {
    UserSchoolDataIdentifier usdi = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByUserEntity(
        sessionController.getLoggedUserEntity());
    // TODO Configurable default organization rather than considering one with id 1 as The One
    return usdi != null &&
        EnvironmentRoleArchetype.ADMINISTRATOR.equals(usdi.getRole().getArchetype()) &&
        usdi.getOrganization() != null &&
        usdi.getOrganization().getId().equals(1L);
  }

  /**
   * Returns a list of OrganizationAccess which includes a collection of permissions logged user can
   * act on an organization. The given list is not filtered.
   * 
   * @param organizations
   * @return
   */
  public List<OrganizationAccess> listCurrentUserOrganizationAccess(List<OrganizationEntity> organizations) {
    List<OrganizationEntity> loggedUserOrganizations = listLoggedUserOrganizations();
    List<SchoolDataIdentifier> loggedUserOrganizationIdentifiers = loggedUserOrganizations.stream().map(organization -> organization.schoolDataIdentifier()).collect(Collectors.toList());
    
    List<OrganizationAccess> organizationAccesses = organizations.stream()
      .map(organization -> {
        boolean myOrganization = loggedUserOrganizationIdentifiers.contains(organization.schoolDataIdentifier());
        
        boolean canListTemplates = myOrganization && sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_WORKSPACE_TEMPLATES);
        boolean canListUnpublished = myOrganization && sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_ALL_WORKSPACES);
        
        return new OrganizationAccess(organization.schoolDataIdentifier(), canListTemplates, canListUnpublished);
      })
      .collect(Collectors.toList());
    
    return organizationAccesses;
  }

  public List<OrganizationRestriction> listUserOrganizationRestrictions(List<OrganizationEntity> organizations,
      PublicityRestriction publicityRestriction, TemplateRestriction templateRestriction) {
    List<OrganizationAccess> organizationAccesses = listCurrentUserOrganizationAccess(organizations);
    List<OrganizationRestriction> organizationRestrictions = new ArrayList<>();
    List<SchoolDataIdentifier> organizationIdentifiers = organizations.stream().map(organization -> organization.schoolDataIdentifier()).collect(Collectors.toList());
    
    for (OrganizationAccess accessibleOrganization : organizationAccesses) {
      if (CollectionUtils.isNotEmpty(organizationIdentifiers) && !organizationIdentifiers.contains(accessibleOrganization.getOrganizationIdentifier())) {
        // If the organizationIds list is specified but the accessible organization is not in the list, we skip it
        continue;
      }

      PublicityRestriction organizationPublicityRestriction = publicityRestriction;
      TemplateRestriction organizationTemplateRestriction = templateRestriction;
      
      /*
       * for admins, allow w/e is selected for all organizations
       * everyone else, allow w/e is selected for own organization, but not unpublished for other orgs
       */
      
      if (!accessibleOrganization.isListUnpublished()) {
        switch (publicityRestriction) {
          case LIST_ALL:
            organizationPublicityRestriction = PublicityRestriction.ONLY_PUBLISHED;
          break;
          case ONLY_UNPUBLISHED:
            organizationPublicityRestriction = PublicityRestriction.NONE;
          break;
          case ONLY_PUBLISHED:
          case NONE:
          break;
        }
      }

      if (!accessibleOrganization.isListTemplates()) {
        switch (templateRestriction) {
          case LIST_ALL:
            organizationTemplateRestriction = TemplateRestriction.ONLY_WORKSPACES;
          break;
          case ONLY_TEMPLATES:
            organizationTemplateRestriction = TemplateRestriction.NONE;
          break;
          case ONLY_WORKSPACES:
          case NONE:
          break;
        }
      }

      organizationRestrictions.add(new OrganizationRestriction(accessibleOrganization.getOrganizationIdentifier(), organizationPublicityRestriction, organizationTemplateRestriction));
    }
    
    return organizationRestrictions;
  }

}
