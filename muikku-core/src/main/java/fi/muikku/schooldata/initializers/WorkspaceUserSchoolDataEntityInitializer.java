package fi.muikku.schooldata.initializers;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.workspace.WorkspaceUserEntityDAO;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserRoleType;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.schooldata.RoleController;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.WorkspaceUser;

@Stateless
@Dependent
public class WorkspaceUserSchoolDataEntityInitializer implements SchoolDataWorkspaceUserInitializer {

  @Inject
  private Logger logger;
  
  @Inject
  private UserController userController;

  @Inject
  private RoleController roleController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceUserEntityDAO workspaceUserEntityDAO;

  @Override
  public List<WorkspaceUser> init(List<WorkspaceUser> workspaceUsers) {
    List<WorkspaceUser> result = new ArrayList<>();

    for (WorkspaceUser workspaceUser : workspaceUsers) {
      workspaceUser = init(workspaceUser);
      if (workspaceUser != null) {
        result.add(workspaceUser);
      }
    }

    return result;
  }

  private WorkspaceUser init(WorkspaceUser workspaceUser) {
    UserEntity userEntity = userController.findUserEntityByDataSourceAndIdentifier(workspaceUser.getUserSchoolDataSource(), workspaceUser.getUserIdentifier());
    if (userEntity != null) {
      WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByDataSourceAndIdentifier(workspaceUser.getWorkspaceSchoolDataSource(), workspaceUser.getWorkspaceIdentifier());
      if (workspaceEntity != null) {
        WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityDAO.findByWorkspaceAndUser(workspaceEntity, userEntity);
        if (workspaceUserEntity == null) {
          RoleEntity roleEntity = roleController.findRoleEntityByDataSourceAndIdentifier(workspaceUser.getRoleSchoolDataSource(), workspaceUser.getRoleIdentifier());
          if ((roleEntity != null) && (roleEntity.getType() == UserRoleType.WORKSPACE)) {
            WorkspaceRoleEntity workspaceRoleEntity = (WorkspaceRoleEntity) roleEntity;
            workspaceUserEntityDAO.create(userEntity, workspaceEntity, workspaceUser.getIdentifier(), workspaceRoleEntity);
          } else {
            logger.warning("Invalid role " + workspaceUser.getRoleIdentifier() + '/' + workspaceUser.getRoleSchoolDataSource() + " specified for workspace user #" + workspaceUser.getIdentifier() + "/" + workspaceUser.getSchoolDataSource());
          }
        }
      } else {
        logger.warning("could not init workspace user #" + workspaceUser.getIdentifier() + "/" + workspaceUser.getSchoolDataSource() + " because workspace entity could not be found");
      }
    } else {
      logger.warning("could not init workspace user #" + workspaceUser.getIdentifier() + "/" + workspaceUser.getSchoolDataSource() + " because user entity could not be found");
    }
     
    return workspaceUser;
  }
  
  @Override
  public int getPriority() {
    return SchoolDataEntityInitializer.PRIORITY_HIGHEST;
  }

}
