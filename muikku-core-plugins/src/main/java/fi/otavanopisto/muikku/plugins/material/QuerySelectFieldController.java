package fi.otavanopisto.muikku.plugins.material;

import java.io.IOException;
import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;

import fi.otavanopisto.muikku.plugins.material.dao.QuerySelectFieldDAO;
import fi.otavanopisto.muikku.plugins.material.dao.QuerySelectFieldOptionDAO;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldUpdateEvent;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.SelectFieldMeta;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.SelectFieldOptionMeta;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QuerySelectField;
import fi.otavanopisto.muikku.plugins.material.model.QuerySelectFieldOption;

@Stateless
@Dependent
public class QuerySelectFieldController {

  @Inject
  private QuerySelectFieldDAO querySelectFieldDAO;

  @Inject
  private QuerySelectFieldOptionDAO querySelectFieldOptionDAO;

  @Inject
  private Event<QueryFieldUpdateEvent> queryFieldUpdateEvent;
  
  @Inject
  private Event<QueryFieldDeleteEvent> queryFieldDeleteEvent;
  
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
  
  public QuerySelectField updateQuerySelectField(Material material, MaterialField field, boolean removeAnswers) throws MaterialFieldMetaParsingExeption {
    
    // Field JSON to metadata object
    
    ObjectMapper objectMapper = new ObjectMapper();
    SelectFieldMeta selectFieldMeta;
    try {
      selectFieldMeta = objectMapper.readValue(field.getContent(), SelectFieldMeta.class);
    } catch (IOException e) {
      throw new MaterialFieldMetaParsingExeption("Could not parse select field meta", e);
    }
    QuerySelectField queryField = querySelectFieldDAO.findByMaterialAndName(material,  selectFieldMeta.getName());
    
    // -> fi.otavanopisto.muikku.plugins.workspace.QueryFieldChangeListener
    queryFieldUpdateEvent.fire(new QueryFieldUpdateEvent(queryField, field, removeAnswers));
    
    List<QuerySelectFieldOption> oldOptions = querySelectFieldOptionDAO.listByField(queryField);
    List<SelectFieldOptionMeta> newOptions = selectFieldMeta.getOptions();
    for (SelectFieldOptionMeta newOption : newOptions) {
      QuerySelectFieldOption correspondingOption = findOptionByName(oldOptions, newOption.getName());
      if (correspondingOption == null) {
        // New options
        createQuerySelectFieldOption(queryField, newOption.getName(), newOption.getText());
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
    return queryField;
  }
  
  private QuerySelectFieldOption findOptionByName(List<QuerySelectFieldOption> options, String name) {
    for (QuerySelectFieldOption option : options) {
      if (StringUtils.equals(option.getName(), name)) {
        return option;
      }
    }
    return null;
  }

  public void deleteQuerySelectField(QuerySelectField queryField, boolean removeAnswers) {
    queryFieldDeleteEvent.fire(new QueryFieldDeleteEvent(queryField, removeAnswers));
    
    for (QuerySelectFieldOption option : listQuerySelectFieldOptionsBySelectField(queryField)) {
      deleteQuerySelectFieldOption(option);
    }
    
    querySelectFieldDAO.delete(queryField);
  }
  
  /* QuerySelectFieldOption */
  
  public QuerySelectFieldOption createQuerySelectFieldOption(QuerySelectField querySelectField, String name, String text) {
    return querySelectFieldOptionDAO.create(name, text == null ? "" : text, querySelectField);
  }

  public QuerySelectFieldOption findQuerySelectFieldOptionBySelectFieldAndName(QuerySelectField selectField, String name) {
    return querySelectFieldOptionDAO.findBySelectFieldAndName(selectField, name);
  }
  
  public List<QuerySelectFieldOption> listQuerySelectFieldOptionsBySelectField(QuerySelectField selectField) {
    return querySelectFieldOptionDAO.listBySelectField(selectField);
  }

  public QuerySelectFieldOption updateQuerySelectFieldOptionText(QuerySelectFieldOption querySelectFieldOption, String text) {
    return querySelectFieldOptionDAO.updateText(querySelectFieldOption, text == null ? "" : text);
  }
  
  public void deleteQuerySelectFieldOption(QuerySelectFieldOption querySelectFieldOption) {
    querySelectFieldOptionDAO.delete(querySelectFieldOption);
  }

}
