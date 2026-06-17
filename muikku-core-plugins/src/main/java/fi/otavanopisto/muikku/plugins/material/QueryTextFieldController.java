package fi.otavanopisto.muikku.plugins.material;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.material.Material;
import fi.otavanopisto.muikku.model.material.QueryTextField;
import fi.otavanopisto.muikku.plugins.material.dao.QueryTextFieldDAO;

@Dependent
public class QueryTextFieldController {

  @Inject
  private QueryTextFieldDAO queryTextFieldDAO;

  public QueryTextField createQueryTextField(Material material, String name) {
    return queryTextFieldDAO.create(material, name);
  }

  public QueryTextField findQueryTextFieldbyId(Long id) {
    return queryTextFieldDAO.findById(id);
  }

  public QueryTextField findQueryTextFieldByMaterialAndName(Material material, String name) {
    return queryTextFieldDAO.findByMaterialAndName(material, name);
  }

}
