package fi.otavanopisto.muikku.plugins.material;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Event;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialCreateEvent;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialFieldCreateEvent;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialFieldUpdateEvent;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialUpdateEvent;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.material.model.QueryField;
import fi.otavanopisto.muikku.plugins.workspace.MaterialDeleteController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialContainsAnswersExeption;

@ApplicationScoped
public class HtmlMaterialChangeListener {
  
  @Inject
  private MaterialDeleteController materialDeleteController;
  
  @Inject
  private Event<HtmlMaterialFieldCreateEvent> htmlMaterialFieldCreateEvent;

  @Inject
  private Event<HtmlMaterialFieldUpdateEvent> htmlMaterialFieldUpdateEvent;

  @Inject
  private QueryFieldController queryFieldController;

  @Inject
  private QuerySelectFieldController querySelectFieldController;

  @Inject
  private QueryMultiSelectFieldController queryMultiSelectFieldController;
  
  public void onHtmlMaterialCreated(@Observes HtmlMaterialCreateEvent event) {
    MaterialFieldCollection fieldCollection = new MaterialFieldCollection(event.getMaterial().getHtml());
    for (MaterialField newField : fieldCollection.getFields()) {
      HtmlMaterialFieldCreateEvent createEvent = new HtmlMaterialFieldCreateEvent(event.getMaterial(), newField);
      htmlMaterialFieldCreateEvent.fire(createEvent);
    }
  }

  // HtmlMaterialUpdate
  // HtmlMaterialFieldXXXEvent -> HtmlMaterialFieldChangeListener
  // QueryFieldXXXEvent -> QueryFieldChangeListener
  // WorkspaceMaterialFieldXXXEvent -> WorkspaceMaterialFieldChangeListener
  
  // TODO Maybe one day refactor HTML material updating to not rely on events, too?
  public void onHtmlMaterialUpdate(@Observes HtmlMaterialUpdateEvent event) throws WorkspaceMaterialContainsAnswersExeption {
    MaterialFieldCollection oldFieldCollection = new MaterialFieldCollection(event.getOldHtml());
    MaterialFieldCollection newFieldCollection = new MaterialFieldCollection(event.getNewHtml());
    
    // #6539: If database contains fields that are not present in oldFieldCollection, they have to be removed
    // in order for the new fields to be processed correctly. This only happens if the material html has been
    // directly updated to the database in a way that has removed fields that were originally present
    
    List<QueryField> oldFieldsInDb = queryFieldController.listQueryFieldsByMaterial(event.getMaterial());
    for (QueryField oldFieldInDb : oldFieldsInDb) {
      if (!oldFieldCollection.hasField(oldFieldInDb.getName())) {
        materialDeleteController.deleteQueryField(oldFieldInDb, event.getRemoveAnswers());
      }
    }

    // TODO Logic for determining whether answers may be removed for deleted and (heavily) modified fields
    
    List<MaterialField> removedFields = newFieldCollection.getRemovedFields(oldFieldCollection);
    for (MaterialField removedField : removedFields) {
      QueryField queryField = queryFieldController.findQueryFieldByMaterialAndName(event.getMaterial(), removedField.getName());
      materialDeleteController.deleteQueryField(queryField, event.getRemoveAnswers());
    }
    
    List<MaterialField> updatedFields = newFieldCollection.getUpdatedFields(oldFieldCollection);
    for (MaterialField updatedField : updatedFields) {
      // awkward fix for #293; remove when implementing #305
      if (isSelectFieldChangingType(event.getMaterial(), updatedField)) {
        QueryField field = queryFieldController.findQueryFieldByMaterialAndName(event.getMaterial(), updatedField.getName());
        materialDeleteController.deleteQueryField(field, event.getRemoveAnswers());
        HtmlMaterialFieldCreateEvent createEvent = new HtmlMaterialFieldCreateEvent(event.getMaterial(), updatedField);
        htmlMaterialFieldCreateEvent.fire(createEvent);
      }
      else {
        HtmlMaterialFieldUpdateEvent updatedEvent = new HtmlMaterialFieldUpdateEvent(event.getMaterial(), updatedField, event.getRemoveAnswers());
        htmlMaterialFieldUpdateEvent.fire(updatedEvent);
      }
    }
    
    List<MaterialField> newFields = newFieldCollection.getNewFields(oldFieldCollection);
    for (MaterialField newField : newFields) {
      HtmlMaterialFieldCreateEvent createEvent = new HtmlMaterialFieldCreateEvent(event.getMaterial(), newField);
      htmlMaterialFieldCreateEvent.fire(createEvent);
    }
    
  }

  private boolean isSelectFieldChangingType(HtmlMaterial material, MaterialField field) {
    String type = field.getType();
    if ("application/vnd.muikku.field.select".equals(type)) {
      QueryField oldField = queryMultiSelectFieldController.findQueryMultiSelectFieldByMaterialAndName(material, field.getName());
      return oldField != null;
    }
    else if ("application/vnd.muikku.field.multiselect".equals(type)) {
      QueryField oldField = querySelectFieldController.findQuerySelectFieldByMaterialAndName(material, field.getName());
      return oldField != null;
    }
    return false;
  }

}
