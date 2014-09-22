package fi.muikku.schooldata.initializers;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.workspace.WorkspaceUserEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.schooldata.RoleController;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceUser;

@Stateless
@Dependent
public class WorkspaceUserSchoolDataEntityInitializer implements SchoolDataWorkspaceUserInitializer {

  @Inject
  private UserController userController;

  @Inject
  private RoleController roleController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

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
    User user = userController.findUser(workspaceUser.getUserSchoolDataSource(), workspaceUser.getUserIdentifier());
    UserEntity userEntity = userController.findUserEntity(user);
    Workspace workspace = workspaceController.findWorkspace(workspaceUser.getWorkspaceSchoolDataSource(), workspaceUser.getWorkspaceIdentifier());
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntity(workspace);

    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityDAO.findByWorkspaceAndUser(workspaceEntity, userEntity);
    if (workspaceUserEntity == null) {
      WorkspaceRoleEntity roleEntity = null;
      if (StringUtils.isNotBlank(workspaceUser.getRoleIdentifier()) && StringUtils.isNotBlank(workspaceUser.getRoleSchoolDataSource())) {
        SchoolDataSource roleDataSource = schoolDataSourceDAO.findByIdentifier(workspaceUser.getRoleSchoolDataSource());
        Role role = roleController.findRole(roleDataSource, workspaceUser.getRoleIdentifier());
        roleEntity = roleController.findWorkspaceRoleEntity(role);
      }

      workspaceUserEntityDAO.create(userEntity, workspaceEntity, workspaceUser.getIdentifier(), roleEntity);
    }

    return workspaceUser;
  }

}
