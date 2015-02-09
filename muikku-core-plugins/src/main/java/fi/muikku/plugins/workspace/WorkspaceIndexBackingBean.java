package fi.muikku.plugins.workspace;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.MaterialController;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.model.WorkspaceFrontPage;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;

@Named
@Stateful
@RequestScoped
@Join (path = "/workspace/{workspaceUrlName}", to = "/workspaces/workspace.jsf")
public class WorkspaceIndexBackingBean {
  
  @Parameter
  private String workspaceUrlName;

	@Inject
	private WorkspaceController workspaceController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private MaterialController materialController;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  @Inject
  @Named
	private WorkspaceNavigationBackingBean workspaceNavigationBackingBean;

	@RequestAction
	public String init() {
	  String urlName = getWorkspaceUrlName();
	  if (StringUtils.isBlank(urlName)) {
	   return NavigationRules.NOT_FOUND;
	  }
	  
	  WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);
    if (workspaceEntity == null) {
      return NavigationRules.NOT_FOUND;
    }
    
    WorkspaceFrontPage frontPage = workspaceMaterialController.findFrontPage(workspaceEntity);
    if (frontPage != null) {
      Material material = materialController.findMaterialById(frontPage.getMaterialId());
      if (material instanceof HtmlMaterial) {
        contents = ((HtmlMaterial) material).getHtml();
      }
    }
    
    workspaceNavigationBackingBean.setWorkspaceUrlName(urlName);
    
    workspaceId = workspaceEntity.getId();

    schoolDataBridgeSessionController.startSystemSession(); 
    try { 
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity); 
      workspaceName = workspace.getName();
    } finally { 
      schoolDataBridgeSessionController.endSystemSession(); 
    }
    
    return null;
	}

	public Long getWorkspaceId() {
		return workspaceId;
	}

	public void setWorkspaceId(Long workspaceId) {
		this.workspaceId = workspaceId;
	}
	
	public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }
  
  public String getWorkspaceName() {
    return workspaceName;
  }
  
  public String getContents() {
    return contents;
  }
  
	private Long workspaceId;
	private String workspaceName;
	private String contents;
}
