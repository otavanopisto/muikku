package fi.muikku.plugins.material;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.materialfields.dao.QueryTextFieldDAO;
import fi.muikku.plugins.materialfields.model.QueryTextField;

@Stateless
@Dependent
public class QueryTextFieldController {

  @Inject
  private QueryTextFieldDAO queryTextFieldDAO;

  public QueryTextField createQueryTextField(Material material, String name, Boolean mandatory) {
    return queryTextFieldDAO.create(material, name, mandatory);
  }

  public QueryTextField findQueryTextFieldbyId(Long id) {
    return queryTextFieldDAO.findById(id);
  }

  public QueryTextField findQueryTextFieldByMaterialAndName(Material material, String name) {
    return queryTextFieldDAO.findByMaterialAndName(material, name);
  }

}
