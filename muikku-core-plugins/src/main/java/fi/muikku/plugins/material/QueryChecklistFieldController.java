package fi.muikku.plugins.material;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.dao.QueryChecklistFieldDAO;
import fi.muikku.plugins.material.dao.QueryChecklistFieldOptionDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryChecklistField;
import fi.muikku.plugins.material.model.QueryChecklistFieldOption;

@Stateless
@Dependent
public class QueryChecklistFieldController {

  @Inject
  private QueryChecklistFieldDAO queryChecklistFieldDAO;

  @Inject
  private QueryChecklistFieldOptionDAO queryChecklistFieldOptionDAO;
  
  /* QueryChecklistField */

  public QueryChecklistField createQueryChecklistField(Material material, String name) {
    return queryChecklistFieldDAO.create(material, name);
  }

  public QueryChecklistField findQueryChecklistFieldbyId(Long id) {
    return queryChecklistFieldDAO.findById(id);
  }

  public QueryChecklistField findQueryChecklistFieldByMaterialAndName(Material material, String name) {
    return queryChecklistFieldDAO.findByMaterialAndName(material, name);
  }
  
  /* QueryChecklistFieldOption */
  
  public QueryChecklistFieldOption createQueryChecklistFieldOption(QueryChecklistField querySelectField, String name, String text) {
    return queryChecklistFieldOptionDAO.create(name, text, querySelectField);
  }

  public QueryChecklistFieldOption findQueryChecklistFieldOptionByFieldAndName(QueryChecklistField field, String name) {
    return queryChecklistFieldOptionDAO.findByFieldAndName(field, name);
  }

  public QueryChecklistFieldOption updateQueryChecklistFieldOptionText(QueryChecklistFieldOption queryChecklistFieldOption, String text) {
    return queryChecklistFieldOptionDAO.updateText(queryChecklistFieldOption, text);
  }

}
