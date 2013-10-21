package fi.muikku.plugins.workspace;

import java.io.FileNotFoundException;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import com.ocpsoft.pretty.faces.annotation.URLAction;
import com.ocpsoft.pretty.faces.annotation.URLMappings;
import com.ocpsoft.pretty.faces.annotation.URLMapping;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.schooldata.WorkspaceController;

@SuppressWarnings("el-syntax")
@Named
@Stateful
@RequestScoped
@URLMappings(mappings = { 
  @URLMapping(
	  id = "workspace-material", 
  	pattern = "/workspace/#{workspaceMaterialBackingBean.workspaceUrlName}/materials/#{ /[a-zA-Z0-9_\\/\\.\\-]*/ workspaceMaterialBackingBean.workspaceMaterialPath}", 
  	viewId = "/workspaces/workspace-material.jsf"
  )}
)
public class WorkspaceMaterialBackingBean {
	
	@Inject
	private WorkspaceController workspaceController;
	
	@Inject
	private WorkspaceMaterialController workspaceMaterialController;

	@URLAction
	public void init() throws FileNotFoundException {
		if (StringUtils.isBlank(getWorkspaceUrlName())) {
			throw new FileNotFoundException();
		}
		
		WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(getWorkspaceUrlName());

		if (workspaceEntity == null) {
			throw new FileNotFoundException();
		}
		
		WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialByWorkspaceEntityAndPath(workspaceEntity, getWorkspaceMaterialPath());
		if (workspaceMaterial == null) {
			throw new FileNotFoundException();
		}

	  Material material = workspaceMaterial.getMaterial();
	  if (material == null) {
	  	throw new FileNotFoundException();
	  }
	  
	  materialId = material.getId();
	  materialType = material.getType();
	}
	
	public Long getMaterialId() {
		return materialId;
	}

	public String getMaterialType() {
		return materialType;
	}
	
	public Long getWorkspaceMaterialId() {
		return workspaceMaterialId;
	}
	
	public void setWorkspaceMaterialId(Long workspaceMaterialId) {
		this.workspaceMaterialId = workspaceMaterialId;
	}

	public String getWorkspaceMaterialPath() {
		return workspaceMaterialPath;
	}
	
	public void setWorkspaceMaterialPath(String workspaceMaterialPath) {
		this.workspaceMaterialPath = workspaceMaterialPath;
	}
	
	public String getWorkspaceUrlName() {
		return workspaceUrlName;
	}

	public void setWorkspaceUrlName(String workspaceUrlName) {
		this.workspaceUrlName = workspaceUrlName;
	}


	private Long workspaceMaterialId;
	private String workspaceMaterialPath;
	private Long materialId;
	private String materialType;
	private String workspaceUrlName;
}