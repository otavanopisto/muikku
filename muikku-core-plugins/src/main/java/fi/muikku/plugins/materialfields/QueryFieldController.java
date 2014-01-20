package fi.muikku.plugins.materialfields;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.materialfields.dao.QueryFieldDAO;
import fi.muikku.plugins.materialfields.dao.QuerySelectFieldOptionDAO;
import fi.muikku.plugins.materialfields.model.QueryField;
import fi.muikku.plugins.materialfields.model.QuerySelectField;
import fi.muikku.plugins.materialfields.model.QuerySelectFieldOption;

@Stateless
@Dependent
public class QueryFieldController {

  @Inject
  private QueryFieldDAO queryFieldDAO;
  
  @Inject
  private QuerySelectFieldOptionDAO querySelectFieldOptionDAO;

  /* TextField */
  
  public QueryField findQueryTextFieldByMaterialAndName(Material material, String name) {
    return queryFieldDAO.findByMaterialAndName(material, name);
  }
  
  /* SelectField */

  public QuerySelectFieldOption findQuerySelectFieldOptionByFieldAndName(QuerySelectField selectField, String name) {
    return querySelectFieldOptionDAO.findBySelectFieldAndName(selectField, name);
  }

}
