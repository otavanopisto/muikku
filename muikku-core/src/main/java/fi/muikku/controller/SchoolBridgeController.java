package fi.muikku.controller;

import javax.ejb.Stateful;
import javax.enterprise.inject.Model;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.model.base.SchoolDataSource;

@Stateful
@Model
public class SchoolBridgeController {

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
  public SchoolDataSource findSchoolDataSourceById(Long id) {
    return schoolDataSourceDAO.findById(id);
  }
  
  public SchoolDataSource findSchoolDataSourceByIdentifier(String identifier) {
    return schoolDataSourceDAO.findByIdentifier(identifier);
  }
  
  
}
