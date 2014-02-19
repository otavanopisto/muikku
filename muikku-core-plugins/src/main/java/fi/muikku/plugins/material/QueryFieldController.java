package fi.muikku.plugins.material;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.dao.QueryFieldDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryField;

@Stateless
@Dependent
public class QueryFieldController {

  @Inject
  private QueryFieldDAO queryFieldDAO;
 
  /* QueryField */

  public QueryField findQueryFieldByMaterialAndName(Material material, String name) {
    return queryFieldDAO.findByMaterialAndName(material, name);
  }

}
