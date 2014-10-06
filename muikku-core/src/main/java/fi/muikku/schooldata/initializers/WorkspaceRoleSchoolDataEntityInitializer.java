package fi.muikku.schooldata.initializers;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.RoleSchoolDataIdentifierDAO;
import fi.muikku.dao.workspace.WorkspaceRoleEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.users.RoleSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.schooldata.entity.WorkspaceRole;

@Stateless
@Dependent
public class WorkspaceRoleSchoolDataEntityInitializer implements SchoolDataWorkspaceRoleInitializer {

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
  private WorkspaceRoleEntityDAO workspaceRoleEntityDAO;

  @Inject
  private RoleSchoolDataIdentifierDAO roleSchoolDataIdentifierDAO;

  @Override
  public List<WorkspaceRole> init(List<WorkspaceRole> workspaceRoles) {
    List<WorkspaceRole> result = new ArrayList<>();

    for (WorkspaceRole workspaceRole : workspaceRoles) {
      workspaceRole = init(workspaceRole);
      if (workspaceRole != null) {
        result.add(workspaceRole);
      }
    }

    return result;
  }

  private WorkspaceRole init(WorkspaceRole entity) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(entity.getSchoolDataSource());
    RoleSchoolDataIdentifier roleSchoolDataIdentifier = roleSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(dataSource, entity.getIdentifier());
    if (roleSchoolDataIdentifier == null) {
      WorkspaceRoleArchetype archetype = WorkspaceRoleArchetype.valueOf(entity.getArchetype().name());
      RoleEntity roleEntity = workspaceRoleEntityDAO.create(archetype, entity.getName());
      roleSchoolDataIdentifierDAO.create(dataSource, entity.getIdentifier(), roleEntity);
    }

    return entity;
  }

  @Override
  public int getPriority() {
    return SchoolDataEntityInitializer.PRIORITY_HIGHEST;
  }

}
