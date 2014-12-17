package fi.muikku.plugins.material;

import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.dao.QueryMultiSelectFieldDAO;
import fi.muikku.plugins.material.dao.QueryMultiSelectFieldOptionDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryMultiSelectField;
import fi.muikku.plugins.material.model.QueryMultiSelectFieldOption;

@Stateless
@Dependent
public class QueryMultiSelectFieldController {

  @Inject
  private QueryMultiSelectFieldDAO queryMultiSelectFieldDAO;

  @Inject
  private QueryMultiSelectFieldOptionDAO queryMultiSelectFieldOptionDAO;
  
  /* QueryMultiSelectField */

  public QueryMultiSelectField createQueryMultiSelectField(Material material, String name) {
    return queryMultiSelectFieldDAO.create(material, name);
  }

  public QueryMultiSelectField findQueryMultiSelectFieldbyId(Long id) {
    return queryMultiSelectFieldDAO.findById(id);
  }

  public QueryMultiSelectField findQueryMultiSelectFieldByMaterialAndName(Material material, String name) {
    return queryMultiSelectFieldDAO.findByMaterialAndName(material, name);
  }
  
  /* QueryMultiSelectFieldOption */
  
  public QueryMultiSelectFieldOption createQueryMultiSelectFieldOption(QueryMultiSelectField querySelectField, String name, String text) {
    return queryMultiSelectFieldOptionDAO.create(name, text, querySelectField);
  }

  public QueryMultiSelectFieldOption findQueryMultiSelectFieldOptionByFieldAndName(QueryMultiSelectField field, String name) {
    return queryMultiSelectFieldOptionDAO.findByFieldAndName(field, name);
  }

  public List<QueryMultiSelectFieldOption> listQueryMultiSelectFieldOptionsByField(QueryMultiSelectField field) {
    return queryMultiSelectFieldOptionDAO.listByField(field);
  }

  public QueryMultiSelectFieldOption updateQueryMultiSelectFieldOptionText(QueryMultiSelectFieldOption queryMultiSelectFieldOption, String text) {
    return queryMultiSelectFieldOptionDAO.updateText(queryMultiSelectFieldOption, text);
  }

}
