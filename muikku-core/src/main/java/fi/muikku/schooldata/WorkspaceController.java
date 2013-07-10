package fi.muikku.schooldata;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.workspace.WorkspaceTypeEntityDAO;
import fi.muikku.dao.workspace.WorkspaceTypeSchoolDataIdentifierDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceTypeEntity;
import fi.muikku.model.workspace.WorkspaceTypeSchoolDataIdentifier;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceType;

@Dependent
@Stateful
public class WorkspaceController {
	
	@Inject
	private Logger logger;
	
	@Inject
	private WorkspaceSchoolDataController workspaceSchoolDataController;

	@Inject
	private WorkspaceTypeEntityDAO workspaceTypeEntityDAO; 

	@Inject
	private WorkspaceTypeSchoolDataIdentifierDAO workspaceTypeSchoolDataIdentifierDAO;

	@Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;
	
	/* WorkspaceTypeEntity */
	
	public List<WorkspaceTypeEntity> listWorkspaceTypeEntities() {
		return workspaceTypeEntityDAO.listAll();
	}

	public WorkspaceTypeEntity findWorkspaceTypeEntity(WorkspaceType workspaceType) {
		return workspaceSchoolDataController.findWorkspaceTypeEntity(workspaceType);
	}

	/* WorkspaceType */

	public WorkspaceTypeEntity findWorkspaceTypeEntityById(Long id) {
		return workspaceTypeEntityDAO.findById(id);
	}
	
	public List<WorkspaceType> listWorkspaceTypes() {
		return workspaceSchoolDataController.listWorkspaceTypes();
	}
	
	public WorkspaceType findWorkspaceTypeByDataSourceAndIdentifier(String schoolDataSource, String identifier) {
		try {
			return workspaceSchoolDataController.findWorkspaceTypeByDataSourceAndIdentifier(schoolDataSource, identifier);
		} catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
			logger.log(Level.SEVERE, "School Data Bride reported an error while retriving WorkspaceType");
			return null;
		}
	}
	
	public WorkspaceTypeEntity findWorkspaceTypeEntityByDataSourceAndIdentifier(String schoolDataSource, String identifier) {
		WorkspaceType workspaceType = findWorkspaceTypeByDataSourceAndIdentifier(schoolDataSource, identifier);
		if (workspaceType != null) {
		  return findWorkspaceTypeEntity(workspaceType);
		}
		
		return null;
	}

	public void setWorkspaceTypeEntity(WorkspaceType workspaceType, WorkspaceTypeEntity workspaceTypeEntity) {
		// TODO: Proper error handling
		
		SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(workspaceType.getSchoolDataSource());
		if (schoolDataSource != null) {
		  WorkspaceTypeSchoolDataIdentifier schoolDataIdentifier = workspaceTypeSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(schoolDataSource, workspaceType.getIdentifier());
		  if (schoolDataIdentifier == null) {
		  	if (workspaceTypeEntity != null) {
		  	  workspaceTypeSchoolDataIdentifierDAO.create(schoolDataSource, workspaceType.getIdentifier(), workspaceTypeEntity);
		  	}
		  } else {
		  	if (workspaceTypeEntity == null) {
		  		workspaceTypeSchoolDataIdentifierDAO.delete(schoolDataIdentifier);
		  	} else {
  		  	if (!schoolDataIdentifier.getWorkspaceTypeEntity().getId().equals(workspaceTypeEntity.getId())) {
	  	  		workspaceTypeSchoolDataIdentifierDAO.updateWorkspaceTypeEntity(schoolDataIdentifier, workspaceTypeEntity);
  		  	}
		  	}
		  }
		}
	}

	/* Workspace */
	
	public WorkspaceEntity findWorkspaceEntity(Workspace workspace) {
		return workspaceSchoolDataController.findWorkspaceEntity(workspace);
	}

	public List<Workspace> listWorkspaces() {
		return workspaceSchoolDataController.listWorkspaces();
	}

}
