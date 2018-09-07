package fi.otavanopisto.muikku.users;

import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.users.OrganizationEntityDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;

public class OrganizationEntityController {

  @Inject
  private Logger logger;
  
  @Inject
  private OrganizationEntityDAO organizationEntityDAO;
  
  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
  public OrganizationEntity createOrganizationEntity(String dataSource, String identifier, String name) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    return createOrganizationEntity(schoolDataSource, identifier, name);
  }
  
  public OrganizationEntity createOrganizationEntity(SchoolDataSource dataSource, String identifier, String name) {
    return organizationEntityDAO.create(dataSource, identifier, name);
  }
  
  public OrganizationEntity archive(OrganizationEntity organizationEntity) {
    return organizationEntityDAO.archive(organizationEntity);
  }
  
  public List<OrganizationEntity> listUnarchived() {
    return organizationEntityDAO.listUnarchived();
  }

  public List<OrganizationEntity> listByDataSource(String dataSource) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return listByDataSource(schoolDataSource);
  }
  
  public List<OrganizationEntity> listByDataSource(SchoolDataSource schoolDataSource) {
    return organizationEntityDAO.listByDataSource(schoolDataSource);
  }
  
  public OrganizationEntity findByDataSourceAndIdentifier(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return findByDataSourceAndIdentifier(schoolDataSource, identifier);
  }
  
  public OrganizationEntity findByDataSourceAndIdentifier(SchoolDataSource schoolDataSource, String identifier) {
    return organizationEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
  }

  public void delete(OrganizationEntity organizationEntity) {
    organizationEntityDAO.delete(organizationEntity);
  }

}
