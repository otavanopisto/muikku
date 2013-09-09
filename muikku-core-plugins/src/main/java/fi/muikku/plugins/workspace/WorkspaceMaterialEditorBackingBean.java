package fi.muikku.plugins.workspace;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import com.ocpsoft.pretty.faces.annotation.URLMappings;
import com.ocpsoft.pretty.faces.annotation.URLMapping;

import fi.muikku.controller.MaterialController;
import fi.muikku.model.material.Material;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;

@Named
@Stateful
@RequestScoped
@URLMappings(mappings = {
		@URLMapping(id = "workspace", pattern = "/workspace/editor/#{workspaceMaterialEditorBackingBean.workspaceUrlName}", viewId = "/workspaces/workspace-editor.jsf")
		})
public class WorkspaceMaterialEditorBackingBean implements Serializable {

  private static final long serialVersionUID = -4282035235792733897L;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private UserController userController;
  
  @Inject
  private MaterialController materialController;

  @PostConstruct
  public void init() {
  }

  public Long getWorkspaceId() {
    if (workspaceId == null && workspaceUrlName != null) {
      WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(workspaceUrlName);
      if (workspaceEntity != null) {
        workspaceId = workspaceEntity.getId();
      }
    }

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
  
  public Workspace getWorkspace() {
    Long workspaceId = getWorkspaceId();
    if (workspaceId != null) {
      WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceId);
      if (workspaceEntity != null) {
        return workspaceController.findWorkspace(workspaceEntity);
      }
    }
    
    return null;
  }

  public List<String> getRenderedWorkspaceMaterials() {
    List<String> result = new ArrayList<>();
    
    Long workspaceId = getWorkspaceId();
    if (workspaceId != null) {
      WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(getWorkspaceId());
      for (Material material : workspaceEntity.getMaterials()) {
        String rendered = materialController.renderEditor(material);
        System.out.println(rendered);
        result.add(rendered);
      }
    }
    
    return result;
  }

  private Long workspaceId;
  private String workspaceUrlName;
}
