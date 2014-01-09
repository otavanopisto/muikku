package fi.muikku.plugins.materialfields;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.materialfields.dao.QueryTextFieldDAO;
import fi.muikku.plugins.materialfields.model.QueryTextField;

@Stateless
@Dependent
public class QueryTextFieldController {

  @Inject
  QueryTextFieldDAO queryTextFieldDAO;

  public QueryTextField createQueryTextField(Material material, String name, Boolean mandatory, String text) {
    return queryTextFieldDAO.create(material, name, mandatory, text);
  }

  public QueryTextField findQueryTextFieldbyId(Long id) {
    return queryTextFieldDAO.findById(id);
  }

  public QueryTextField findQueryTextFieldByMaterialAndName(Material material, String name) {
    return queryTextFieldDAO.findByMaterialAndName(material, name);
  }

}
