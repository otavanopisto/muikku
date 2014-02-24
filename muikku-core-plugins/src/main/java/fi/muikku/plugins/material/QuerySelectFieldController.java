package fi.muikku.plugins.material;

import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.dao.QuerySelectFieldDAO;
import fi.muikku.plugins.material.dao.QuerySelectFieldOptionDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QuerySelectField;
import fi.muikku.plugins.material.model.QuerySelectFieldOption;

@Stateless
@Dependent
public class QuerySelectFieldController {

  @Inject
  private QuerySelectFieldDAO querySelectFieldDAO;

  @Inject
  private QuerySelectFieldOptionDAO querySelectFieldOptionDAO;
  
  /* QuerySelectField */

  public QuerySelectField createQuerySelectField(Material material, String name) {
    return querySelectFieldDAO.create(material, name);
  }

  public QuerySelectField findQuerySelectFieldbyId(Long id) {
    return querySelectFieldDAO.findById(id);
  }

  public QuerySelectField findQuerySelectFieldByMaterialAndName(Material material, String name) {
    return querySelectFieldDAO.findByMaterialAndName(material, name);
  }
  
  /* QuerySelectFieldOption */
  
  public QuerySelectFieldOption createQuerySelectFieldOption(QuerySelectField querySelectField, String name, String text) {
    return querySelectFieldOptionDAO.create(name, text, querySelectField);
  }

  public QuerySelectFieldOption findQuerySelectFieldOptionBySelectFieldAndName(QuerySelectField selectField, String name) {
    return querySelectFieldOptionDAO.findBySelectFieldAndName(selectField, name);
  }
  
  public List<QuerySelectFieldOption> listQuerySelectFieldOptionsBySelectField(QuerySelectField selectField) {
    return querySelectFieldOptionDAO.listBySelectField(selectField);
  }

  public QuerySelectFieldOption updateQuerySelectFieldOptionText(QuerySelectFieldOption querySelectFieldOption, String text) {
    return querySelectFieldOptionDAO.updateText(querySelectFieldOption, text);
  }
  
  public void deleteQuerySelectFieldOption(QuerySelectFieldOption querySelectFieldOption) {
    querySelectFieldOptionDAO.delete(querySelectFieldOption);
  }

}
