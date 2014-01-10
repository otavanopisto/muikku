package fi.muikku.plugins.materialfields;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.materialfields.dao.QuerySelectFieldDAO;
import fi.muikku.plugins.materialfields.dao.SelectFieldOptionDAO;
import fi.muikku.plugins.materialfields.model.QuerySelectField;
import fi.muikku.plugins.materialfields.model.SelectFieldOption;

@Stateless
@Dependent
public class QuerySelectFieldController {

  @Inject
  private QuerySelectFieldDAO querySelectFieldDAO;

  @Inject
  private SelectFieldOptionDAO selectFieldOptionDAO;

  public QuerySelectField createQuerySelectField(Material material, String name, Boolean mandatory) {
    return querySelectFieldDAO.create(material, name, mandatory);
  }

  public QuerySelectField findQuerySelectFieldbyId(Long id) {
    return querySelectFieldDAO.findById(id);
  }
  
  public SelectFieldOption createSelectFieldOption(QuerySelectField querySelectField, String name, String text) {
    return selectFieldOptionDAO.create(name, text, querySelectField);
  }

}
