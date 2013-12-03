package fi.muikku.controller;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.dao.users.EnvironmentRoleEntityDAO;
import fi.muikku.dao.workspace.WorkspaceRoleEntityDAO;
import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.schooldata.UserController;
import fi.muikku.session.SessionController;

@RequestScoped
@Named ("Role")
public class GenericRoleController {

  @Inject
  private UserController userController;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private EnvironmentRoleEntityDAO environmentRoleEntityDAO;

  @Inject
  private WorkspaceRoleEntityDAO workspaceRoleEntityDAO;

  public boolean hasEnvironmentRole(String roleName) {
    UserEntity userEntity = sessionController.getUser();
    EnvironmentRoleEntity environmentRoleEntity = environmentRoleEntityDAO.findByName(roleName);
    
    EnvironmentUser environmentUser = userController.findEnvironmentUserByUserEntity(userEntity);
    
    return environmentUser != null ? environmentUser.getRole().getId().equals(environmentRoleEntity.getId()) : false;
  }

  public boolean hasWorkspaceRole(String roleName) {
    UserEntity userEntity = sessionController.getUser();
    WorkspaceRoleEntity workspaceRoleEntity = workspaceRoleEntityDAO.findByName(roleName);
    
    EnvironmentUser environmentUser = userController.findEnvironmentUserByUserEntity(userEntity);
    
    return environmentUser != null ? environmentUser.getRole().getId().equals(workspaceRoleEntity.getId()) : false;
  }
  
}
