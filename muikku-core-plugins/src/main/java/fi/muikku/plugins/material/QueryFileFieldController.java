package fi.muikku.plugins.material;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.dao.QueryFileFieldDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryFileField;

@Stateless
@Dependent
public class QueryFileFieldController {

  @Inject
  private QueryFileFieldDAO queryFileFieldDAO;

  public QueryFileField createQueryFileField(Material material, String name) {
    return queryFileFieldDAO.create(material, name);
  }

  public QueryFileField findQueryFileFieldbyId(Long id) {
    return queryFileFieldDAO.findById(id);
  }

  public QueryFileField findQueryFileFieldByMaterialAndName(Material material, String name) {
    return queryFileFieldDAO.findByMaterialAndName(material, name);
  }

}
