package fi.otavanopisto.muikku.plugins.material;

import java.io.IOException;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import org.codehaus.jackson.map.ObjectMapper;

import fi.otavanopisto.muikku.plugins.material.dao.QueryOrganizerFieldDAO;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldUpdateEvent;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.OrganizerFieldMeta;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryOrganizerField;

@Dependent
public class QueryOrganizerFieldController {

  @Inject
  private QueryOrganizerFieldDAO queryOrganizerFieldDAO;

  @Inject
  private Event<QueryFieldUpdateEvent> queryFieldUpdateEvent;
  
  @Inject
  private Event<QueryFieldDeleteEvent> queryFieldDeleteEvent;

  public QueryOrganizerField createQueryOrganizerField(Material material, String name) {
    return queryOrganizerFieldDAO.create(material, name);
  }

  public QueryOrganizerField findQueryOrganizerFieldbyId(Long id) {
    return queryOrganizerFieldDAO.findById(id);
  }

  public QueryOrganizerField findQueryTextFieldByMaterialAndName(Material material, String name) {
    return queryOrganizerFieldDAO.findByMaterialAndName(material, name);
  }

  public QueryOrganizerField updateQueryOrganizerField(Material material, MaterialField field, boolean removeAnswers) throws MaterialFieldMetaParsingExeption {
    ObjectMapper objectMapper = new ObjectMapper();
    OrganizerFieldMeta organizerFieldMeta;
    try {
      organizerFieldMeta = objectMapper.readValue(field.getContent(), OrganizerFieldMeta.class);
    } catch (IOException e) {
      throw new MaterialFieldMetaParsingExeption("Could not parse select field meta", e);
    }
    QueryOrganizerField queryField = queryOrganizerFieldDAO.findByMaterialAndName(material, organizerFieldMeta.getName());
    // -> fi.otavanopisto.muikku.plugins.workspace.QueryFieldChangeListener
    queryFieldUpdateEvent.fire(new QueryFieldUpdateEvent(queryField, field, removeAnswers));
    return queryField;
  }
  
  public void deleteQueryOrganizerField(QueryOrganizerField queryField, boolean removeAnswers) {
    queryFieldDeleteEvent.fire(new QueryFieldDeleteEvent(queryField, removeAnswers));
    queryOrganizerFieldDAO.delete(queryField);
  }

}
