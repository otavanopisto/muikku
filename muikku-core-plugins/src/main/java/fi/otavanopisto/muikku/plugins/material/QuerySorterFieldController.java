package fi.otavanopisto.muikku.plugins.material;

import java.io.IOException;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import org.codehaus.jackson.map.ObjectMapper;

import fi.otavanopisto.muikku.plugins.material.dao.QuerySorterFieldDAO;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldUpdateEvent;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.SorterFieldMeta;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QuerySorterField;

@Dependent
public class QuerySorterFieldController {

  @Inject
  private QuerySorterFieldDAO querySorterFieldDAO;

  @Inject
  private Event<QueryFieldUpdateEvent> queryFieldUpdateEvent;
  
  @Inject
  private Event<QueryFieldDeleteEvent> queryFieldDeleteEvent;

  public QuerySorterField createQuerySorterField(Material material, String name) {
    return querySorterFieldDAO.create(material, name);
  }

  public QuerySorterField findQuerySorterFieldbyId(Long id) {
    return querySorterFieldDAO.findById(id);
  }

  public QuerySorterField findQueryTextFieldByMaterialAndName(Material material, String name) {
    return querySorterFieldDAO.findByMaterialAndName(material, name);
  }

  public QuerySorterField updateQuerySorterField(Material material, MaterialField field, boolean removeAnswers) throws MaterialFieldMetaParsingExeption {
    ObjectMapper objectMapper = new ObjectMapper();
    SorterFieldMeta sorterFieldMeta;
    try {
      sorterFieldMeta = objectMapper.readValue(field.getContent(), SorterFieldMeta.class);
    } catch (IOException e) {
      throw new MaterialFieldMetaParsingExeption("Could not parse select field meta", e);
    }
    QuerySorterField queryField = querySorterFieldDAO.findByMaterialAndName(material, sorterFieldMeta.getName());
    // -> fi.otavanopisto.muikku.plugins.workspace.QueryFieldChangeListener
    queryFieldUpdateEvent.fire(new QueryFieldUpdateEvent(queryField, field, removeAnswers));
    return queryField;
  }
  
  public void deleteQuerySorterField(QuerySorterField queryField, boolean removeAnswers) {
    queryFieldDeleteEvent.fire(new QueryFieldDeleteEvent(queryField, removeAnswers));
    querySorterFieldDAO.delete(queryField);
  }

}
