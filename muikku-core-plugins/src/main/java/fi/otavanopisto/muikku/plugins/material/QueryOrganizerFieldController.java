package fi.otavanopisto.muikku.plugins.material;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.dao.QueryOrganizerFieldDAO;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryOrganizerField;

@Dependent
public class QueryOrganizerFieldController {

  @Inject
  private QueryOrganizerFieldDAO queryOrganizerFieldDAO;
  
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

  public void deleteQueryOrganizerField(QueryOrganizerField queryField, boolean removeAnswers) {
    queryFieldDeleteEvent.fire(new QueryFieldDeleteEvent(queryField, removeAnswers));
    queryOrganizerFieldDAO.delete(queryField);
  }

}
