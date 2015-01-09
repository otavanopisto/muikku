package fi.muikku.plugins.material;

import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.plugins.material.dao.QuerySelectFieldDAO;
import fi.muikku.plugins.material.dao.QuerySelectFieldOptionDAO;
import fi.muikku.plugins.material.fieldmeta.SelectFieldMeta;
import fi.muikku.plugins.material.fieldmeta.SelectFieldOptionMeta;
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
  
  public QuerySelectField updateQuerySelectField(Material material, SelectFieldMeta fieldMeta) {
    // TODO Event to let WorkspaceMaterialField clear answers?
    QuerySelectField field = querySelectFieldDAO.findByMaterialAndName(material,  fieldMeta.getName());
    List<QuerySelectFieldOption> oldOptions = querySelectFieldOptionDAO.listByField(field);
    List<SelectFieldOptionMeta> newOptions = fieldMeta.getOptions();
    for (SelectFieldOptionMeta newOption : newOptions) {
      QuerySelectFieldOption correspondingOption = findOptionByName(oldOptions, newOption.getName());
      if (correspondingOption == null) {
        // New options
        createQuerySelectFieldOption(field, newOption.getName(), newOption.getText());
      }
      else {
        // Modified options
        if (!StringUtils.equals(correspondingOption.getText(), newOption.getText())) {
          updateQuerySelectFieldOptionText(correspondingOption, newOption.getText());
        }
        oldOptions.remove(correspondingOption);
      }
    }
    // Removed options
    for (QuerySelectFieldOption removedOption : oldOptions) {
      deleteQuerySelectFieldOption(removedOption);
    }
    return field;
  }
  
  private QuerySelectFieldOption findOptionByName(List<QuerySelectFieldOption> options, String name) {
    for (QuerySelectFieldOption option : options) {
      if (StringUtils.equals(option.getName(), name)) {
        return option;
      }
    }
    return null;
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
