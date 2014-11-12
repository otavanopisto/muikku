package fi.muikku.plugins.workspace;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.files.TempFileUtils;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.BinaryMaterialController;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.model.BinaryMaterial;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.Workspace;

@Named
@Stateful
@RequestScoped
@Join (path = "/workspace/{workspaceUrlName}/html-material-editor", to = "/workspaces/html-material-editor.jsf")
public class WorkspaceHtmlMaterialEditorBackingBean {

  @Parameter
  private String workspaceUrlName;
  
  @Parameter
  private Long folderId;
  
  @Parameter
  private Long htmlMaterialId;
  
  @Inject
  private Logger logger;

  @Inject
  private BinaryMaterialController binaryMaterialController;

  @Inject
	private WorkspaceController workspaceController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private HtmlMaterialController htmlMaterialController;
  
	@Inject
  @Named
  private WorkspaceNavigationBackingBean workspaceNavigationBackingBean;

	@RequestAction
	public String init() {
	  String urlName = getWorkspaceUrlName();
	  
		if (StringUtils.isBlank(urlName)) {
			return "/error/not-found.jsf";
		}
		
		WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);
		if (workspaceEntity == null) {
      return "/error/not-found.jsf";
		}
		
		HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(getHtmlMaterialId());
		if (htmlMaterial == null) {
      return "/error/not-found.jsf";
    }
		
		workspaceNavigationBackingBean.setWorkspaceUrlName(urlName);
		workspaceEntityId = workspaceEntity.getId();
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    workspaceName = workspace.getName();
    htmlMaterialTitle = htmlMaterial.getTitle();
    
    return null;
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
  
  public Long getFolderId() {
    return folderId;
  }
  
  public void setFolderId(Long folderId) {
    this.folderId = folderId;
  }
  
  public Long getHtmlMaterialId() {
    return htmlMaterialId;
  }
  
  public void setHtmlMaterialId(Long htmlMaterialId) {
    this.htmlMaterialId = htmlMaterialId;
  }
  
  public String getHtmlMaterialTitle() {
    return htmlMaterialTitle;
  }
  
  public void setHtmlMaterialTitle(String htmlMaterialTitle) {
    this.htmlMaterialTitle = htmlMaterialTitle;
  }
  
  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }
  
  private Long workspaceEntityId;
  private String htmlMaterialTitle;
  private String workspaceName;
}
