package fi.muikku.plugins.workspace;

import java.io.FileNotFoundException;
import java.util.Comparator;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import com.ocpsoft.pretty.faces.annotation.URLAction;
import com.ocpsoft.pretty.faces.annotation.URLMappings;
import com.ocpsoft.pretty.faces.annotation.URLMapping;

import edu.emory.mathcs.backport.java.util.Collections;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.schooldata.WorkspaceController;

@SuppressWarnings("el-syntax")
@Named
@Stateful
@RequestScoped
@URLMappings(mappings = { 
  @URLMapping(
	  id = "workspace-materials", 
  	pattern = "/workspace/#{workspaceMaterialsBackingBean.workspaceUrlName}/materials/", 
  	viewId = "/workspaces/workspace-materials.jsf"
  )}
)
public class WorkspaceMaterialsBackingBean {
	
	@Inject
	private WorkspaceController workspaceController;
	
	@Inject
	private WorkspaceMaterialController workspaceMaterialController;

	@Inject
  @Named
  private WorkspaceNavigationBackingBean workspaceNavigationBackingBean;

	@URLAction
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
	private String workspaceUrlName;
}