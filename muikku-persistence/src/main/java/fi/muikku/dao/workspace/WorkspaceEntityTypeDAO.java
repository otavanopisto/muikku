package fi.muikku.dao.workspace;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.workspace.WorkspaceTypeEntity;

@DAO
public class WorkspaceEntityTypeDAO extends CoreDAO<WorkspaceTypeEntity> {

	private static final long serialVersionUID = 2289284306254194974L;

	public WorkspaceTypeEntity create(String name) {
		WorkspaceTypeEntity workspaceType = new WorkspaceTypeEntity();
		workspaceType.setName(name);
    
    getEntityManager().persist(workspaceType);
    
    return workspaceType;
  }

}
