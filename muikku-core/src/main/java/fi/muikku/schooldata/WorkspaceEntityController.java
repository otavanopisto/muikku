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
  
  public WorkspaceEntity findWorkspaceByDataSourceAndIdentifier(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find school data source: " + dataSource);
      return null;
    }
    
    return workspaceEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
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
    return workspaceEntityDAO.listIdentifiersByDataSource(dataSource);
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

}
