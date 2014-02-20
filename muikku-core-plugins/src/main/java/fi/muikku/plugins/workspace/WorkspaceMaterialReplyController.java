package fi.muikku.plugins.workspace;

import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialReplyDAO;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;

@Dependent
@Stateless
public class WorkspaceMaterialReplyController {
  
  @Inject
	private WorkspaceMaterialReplyDAO workspaceMaterialReplyDAO;
	
  public WorkspaceMaterialReply createWorkspaceMaterialReply(WorkspaceMaterial workspaceMaterial, UserEntity userEntity) {
    return workspaceMaterialReplyDAO.create(workspaceMaterial, userEntity.getId());
  }

  public WorkspaceMaterialReply findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(WorkspaceMaterial morkspaceMaterial, UserEntity userEntity) {
    return workspaceMaterialReplyDAO.findByWorkspaceMaterialAndUserEntityId(morkspaceMaterial, userEntity.getId());
  }

  public List<WorkspaceMaterialReply> listWorkspaceMaterialRepliesByWorkspaceMaterial(WorkspaceMaterial workspaceMaterial) {
    return workspaceMaterialReplyDAO.listByWorkspaceMaterial(workspaceMaterial);
  }
  
  public void deleteWorkspaceMaterialReply(WorkspaceMaterialReply workspaceMaterialReply) {
    workspaceMaterialReplyDAO.delete(workspaceMaterialReply); 
  }
}
