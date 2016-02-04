package fi.muikku.schooldata;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.users.WorkspaceUserEntityController;

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
    
    WorkspaceEntity workspaceEntity = workspaceEntityDAO.create(schoolDataSource, identifier, urlName, Boolean.FALSE, Boolean.FALSE);

//  TODO: Re-enable workspace settings template
//    WorkspaceSettingsTemplate workspaceSettingsTemplate = workspaceSettingsTemplateDAO.findById(1l);
//    workspaceSettingsDAO.create(workspaceEntity, workspaceSettingsTemplate.getDefaultWorkspaceUserRole());
//    
//    List<WorkspaceSettingsTemplateRolePermission> permissionTemplates = workspaceSettingsTemplateRolePermissionDAO.listByTemplate(workspaceSettingsTemplate);
//    for (WorkspaceSettingsTemplateRolePermission permissionTemplate : permissionTemplates) {
//      workspaceRolePermissionDAO.create(workspaceEntity, permissionTemplate.getRole(), permissionTemplate.getPermission());
//    }
    
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
}
