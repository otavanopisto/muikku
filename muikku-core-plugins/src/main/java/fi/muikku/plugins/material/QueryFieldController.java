package fi.muikku.plugins.material;

import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.muikku.plugins.material.dao.QueryFieldDAO;
import fi.muikku.plugins.material.events.QueryFieldDeleteEvent;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryField;

@Stateless
@Dependent
public class QueryFieldController {

  @Inject
  private QueryFieldDAO queryFieldDAO;
  
  @Inject
  private Event<QueryFieldDeleteEvent> queryFieldDeleteEvent;
 
  /* QueryField */

  public QueryField findQueryFieldByMaterialAndName(Material material, String name) {
    return queryFieldDAO.findByMaterialAndName(material, name);
  }
  
  public List<QueryField> listQueryFieldsByMaterial(Material material) {
    return queryFieldDAO.listByMaterial(material);
  }

  public void deleteQueryField(QueryField queryField) {
    queryFieldDeleteEvent.fire(new QueryFieldDeleteEvent(queryField));
    queryFieldDAO.delete(queryField);
  }

}
