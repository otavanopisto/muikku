package fi.muikku.dao.workspace;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.workspace.WorkspaceType;

@DAO
public class WorkspaceTypeDAO extends CoreDAO<WorkspaceType> {

	private static final long serialVersionUID = 2289284306254194974L;

	public WorkspaceType create(String name) {
		WorkspaceType workspaceType = new WorkspaceType();
		workspaceType.setName(name);
    
    getEntityManager().persist(workspaceType);
    
    return workspaceType;
  }

}
