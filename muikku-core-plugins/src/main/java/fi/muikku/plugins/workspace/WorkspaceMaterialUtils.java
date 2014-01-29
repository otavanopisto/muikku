package fi.muikku.plugins.workspace;

import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;

public class WorkspaceMaterialUtils {

	public static String getCompletePath(WorkspaceNode workspaceNode) {
	  return "workspace/" + getWorkspaceNodeWorkspaceUrlName(workspaceNode) + "/materials/" + workspaceNode.getPath();
	}
	
	public static String getWorkspaceNodeWorkspaceUrlName(WorkspaceNode workspaceNode) {
	  WorkspaceNode node = workspaceNode;
	  
	  while (node != null) {
	    if (node instanceof WorkspaceRootFolder) {
	      return ((WorkspaceRootFolder) node).getUrlName();
	    }
	    
      node = node.getParent();
	  }

	  return null;
	}
	
}
