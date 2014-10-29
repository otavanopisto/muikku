package fi.muikku.users;

import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.EnvironmentRoleEntityDAO;
import fi.muikku.dao.users.RoleSchoolDataIdentifierDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.users.RoleSchoolDataIdentifier;
import fi.muikku.model.users.UserRoleType;

public class EnvironmentRoleEntityController {
  
  @Inject
  private Logger logger;
  
  @Inject
  private EnvironmentRoleEntityDAO environmentRoleEntityDAO;

  @Inject
  private RoleSchoolDataIdentifierDAO roleSchoolDataIdentifierDAO;
  
  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
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
  
  public RoleSchoolDataIdentifier findRoleSchoolDataIdentifierByDataSourceAndRoleEntity(String dataSource, RoleEntity roleEntity) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return findRoleSchoolDataIdentifierByDataSourceAndRoleEntity(schoolDataSource, roleEntity);
  }
  
  public RoleSchoolDataIdentifier findRoleSchoolDataIdentifierByDataSourceAndRoleEntity(SchoolDataSource dataSource, RoleEntity roleEntity) {
    return roleSchoolDataIdentifierDAO.findByDataSourceAndRoleEntity(dataSource, roleEntity);
  }
  
  public List<EnvironmentRoleEntity> listEnvironmentRoleEntities() {
    return environmentRoleEntityDAO.listAll();
  }


}
