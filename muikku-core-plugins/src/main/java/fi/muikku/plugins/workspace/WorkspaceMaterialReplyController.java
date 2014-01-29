package fi.muikku.plugins.workspace;

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

  public WorkspaceMaterialReply findMaterialReplyByMaterialAndUserEntity(WorkspaceMaterial workspaceMaterial, UserEntity userEntity) {
    return workspaceMaterialReplyDAO.findByMaterialAndUserId(workspaceMaterial, userEntity.getId());
  }

}
