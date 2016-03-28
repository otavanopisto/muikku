package fi.otavanopisto.muikku.plugins.material;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.dao.QueryFieldDAO;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectField;
import fi.otavanopisto.muikku.plugins.material.model.QueryField;
import fi.otavanopisto.muikku.plugins.material.model.QueryFileField;
import fi.otavanopisto.muikku.plugins.material.model.QueryMemoField;
import fi.otavanopisto.muikku.plugins.material.model.QueryMultiSelectField;
import fi.otavanopisto.muikku.plugins.material.model.QuerySelectField;
import fi.otavanopisto.muikku.plugins.material.model.QueryTextField;

@Stateless
@Dependent
public class QueryFieldController {

  @Inject
  private Logger logger;

  @Inject
  private QueryFieldDAO queryFieldDAO;

  @Inject
  private QueryConnectFieldController queryConnectFieldController;

  @Inject
  private QueryFileFieldController queryFileFieldController;

  @Inject
  private QueryMemoFieldController queryMemoFieldController;

  @Inject
  private QueryMultiSelectFieldController queryMultiSelectFieldController;

  @Inject
  private QuerySelectFieldController querySelectFieldController;

  @Inject
  private QueryTextFieldController queryTextFieldController;
  
  @Inject
  private Event<QueryFieldDeleteEvent> queryFieldDeleteEvent;
 
  /* QueryField */

  public QueryField findQueryFieldByMaterialAndName(Material material, String name) {
    return queryFieldDAO.findByMaterialAndName(material, name);
  }
  
  public List<QueryField> listQueryFieldsByMaterial(Material material) {
    return queryFieldDAO.listByMaterial(material);
  }

  public void deleteQueryField(QueryField queryField, boolean removeAnswers) {
    if (queryField instanceof QueryConnectField) {
      queryConnectFieldController.deleteQueryConnectField((QueryConnectField) queryField, removeAnswers);
    } else if (queryField instanceof QueryFileField) {
      queryFileFieldController.deleteQueryFileField((QueryFileField) queryField, removeAnswers);
    } else if (queryField instanceof QueryMemoField) {
      queryMemoFieldController.deleteQueryMemoField((QueryMemoField) queryField, removeAnswers);
    } else if (queryField instanceof QueryTextField) {
      queryTextFieldController.deleteQueryTextField((QueryTextField) queryField, removeAnswers);
    } else if (queryField instanceof QueryMultiSelectField) {
      queryMultiSelectFieldController.deleteQueryMultiSelectField((QueryMultiSelectField) queryField, removeAnswers);
    } else if (queryField instanceof QuerySelectField) {
      querySelectFieldController.deleteQuerySelectField((QuerySelectField) queryField, removeAnswers);
    } else {
      logger.log(Level.WARNING, "Did not recognize query field when deleting, falling back to default delete operation");
      queryFieldDeleteEvent.fire(new QueryFieldDeleteEvent(queryField, removeAnswers));
      queryFieldDAO.delete(queryField);
    }
  }

}
