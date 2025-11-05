package fi.otavanopisto.muikku.plugins.material;

import java.util.List;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.dao.QueryFieldDAO;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryField;

@Dependent
public class QueryFieldController {

  @Inject
  private QueryFieldDAO queryFieldDAO;
 
  /* QueryField */

  public QueryField findQueryFieldByMaterialAndName(Material material, String name) {
    return queryFieldDAO.findByMaterialAndName(material, name);
  }
  
  public List<QueryField> listQueryFieldsByMaterial(Material material) {
    return queryFieldDAO.listByMaterial(material);
  }

}
