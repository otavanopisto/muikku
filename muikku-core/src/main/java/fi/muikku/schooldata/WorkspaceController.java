package fi.muikku.schooldata;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.workspace.WorkspaceTypeEntityDAO;
import fi.muikku.model.workspace.WorkspaceTypeEntity;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceType;

@Dependent
@Stateful
public class WorkspaceController {
	
	@Inject
	private WorkspaceSchoolDataController workspaceSchoolDataController;

	@Inject
	private WorkspaceTypeEntityDAO workspaceTypeEntityDAO; 
	
	public List<WorkspaceTypeEntity> listWorkspaceTypeEntities() {
		return workspaceTypeEntityDAO.listAll();
	}

	public List<WorkspaceType> listWorkspaceTypes() {
		return workspaceSchoolDataController.listWorkspaceTypes();
	}

	public WorkspaceTypeEntity findWorkspaceTypeEntity(WorkspaceType workspaceType) {
		return workspaceSchoolDataController.findWorkspaceTypeEntity(workspaceType);
	}

	public List<Workspace> listWorkspaces() {
		return workspaceSchoolDataController.listWorkspaces();
	}
	
	
	
}
