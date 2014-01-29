package fi.muikku.plugins.material;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.dao.QuerySelectFieldDAO;
import fi.muikku.plugins.material.dao.QuerySelectFieldOptionDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QuerySelectField;
import fi.muikku.plugins.material.model.QuerySelectFieldOption;

@Stateless
@Dependent
public class QuerySelectFieldController {

  @Inject
  private QuerySelectFieldDAO querySelectFieldDAO;

  @Inject
  private QuerySelectFieldOptionDAO querySelectFieldOptionDAO;
  
  /* QuerySelectField */

  public QuerySelectField createQuerySelectField(Material material, String name) {
    return querySelectFieldDAO.create(material, name);
  }

  public QuerySelectField findQuerySelectFieldbyId(Long id) {
    return querySelectFieldDAO.findById(id);
  }
  
  /* QuerySelectFieldOption */
  
  public QuerySelectFieldOption createSelectFieldOption(QuerySelectField querySelectField, String name, String text) {
    return querySelectFieldOptionDAO.create(name, text, querySelectField);
  }

}
