package fi.muikku.plugins.workspace;

import java.io.FileNotFoundException;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.schooldata.WorkspaceController;

@Named
@Stateful
@RequestScoped
@Join (path = "/workspace/{workspaceUrlName}/materials/", to = "/workspaces/workspace-materials.jsf")
public class WorkspaceMaterialsBackingBean {

  @Parameter
  private String workspaceUrlName;
  
	@Inject
	private WorkspaceController workspaceController;
	
	@Inject
	private WorkspaceMaterialController workspaceMaterialController;

	@Inject
  @Named
  private WorkspaceNavigationBackingBean workspaceNavigationBackingBean;

	@RequestAction
	public void init() throws FileNotFoundException {
	  String urlName = getWorkspaceUrlName();
	  
		if (StringUtils.isBlank(urlName)) {
			throw new FileNotFoundException();
		}
		
		WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);
		if (workspaceEntity == null) {
			throw new FileNotFoundException();
		}
		
		rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
    
    workspaceNavigationBackingBean.setWorkspaceUrlName(urlName);
	}
	
	public List<WorkspaceNode> listWorkspaceNodes(WorkspaceNode workspaceNode) {
	  List<WorkspaceNode> nodes = workspaceMaterialController.listWorkspaceNodesByParent(workspaceNode);
	  
		Collections.sort(nodes, new Comparator<WorkspaceNode>() {
		  @Override
		  public int compare(WorkspaceNode o1, WorkspaceNode o2) {
		    return o1.getUrlName().compareTo(o2.getUrlName());
		  }
		  
    });
		
		return nodes;
	}
	
	public List<WorkspaceMaterial> listWorkspaceMaterials(WorkspaceNode workspaceNode) {
		return workspaceMaterialController.listWorkspaceMaterialsByParent(workspaceNode);
	}
	
	public WorkspaceRootFolder getRootFolder() {
		return rootFolder;
	}
	
	public void setRootFolder(WorkspaceRootFolder rootFolder) {
		this.rootFolder = rootFolder;
	}
	
	public String getWorkspaceUrlName() {
		return workspaceUrlName;
	}

	public void setWorkspaceUrlName(String workspaceUrlName) {
		this.workspaceUrlName = workspaceUrlName;
	}

	private WorkspaceRootFolder rootFolder;
}