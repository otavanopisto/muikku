package fi.muikku.plugins.materialfields;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.materialfields.dao.QueryFieldDAO;
import fi.muikku.plugins.materialfields.dao.SelectFieldOptionDAO;
import fi.muikku.plugins.materialfields.model.QueryField;
import fi.muikku.plugins.materialfields.model.QuerySelectField;
import fi.muikku.plugins.materialfields.model.SelectFieldOption;

@Stateless
@Dependent
public class QueryFieldController {

  @Inject
  private QueryFieldDAO queryFieldDAO;
  
  @Inject
  private SelectFieldOptionDAO selectFieldOptionDAO;

  /* TextField */
  
  public QueryField findQueryTextFieldByMaterialAndName(Material material, String name) {
    return queryFieldDAO.findByMaterialAndName(material, name);
  }
  
  /* SelectField */

  public SelectFieldOption findQuerySelectFieldOptionByFieldAndName(QuerySelectField selectField, String name) {
    return selectFieldOptionDAO.findBySelectFieldAndName(selectField, name);
  }

}
