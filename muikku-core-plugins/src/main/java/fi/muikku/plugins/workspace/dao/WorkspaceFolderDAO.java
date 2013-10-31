package fi.muikku.plugins.workspace.dao;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceNode;

@DAO
public class WorkspaceFolderDAO extends PluginDAO<WorkspaceFolder> {
	
	private static final long serialVersionUID = 9095130166469638314L;

	public WorkspaceFolder create(WorkspaceNode parent, String title, String urlName) {
		WorkspaceFolder workspaceFolder = new WorkspaceFolder();
		workspaceFolder.setParent(parent);
		workspaceFolder.setUrlName(urlName);
		workspaceFolder.setTitle(title);
		return persist(workspaceFolder);
	}

}
