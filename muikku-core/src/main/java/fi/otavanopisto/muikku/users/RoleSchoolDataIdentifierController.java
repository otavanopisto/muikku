package fi.otavanopisto.muikku.users;

import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.users.RoleSchoolDataIdentifierDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.users.RoleSchoolDataIdentifier;

public class RoleSchoolDataIdentifierController {

  @Inject
  private Logger logger;
  
  @Inject
  private RoleSchoolDataIdentifierDAO roleSchoolDataIdentifierDAO;
  
  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
  public List<RoleSchoolDataIdentifier> listRoleSchoolDataIdentifiersByDataSource(String dataSource) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return listRoleSchoolDataIdentifiersByDataSource(schoolDataSource);
  }
  
  public List<RoleSchoolDataIdentifier> listRoleSchoolDataIdentifiersByDataSource(SchoolDataSource schoolDataSource) {
    return roleSchoolDataIdentifierDAO.listByDataSource(schoolDataSource);
  }
  
  public RoleSchoolDataIdentifier findRoleSchoolDataIdentifierByDataSourceAndRoleEntity(String dataSource, RoleEntity roleEntity) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return findRoleSchoolDataIdentifierByDataSourceAndRoleEntity(schoolDataSource, roleEntity);
  }
  
  public RoleSchoolDataIdentifier findRoleSchoolDataIdentifierByDataSourceAndIdentifier(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return findRoleSchoolDataIdentifierByDataSourceAndIdentifier(schoolDataSource, identifier);
  }
  
  public RoleSchoolDataIdentifier findRoleSchoolDataIdentifierByDataSourceAndIdentifier(SchoolDataSource schoolDataSource, String identifier) {
    return roleSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
  }

  public RoleSchoolDataIdentifier findRoleSchoolDataIdentifierByDataSourceAndRoleEntity(SchoolDataSource dataSource, RoleEntity roleEntity) {
    return roleSchoolDataIdentifierDAO.findByDataSourceAndRoleEntity(dataSource, roleEntity);
  }
  
  public void deleteRoleSchoolDataIdentifier(RoleSchoolDataIdentifier roleSchoolDataIdentifier) {
    roleSchoolDataIdentifierDAO.delete(roleSchoolDataIdentifier);
  }
}
