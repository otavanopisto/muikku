package fi.otavanopisto.muikku.users;

import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.users.EnvironmentRoleEntityDAO;
import fi.otavanopisto.muikku.dao.users.RoleSchoolDataIdentifierDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.users.RoleSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.users.UserRoleType;

public class EnvironmentRoleEntityController {
  
  @Inject
  private Logger logger;
  
  @Inject
  private EnvironmentRoleEntityDAO environmentRoleEntityDAO;
  
  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
  private RoleSchoolDataIdentifierDAO roleSchoolDataIdentifierDAO;
  
  /* Environment Role Entities */

  public EnvironmentRoleEntity createEnvironmentRoleEntity(String dataSource, String identifier, EnvironmentRoleArchetype archetype, String name) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    EnvironmentRoleEntity environmentRoleEntity = environmentRoleEntityDAO.create(archetype, name);
    roleSchoolDataIdentifierDAO.create(schoolDataSource, identifier, environmentRoleEntity);
    
    return environmentRoleEntity;
  }
  
  public EnvironmentRoleEntity findEnvironmentRoleEntity(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    RoleSchoolDataIdentifier roleIdentifier = roleSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
    if (roleIdentifier != null) {
      RoleEntity roleEntity = roleIdentifier.getRoleEntity();
      if (roleEntity != null && roleEntity.getType() == UserRoleType.ENVIRONMENT) {
        return (EnvironmentRoleEntity) roleEntity;
      }
    }
    
    return null;
  }
  
  public List<RoleSchoolDataIdentifier> listRoleSchoolDataIdentifiersByEnvironmentRoleEntity(EnvironmentRoleEntity roleEntity) {
    return roleSchoolDataIdentifierDAO.listByRoleEntity(roleEntity);
  }
  
  public List<EnvironmentRoleEntity> listEnvironmentRoleEntities() {
    return environmentRoleEntityDAO.listAll();
  }


}
