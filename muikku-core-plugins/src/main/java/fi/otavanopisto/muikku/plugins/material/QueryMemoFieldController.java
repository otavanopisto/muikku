package fi.otavanopisto.muikku.plugins.material;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.material.Material;
import fi.otavanopisto.muikku.model.material.QueryMemoField;
import fi.otavanopisto.muikku.plugins.material.dao.QueryMemoFieldDAO;

@Dependent
public class QueryMemoFieldController {

  @Inject
  private QueryMemoFieldDAO queryMemoFieldDAO;

  public QueryMemoField createQueryMemoField(Material material, String name) {
    return queryMemoFieldDAO.create(material, name);
  }

  public QueryMemoField findQueryMemoFieldbyId(Long id) {
    return queryMemoFieldDAO.findById(id);
  }

  public QueryMemoField findQueryMemoFieldByMaterialAndName(Material material, String name) {
    return queryMemoFieldDAO.findByMaterialAndName(material, name);
  }

}
