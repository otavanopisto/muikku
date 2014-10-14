package fi.muikku.schooldata.initializers;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.EnvironmentRoleEntityDAO;
import fi.muikku.dao.users.RoleSchoolDataIdentifierDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.users.RoleSchoolDataIdentifier;
import fi.muikku.schooldata.entity.EnvironmentRole;

@Stateless
@Dependent
public class EnvironmentRoleSchoolDataEntityInitializer implements SchoolDataEnvironmentRoleInitializer {

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
  private EnvironmentRoleEntityDAO environmentRoleEntityDAO;

  @Inject
  private RoleSchoolDataIdentifierDAO roleSchoolDataIdentifierDAO;

  @Override
  public List<EnvironmentRole> init(List<EnvironmentRole> environmentRoles) {
    List<EnvironmentRole> result = new ArrayList<>();

    for (EnvironmentRole environmentRole : environmentRoles) {
      environmentRole = init(environmentRole);
      if (environmentRole != null) {
        result.add(environmentRole);
      }
    }

    return result;
  }

  private EnvironmentRole init(EnvironmentRole entity) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(entity.getSchoolDataSource());
    RoleSchoolDataIdentifier roleSchoolDataIdentifier = roleSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(dataSource, entity.getIdentifier());
    if (roleSchoolDataIdentifier == null) {
      EnvironmentRoleArchetype archetype = EnvironmentRoleArchetype.valueOf(entity.getArchetype().name());
      RoleEntity roleEntity = environmentRoleEntityDAO.create(archetype, entity.getName());
      roleSchoolDataIdentifierDAO.create(dataSource, entity.getIdentifier(), roleEntity);
    }

    return entity;
  }

  @Override
  public int getPriority() {
    return SchoolDataEntityInitializer.PRIORITY_HIGHEST;
  }

}
