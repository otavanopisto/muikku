package fi.muikku.controller;

import java.util.List;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.base.EnvironmentDAO;
import fi.muikku.model.base.Environment;

@Dependent
public class EnvironmentController {

  @Inject
  private EnvironmentDAO environmentDAO;
  
  public Environment findEnvironmentById(Long id) {
    return environmentDAO.findById(id);
  }
  
  public List<Environment> listEnvironments() {
  	return environmentDAO.listAll();
  }
}
