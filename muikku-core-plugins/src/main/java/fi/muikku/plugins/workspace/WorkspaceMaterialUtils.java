package fi.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;

public class WorkspaceMaterialUtils {

	public static String getCompletePath(WorkspaceNode workspaceNode) {
		List<String> path = new ArrayList<>();
		
		WorkspaceNode parent = workspaceNode.getParent();
		
		while (parent != null) {
			if (parent instanceof WorkspaceRootFolder) {
				path.add(0, "materials");
			}

			path.add(0, parent.getUrlName());
			parent = parent.getParent();
		}
		
		path.add(workspaceNode.getUrlName());
		
		return "/workspace/" + StringUtils.join(path, '/');
	}
	
	
}
