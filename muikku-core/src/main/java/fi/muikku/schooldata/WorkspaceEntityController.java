package fi.muikku.schooldata;

import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.workspace.WorkspaceEntity;

public class WorkspaceEntityController { 

  @Inject
  private Logger logger;
  
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
    
    WorkspaceEntity workspaceEntity = workspaceEntityDAO.create(schoolDataSource, identifier, urlName, Boolean.FALSE);

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
  
  public WorkspaceEntity findWorkspaceByDataSourceAndIdentifier(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find school data source: " + dataSource);
      return null;
    }
    
    return workspaceEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
  }

  public WorkspaceEntity findWorkspaceByUrlName(String urlName) {
    return workspaceEntityDAO.findByUrlName(urlName);
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

  public WorkspaceEntity archiveWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    return workspaceEntityDAO.updateArchived(workspaceEntity, Boolean.TRUE);
  }

}
