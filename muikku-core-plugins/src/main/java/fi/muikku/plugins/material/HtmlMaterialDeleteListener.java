package fi.muikku.plugins.material;

import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.plugins.material.events.HtmlMaterialDeleteEvent;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.model.QueryField;

@Stateless
public class HtmlMaterialDeleteListener {
  
  @Inject
  private QueryFieldController queryFieldController;
  
  public void onHtmlMaterialDelete(@Observes HtmlMaterialDeleteEvent htmlMaterialDeleteEvent) {
    HtmlMaterial htmlMaterial = htmlMaterialDeleteEvent.getMaterial();
    List<QueryField> queryFields = queryFieldController.listQueryFieldsByMaterial(htmlMaterial);
    for (QueryField queryField : queryFields) {
      queryFieldController.deleteQueryField(queryField);
    }
  }

}
