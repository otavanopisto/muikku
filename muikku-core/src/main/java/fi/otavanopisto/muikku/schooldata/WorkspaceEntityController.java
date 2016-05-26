package fi.otavanopisto.muikku.schooldata;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

@Dependent
public class WorkspaceEntityController { 

  @Inject
  private Logger logger;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private WorkspaceEntityDAO workspaceEntityDAO;

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

  public WorkspaceEntity createWorkspaceEntity(String dataSource, String identifier, String urlName) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find school data source: " + dataSource);
      return null;
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityDAO.create(schoolDataSource, identifier, urlName, WorkspaceAccess.LOGGED_IN, Boolean.FALSE, Boolean.FALSE);
    
    return workspaceEntity;
  }

  public WorkspaceEntity findWorkspaceEntityById(Long workspaceEntityId) {
    return workspaceEntityDAO.findById(workspaceEntityId);
  }
  
  public WorkspaceEntity findWorkspaceByDataSourceAndIdentifier(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find school data source: " + dataSource);
      return null;
    }
    
    return workspaceEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
  }

  public WorkspaceEntity findWorkspaceByIdentifier(SchoolDataIdentifier workspaceIdentier) {
    return findWorkspaceByDataSourceAndIdentifier(workspaceIdentier.getDataSource(), 
        workspaceIdentier.getIdentifier());
  }

  public WorkspaceEntity findWorkspaceByUrlName(String urlName) {
    return workspaceEntityDAO.findByUrlName(urlName);
  }

  public List<WorkspaceEntity> listWorkspaceEntities() {
    return workspaceEntityDAO.listAll();
  }
  
  public List<String> listWorkspaceEntityIdentifiersByDataSource(String dataSource) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find school data source: " + dataSource);
      return null;
    }
    
    return listWorkspaceEntityIdentifiersByDataSource(schoolDataSource);
  }

  public List<String> listWorkspaceEntityIdentifiersByDataSource(SchoolDataSource dataSource) {
    return workspaceEntityDAO.listIdentifiersByDataSourceAndArchived(dataSource, Boolean.FALSE);
  }
  
  public List<WorkspaceEntity> listWorkspaceEntitiesByDataSource(SchoolDataSource dataSource, Integer firstResult, Integer maxResults) {
    return workspaceEntityDAO.listByDataSource(dataSource, firstResult, maxResults); 
  }
  
  public List<WorkspaceEntity> listWorkspaceEntitiesByDataSource(String dataSource, Integer firstResult, Integer maxResults) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find school data source: " + dataSource);
      return null;
    }
    
    return listWorkspaceEntitiesByDataSource(schoolDataSource, firstResult, maxResults); 
  }


  public WorkspaceEntity updateAccess(WorkspaceEntity workspaceEntity, WorkspaceAccess access) {
    return workspaceEntityDAO.updateAccess(workspaceEntity, access);
  }

  public WorkspaceEntity updateDefaultMaterialLicense(WorkspaceEntity workspaceEntity, String defaultMaterialLicense) {
    return workspaceEntityDAO.updateDefaultMaterialLicense(workspaceEntity, defaultMaterialLicense);
  }

  public WorkspaceEntity updatePublished(WorkspaceEntity workspaceEntity, Boolean published) {
    return workspaceEntityDAO.updatePublished(workspaceEntity, published);
  }

  public WorkspaceEntity archiveWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    return workspaceEntityDAO.updateArchived(workspaceEntity, Boolean.TRUE);
  }

  public void deleteWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    workspaceEntityDAO.delete(workspaceEntity);
  }

  public List<WorkspaceEntity> listWorkspaceEntitiesByWorkspaceUser(UserEntity userEntity) {
    List<WorkspaceEntity> result = new ArrayList<>();
    
    List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityController.listWorkspaceUserEntitiesByUserEntity(userEntity);
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      result.add(workspaceUserEntity.getWorkspaceEntity());
    }
    
    return result;
  }

  public List<Long> listPublishedWorkspaceEntityIds() {
    return workspaceEntityDAO.listPublishedWorkspaceEntityIds();
  }

  public Set<Long> findWorkspaceEntityIdsByIdentifiers(Collection<SchoolDataIdentifier> identifiers) {
    Set<Long> result = new HashSet<>();
    
    Map<String, Set<String>> groupedIdentifiers = new HashMap<>();
    
    for (SchoolDataIdentifier identifier : identifiers) {
      Set<String> groupIdentifiers = groupedIdentifiers.get(identifier.getDataSource());
      if (groupIdentifiers == null) {
        groupIdentifiers = new HashSet<>();
        groupedIdentifiers.put(identifier.getDataSource(), groupIdentifiers);
      }
      
      groupIdentifiers.add(identifier.getIdentifier()); 
    }
    
    for (String dataSource : groupedIdentifiers.keySet()) {
      Set<String> groupIdentifiers = groupedIdentifiers.get(dataSource);
      SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
      if (schoolDataSource != null) {
        result.addAll(workspaceEntityDAO.listIdsByDataSourceAndIdentifiers(schoolDataSource, groupIdentifiers));
      } else {
        logger.severe("Could not find school data source: " + dataSource);
      }
    }
    
    return result;
  }
}
