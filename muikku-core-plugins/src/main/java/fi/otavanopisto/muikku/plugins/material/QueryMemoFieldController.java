package fi.otavanopisto.muikku.plugins.material;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.dao.QueryMemoFieldDAO;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryMemoField;

@Stateless
@Dependent
public class QueryMemoFieldController {

  @Inject
  private QueryMemoFieldDAO queryMemoFieldDAO;
  
  @Inject
  private Event<QueryFieldDeleteEvent> queryFieldDeleteEvent;

  public QueryMemoField createQueryMemoField(Material material, String name) {
    return queryMemoFieldDAO.create(material, name);
  }

  public QueryMemoField findQueryMemoFieldbyId(Long id) {
    return queryMemoFieldDAO.findById(id);
  }

  public QueryMemoField findQueryMemoFieldByMaterialAndName(Material material, String name) {
    return queryMemoFieldDAO.findByMaterialAndName(material, name);
  }

  public void deleteQueryMemoField(QueryMemoField queryField, boolean removeAnswers) {
    queryFieldDeleteEvent.fire(new QueryFieldDeleteEvent(queryField, removeAnswers));
    queryMemoFieldDAO.delete(queryField);
  }

}
