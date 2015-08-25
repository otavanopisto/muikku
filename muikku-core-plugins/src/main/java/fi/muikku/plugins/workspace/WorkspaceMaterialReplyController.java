package fi.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialReplyDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceNodeDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceRootFolderDAO;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;

@Dependent
@Stateless
public class WorkspaceMaterialReplyController {
  
  @Inject
	private WorkspaceMaterialReplyDAO workspaceMaterialReplyDAO;
  
  @Inject
  private WorkspaceRootFolderDAO workspaceRootFolderDAO;
  
  @Inject
  private WorkspaceNodeDAO workspaceNodeDAO;
  
  public WorkspaceMaterialReply createWorkspaceMaterialReply(WorkspaceMaterial workspaceMaterial, UserEntity userEntity, 
      Long numberOfTries, Date created, Date lastModified) {
    return workspaceMaterialReplyDAO.create(workspaceMaterial, userEntity.getId(), numberOfTries, created, lastModified);
  }

  public WorkspaceMaterialReply findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(WorkspaceMaterial morkspaceMaterial, UserEntity userEntity) {
    return workspaceMaterialReplyDAO.findByWorkspaceMaterialAndUserEntityId(morkspaceMaterial, userEntity.getId());
  }

  public List<WorkspaceMaterialReply> listVisibleWorkspaceMaterialRepliesByWorkspaceEntity(WorkspaceEntity workspaceEntity, UserEntity userEntity) {
    List<WorkspaceMaterialReply> workspaceMaterialReplies = new ArrayList<WorkspaceMaterialReply>();
    WorkspaceRootFolder rootFolder = workspaceRootFolderDAO.findByWorkspaceEntityId(workspaceEntity.getId());
    List<WorkspaceMaterial> workspaceMaterials = new ArrayList<WorkspaceMaterial>();
    appendVisibleWorkspaceMaterials(workspaceMaterials, rootFolder);
    WorkspaceMaterialReply reply; 
    for (WorkspaceMaterial workspaceMaterial : workspaceMaterials) {
      reply = findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, userEntity);
      if (reply != null) {
        workspaceMaterialReplies.add(reply);
      }
    }
    return workspaceMaterialReplies;
  }
  
  private void appendVisibleWorkspaceMaterials(List<WorkspaceMaterial> materials, WorkspaceNode workspaceNode) {
    List<WorkspaceNode> childNodes = workspaceNodeDAO.listByParentAndHidden(workspaceNode, Boolean.FALSE);
    for (WorkspaceNode childNode : childNodes) {
      if (childNode instanceof WorkspaceMaterial) { 
        materials.add((WorkspaceMaterial) childNode);
      }
      
      appendVisibleWorkspaceMaterials(materials, childNode);
    }
  }

  public List<WorkspaceMaterialReply> listWorkspaceMaterialRepliesByWorkspaceMaterial(WorkspaceMaterial workspaceMaterial) {
    return workspaceMaterialReplyDAO.listByWorkspaceMaterial(workspaceMaterial);
  }
  
  public void deleteWorkspaceMaterialReply(WorkspaceMaterialReply workspaceMaterialReply) {
    workspaceMaterialReplyDAO.delete(workspaceMaterialReply); 
  }

  public void incWorkspaceMaterialReplyTries(WorkspaceMaterialReply workspaceMaterialReply) {
    workspaceMaterialReplyDAO.update(workspaceMaterialReply, workspaceMaterialReply.getNumberOfTries() + 1, new Date());
  }
}
