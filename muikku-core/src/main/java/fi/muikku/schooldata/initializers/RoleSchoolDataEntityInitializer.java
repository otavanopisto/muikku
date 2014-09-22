package fi.muikku.schooldata.initializers;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.EnvironmentRoleEntityDAO;
import fi.muikku.dao.users.RoleSchoolDataIdentifierDAO;
import fi.muikku.dao.workspace.WorkspaceRoleEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.users.RoleSchoolDataIdentifier;
import fi.muikku.schooldata.entity.Role;

@Stateless
@Dependent
public class RoleSchoolDataEntityInitializer implements SchoolDataRoleInitializer {

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
  private WorkspaceRoleEntityDAO workspaceRoleEntityDAO;

  @Inject
  private EnvironmentRoleEntityDAO environmentRoleEntityDAO;

  @Inject
  private RoleSchoolDataIdentifierDAO roleSchoolDataIdentifierDAO;

  @Override
  public List<Role> init(List<Role> roles) {
    List<Role> result = new ArrayList<>();

    for (Role role : roles) {
      role = init(role);
      if (role != null) {
        result.add(role);
      }
    }

    return result;
  }

  private Role init(Role entity) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(entity.getSchoolDataSource());
    RoleSchoolDataIdentifier roleSchoolDataIdentifier = roleSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(dataSource, entity.getIdentifier());
    if (roleSchoolDataIdentifier == null) {
      RoleEntity roleEntity = null;

      switch (entity.getType()) {
        case ENVIRONMENT:
          roleEntity = environmentRoleEntityDAO.create(entity.getName());
        break;
        case WORKSPACE:
          roleEntity = workspaceRoleEntityDAO.create(entity.getName());
        break;
      }

      roleSchoolDataIdentifierDAO.create(dataSource, entity.getIdentifier(), roleEntity);
    }

    return entity;
  }

}
