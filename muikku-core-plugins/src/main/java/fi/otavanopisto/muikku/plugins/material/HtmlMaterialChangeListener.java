package fi.otavanopisto.muikku.plugins.material;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Event;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialCreateEvent;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialFieldCreateEvent;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialFieldDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialFieldUpdateEvent;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialUpdateEvent;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.material.model.QueryField;

@ApplicationScoped
public class HtmlMaterialChangeListener {
  
  @Inject
  private Event<HtmlMaterialFieldCreateEvent> htmlMaterialFieldCreateEvent;

  @Inject
  private Event<HtmlMaterialFieldUpdateEvent> htmlMaterialFieldUpdateEvent;

  @Inject
  private Event<HtmlMaterialFieldDeleteEvent> htmlMaterialFieldDeleteEvent;
  
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
  
  public void onHtmlMaterialUpdate(@Observes HtmlMaterialUpdateEvent event) {
    MaterialFieldCollection oldFieldCollection = new MaterialFieldCollection(event.getOldHtml());
    MaterialFieldCollection newFieldCollection = new MaterialFieldCollection(event.getNewHtml());

    // TODO Logic for determining whether answers may be removed for deleted and (heavily) modified fields
    
    List<MaterialField> removedFields = newFieldCollection.getRemovedFields(oldFieldCollection);
    for (MaterialField removedField : removedFields) {
      HtmlMaterialFieldDeleteEvent deleteEvent = new HtmlMaterialFieldDeleteEvent(event.getMaterial(), removedField, event.getRemoveAnswers());
      htmlMaterialFieldDeleteEvent.fire(deleteEvent);
    }
    
    List<MaterialField> updatedFields = newFieldCollection.getUpdatedFields(oldFieldCollection);
    for (MaterialField updatedField : updatedFields) {
      // awkward fix for #293; remove when implementing #305
      if (isSelectFieldChangingType(event.getMaterial(), updatedField)) {
        HtmlMaterialFieldDeleteEvent deleteEvent = new HtmlMaterialFieldDeleteEvent(event.getMaterial(), updatedField, event.getRemoveAnswers());
        htmlMaterialFieldDeleteEvent.fire(deleteEvent);
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

  public void onHtmlMaterialDelete(@Observes HtmlMaterialDeleteEvent event) {
    // TODO removeAnswers flag
    MaterialFieldCollection fieldCollection = new MaterialFieldCollection(event.getMaterial().getHtml());
    for (MaterialField deletedField : fieldCollection.getFields()) {
      HtmlMaterialFieldDeleteEvent deletedEvent = new HtmlMaterialFieldDeleteEvent(event.getMaterial(), deletedField, event.getRemoveAnswers());
      htmlMaterialFieldDeleteEvent.fire(deletedEvent);
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
