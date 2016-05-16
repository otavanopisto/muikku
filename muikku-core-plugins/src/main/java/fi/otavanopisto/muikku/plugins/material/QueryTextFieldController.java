package fi.otavanopisto.muikku.plugins.material;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.dao.QueryTextFieldDAO;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryTextField;

@Dependent
public class QueryTextFieldController {

  @Inject
  private QueryTextFieldDAO queryTextFieldDAO;
  
  @Inject
  private Event<QueryFieldDeleteEvent> queryFieldDeleteEvent;

  public QueryTextField createQueryTextField(Material material, String name) {
    return queryTextFieldDAO.create(material, name);
  }

  public QueryTextField findQueryTextFieldbyId(Long id) {
    return queryTextFieldDAO.findById(id);
  }

  public QueryTextField findQueryTextFieldByMaterialAndName(Material material, String name) {
    return queryTextFieldDAO.findByMaterialAndName(material, name);
  }

  public void deleteQueryTextField(QueryTextField queryField, boolean removeAnswers) {
    queryFieldDeleteEvent.fire(new QueryFieldDeleteEvent(queryField, removeAnswers));
    queryTextFieldDAO.delete(queryField);
  }

}
