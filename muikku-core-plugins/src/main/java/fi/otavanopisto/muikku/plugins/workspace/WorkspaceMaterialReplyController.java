package fi.otavanopisto.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialReplyDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceNodeDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceRootFolderDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;

@Dependent
public class WorkspaceMaterialReplyController {
  
  @Inject
	private WorkspaceMaterialReplyDAO workspaceMaterialReplyDAO;
  
  @Inject
  private WorkspaceRootFolderDAO workspaceRootFolderDAO;
  
  @Inject
  private WorkspaceNodeDAO workspaceNodeDAO;
  
  public WorkspaceMaterialReply createWorkspaceMaterialReply(WorkspaceMaterial workspaceMaterial, WorkspaceMaterialReplyState state, 
      UserEntity userEntity, Long numberOfTries, Date created, Date lastModified) {
    return workspaceMaterialReplyDAO.create(workspaceMaterial, state, userEntity.getId(), numberOfTries, created, lastModified, null, null);
  }
  
  public WorkspaceMaterialReply createWorkspaceMaterialReply(WorkspaceMaterial workspaceMaterial, WorkspaceMaterialReplyState state, UserEntity userEntity) {
    Date now = new Date();
    return createWorkspaceMaterialReply(workspaceMaterial, state, userEntity, 1l, now, now);
  }

  public WorkspaceMaterialReply findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(WorkspaceMaterial workspaceMaterial, UserEntity userEntity) {
    return workspaceMaterialReplyDAO.findByWorkspaceMaterialAndUserEntityId(workspaceMaterial, userEntity.getId());
  }

  public fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply findWorkspaceMaterialReplyById(Long workspaceMaterialReplyId) {
    return workspaceMaterialReplyDAO.findById(workspaceMaterialReplyId);
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
  
  public Long getReplyCountByUserEntityAndReplyStateAndWorkspaceMaterials(Long userEntityId, WorkspaceMaterialReplyState replyState, List<WorkspaceMaterial> materials) {
    return workspaceMaterialReplyDAO.countByUserAndStateAndMaterials(userEntityId, replyState, materials);
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

  public WorkspaceMaterialReply updateWorkspaceMaterialReplyModified(fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply workspaceMaterialReply, Date lastModified) {
    return workspaceMaterialReplyDAO.updateLastModified(workspaceMaterialReply, lastModified);
  }
  
  public WorkspaceMaterialReply updateWorkspaceMaterialReply(fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply workspaceMaterialReply, WorkspaceMaterialReplyState state) {
    switch (state) {
      case SUBMITTED:
        workspaceMaterialReplyDAO.updateSubmitted(workspaceMaterialReply, new Date());
      break;
      case WITHDRAWN:
        workspaceMaterialReplyDAO.updateWithdrawn(workspaceMaterialReply, new Date());
      break;
      default:
      break;
    }
    
    return workspaceMaterialReplyDAO.updateState(workspaceMaterialReply, state);
  }
}
