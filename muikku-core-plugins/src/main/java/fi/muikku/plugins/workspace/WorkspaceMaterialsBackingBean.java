package fi.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.List;

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
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join (path = "/workspace/{workspaceUrlName}/materials", to = "/workspaces/materials.jsf")
@LoggedIn
public class WorkspaceMaterialsBackingBean {

  @Parameter
  private String workspaceUrlName;
  
	@Inject
	private WorkspaceController workspaceController;
	
	@Inject
	private WorkspaceMaterialController workspaceMaterialController;
  
  @Inject
  private MaterialController materialController;

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
		
		rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
    
    workspaceNavigationBackingBean.setWorkspaceUrlName(urlName);
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    workspaceName = workspace.getName();
    workspaceEntityId = workspaceEntity.getId();
    contentNodes = new ArrayList<>();

    List<WorkspaceNode> rootMaterialNodes = workspaceMaterialController.listWorkspaceNodesByParent(rootFolder);
    for (WorkspaceNode rootMaterialNode : rootMaterialNodes) {
      ContentNode node = createContentNode(rootMaterialNode);
      contentNodes.add(node);
    }
    
    return null;
	}

  private ContentNode createContentNode(WorkspaceNode rootMaterialNode) {
    switch (rootMaterialNode.getType()) {
      case FOLDER:
        WorkspaceFolder workspaceFolder = (WorkspaceFolder) rootMaterialNode;
        ContentNode folderContentNode = new ContentNode(workspaceFolder.getTitle(), "folder", rootMaterialNode.getId(), null);
        
        List<WorkspaceMaterial> children = workspaceMaterialController.listWorkspaceMaterialsByParent(workspaceFolder);
        for (WorkspaceMaterial child : children) {
          folderContentNode.addChild(createContentNode(child));
        }
        
        return folderContentNode;
      case MATERIAL:
        WorkspaceMaterial workspaceMaterial = (WorkspaceMaterial) rootMaterialNode;
        Material material = materialController.findMaterialById(workspaceMaterial.getMaterialId());
        return new ContentNode(material.getTitle(), material.getType(), rootMaterialNode.getId(), material.getId());
      default:
        return null;
    }
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

  public String getWorkspaceName() {
    return workspaceName;
  }
  
	public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }
  
  public List<ContentNode> getContentNodes() {
    return contentNodes;
  }
  
  private WorkspaceRootFolder rootFolder;
  private List<ContentNode> contentNodes;
  private String workspaceName;
  private Long workspaceEntityId;

  public class ContentNode {
    
    public ContentNode(String title, String type, Long workspaceMaterialId, Long materialId) {
      super();
      this.children = new ArrayList<>();
      this.title = title;
      this.type = type;
      this.workspaceMaterialId = workspaceMaterialId;
      this.materialId = materialId;
    }

    public void addChild(ContentNode child) {
      this.children.add(child);
    }

    public String getTitle() {
      return title;
    }
    
    public String getType() {
      return type;
    }
    
    public List<ContentNode> getChildren() {
      return children;
    }
    
    public Long getMaterialId() {
      return materialId;
    }
    
    public Long getWorkspaceMaterialId() {
      return workspaceMaterialId;
    }
    
    private String title;
    private String type;
    private List<ContentNode> children;
    private Long workspaceMaterialId;
    private Long materialId;
  }

}
