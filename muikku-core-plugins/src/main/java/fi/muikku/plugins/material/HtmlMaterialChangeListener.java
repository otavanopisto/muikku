package fi.muikku.plugins.material;

import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.event.Event;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.plugins.material.events.HtmlMaterialCreateEvent;
import fi.muikku.plugins.material.events.HtmlMaterialDeleteEvent;
import fi.muikku.plugins.material.events.HtmlMaterialFieldCreateEvent;
import fi.muikku.plugins.material.events.HtmlMaterialFieldDeleteEvent;
import fi.muikku.plugins.material.events.HtmlMaterialFieldUpdateEvent;
import fi.muikku.plugins.material.events.HtmlMaterialUpdateEvent;

@Stateless
public class HtmlMaterialChangeListener {
  
  @Inject
  private Event<HtmlMaterialFieldCreateEvent> htmlMaterialFieldCreateEvent;

  @Inject
  private Event<HtmlMaterialFieldUpdateEvent> htmlMaterialFieldUpdateEvent;

  @Inject
  private Event<HtmlMaterialFieldDeleteEvent> htmlMaterialFieldDeleteEvent;

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
      HtmlMaterialFieldUpdateEvent updatedEvent = new HtmlMaterialFieldUpdateEvent(event.getMaterial(), updatedField, event.getRemoveAnswers());
      htmlMaterialFieldUpdateEvent.fire(updatedEvent);
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

}
