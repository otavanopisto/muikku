package fi.muikku.plugins.material;

import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.plugins.material.events.HtmlMaterialDeleteEvent;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.model.QueryField;
import fi.muikku.plugins.material.model.QuerySelectField;
import fi.muikku.plugins.material.model.QuerySelectFieldOption;

@Stateless
public class HtmlMaterialDeleteListener {
  
  @Inject
  private QueryFieldController queryFieldController;
  
  @Inject
  private QuerySelectFieldController querySelectFieldController;
  
  public void onHtmlMaterialDelete(@Observes HtmlMaterialDeleteEvent htmlMaterialDeleteEvent) {
    HtmlMaterial htmlMaterial = htmlMaterialDeleteEvent.getMaterial();
    List<QueryField> queryFields = queryFieldController.listQueryFieldsByMaterial(htmlMaterial);
    for (QueryField queryField : queryFields) {
      deleteQueryField(queryField);
    }
  }

  public void deleteQueryField(QueryField queryField) {
    if (queryField instanceof QuerySelectField) {
      List<QuerySelectFieldOption> options = querySelectFieldController.listQuerySelectFieldOptionsBySelectField((QuerySelectField) queryField);
      for (QuerySelectFieldOption option : options) {
        querySelectFieldController.deleteQuerySelectFieldOption(option);
      }
    } 

    queryFieldController.deleteQueryField(queryField);
  }

}
