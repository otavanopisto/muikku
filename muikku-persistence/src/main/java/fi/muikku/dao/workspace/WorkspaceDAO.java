package fi.muikku.dao.workspace;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.workspace.Workspace;
import fi.muikku.model.workspace.WorkspaceType;

@DAO
public class WorkspaceDAO extends CoreDAO<Workspace> {

	private static final long serialVersionUID = -4090970047131512241L;

	public Workspace create(WorkspaceType type, String name, String urlName) {
		Workspace workspace = new Workspace();
		workspace.setName(name);
		workspace.setType(type);
		workspace.setUrlName(urlName);
		
    getEntityManager().persist(workspace);
    
    return workspace;
  }

}
