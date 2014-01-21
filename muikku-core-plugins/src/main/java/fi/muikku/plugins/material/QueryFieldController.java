package fi.muikku.plugins.material;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.dao.QueryFieldDAO;
import fi.muikku.plugins.material.dao.QuerySelectFieldOptionDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryField;
import fi.muikku.plugins.material.model.QuerySelectField;
import fi.muikku.plugins.material.model.QuerySelectFieldOption;

@Stateless
@Dependent
public class QueryFieldController {

  @Inject
  private QueryFieldDAO queryFieldDAO;
  
  @Inject
  private QuerySelectFieldOptionDAO querySelectFieldOptionDAO;
  
  /* QueryField */

  public QueryField findQueryFieldByMaterialAndName(Material material, String name) {
    return queryFieldDAO.findByMaterialAndName(material, name);
  }
  
  /* SelectField */

  public QuerySelectFieldOption findQuerySelectFieldOptionByFieldAndName(QuerySelectField selectField, String name) {
    return querySelectFieldOptionDAO.findBySelectFieldAndName(selectField, name);
  }

}
