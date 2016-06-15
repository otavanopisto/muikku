package fi.otavanopisto.muikku.plugins.material;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.dao.QueryAudioFieldDAO;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryAudioField;

@Dependent
public class QueryAudioFieldController {

  @Inject
  private QueryAudioFieldDAO queryAudioFieldDAO;
  
  @Inject
  private Event<QueryFieldDeleteEvent> queryFieldDeleteEvent;

  public QueryAudioField createQueryAudioField(Material material, String name) {
    return queryAudioFieldDAO.create(material, name);
  }

  public QueryAudioField findQueryAudioFieldbyId(Long id) {
    return queryAudioFieldDAO.findById(id);
  }

  public QueryAudioField findQueryAudioFieldByMaterialAndName(Material material, String name) {
    return queryAudioFieldDAO.findByMaterialAndName(material, name);
  }

  public void deleteQueryAudioField(QueryAudioField queryField, boolean removeAnswers) {
    queryFieldDeleteEvent.fire(new QueryFieldDeleteEvent(queryField, removeAnswers));
    queryAudioFieldDAO.delete(queryField);
  }

}
