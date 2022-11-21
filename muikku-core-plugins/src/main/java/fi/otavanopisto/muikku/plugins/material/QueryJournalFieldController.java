package fi.otavanopisto.muikku.plugins.material;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.dao.QueryJournalFieldDAO;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryJournalField;

@Dependent
public class QueryJournalFieldController {

  @Inject
  private QueryJournalFieldDAO queryJournalFieldDAO;
  
  @Inject
  private Event<QueryFieldDeleteEvent> queryFieldDeleteEvent;

  public QueryJournalField createQueryJournalField(Material material, String name) {
    return queryJournalFieldDAO.create(material, name);
  }

  public QueryJournalField findQueryJournalFieldbyId(Long id) {
    return queryJournalFieldDAO.findById(id);
  }

  public QueryJournalField findQueryJournalFieldByMaterialAndName(Material material, String name) {
    return queryJournalFieldDAO.findByMaterialAndName(material, name);
  }

  public void deleteQueryJournalField(QueryJournalField queryField, boolean removeAnswers) {
    queryFieldDeleteEvent.fire(new QueryFieldDeleteEvent(queryField, removeAnswers));
    queryJournalFieldDAO.delete(queryField);
  }

}
