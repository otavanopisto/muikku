package fi.muikku.plugins.materialfields;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.materialfields.dao.QuerySelectFieldDAO;
import fi.muikku.plugins.materialfields.dao.QuerySelectFieldOptionDAO;
import fi.muikku.plugins.materialfields.model.QuerySelectField;
import fi.muikku.plugins.materialfields.model.QuerySelectFieldOption;

@Stateless
@Dependent
public class QuerySelectFieldController {

  @Inject
  private QuerySelectFieldDAO querySelectFieldDAO;

  @Inject
  private QuerySelectFieldOptionDAO querySelectFieldOptionDAO;

  public QuerySelectField createQuerySelectField(Material material, String name, Boolean mandatory) {
    return querySelectFieldDAO.create(material, name, mandatory);
  }

  public QuerySelectField findQuerySelectFieldbyId(Long id) {
    return querySelectFieldDAO.findById(id);
  }
  
  public QuerySelectFieldOption createSelectFieldOption(QuerySelectField querySelectField, String name, String text) {
    return querySelectFieldOptionDAO.create(name, text, querySelectField);
  }

}
