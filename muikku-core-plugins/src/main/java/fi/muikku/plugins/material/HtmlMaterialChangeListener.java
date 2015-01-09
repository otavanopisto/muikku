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
  private Event<HtmlMaterialFieldCreateEvent> htmlMaterialFieldCreatedEvent;

  @Inject
  private Event<HtmlMaterialFieldUpdateEvent> htmlMaterialFieldUpdatedEvent;

  @Inject
  private Event<HtmlMaterialFieldDeleteEvent> htmlMaterialFieldDeletedEvent;

  public void onHtmlMaterialCreated(@Observes HtmlMaterialCreateEvent event) {
    MaterialFieldCollection fieldCollection = new MaterialFieldCollection(event.getMaterial().getHtml());
    for (MaterialField newField : fieldCollection.getFields()) {
      HtmlMaterialFieldCreateEvent createEvent = new HtmlMaterialFieldCreateEvent(event.getMaterial(), newField);
      htmlMaterialFieldCreatedEvent.fire(createEvent);
    }
  }

  public void onHtmlMaterialUpdate(@Observes HtmlMaterialUpdateEvent event) {
    MaterialFieldCollection oldFieldCollection = new MaterialFieldCollection(event.getOldHtml());
    MaterialFieldCollection newFieldCollection = new MaterialFieldCollection(event.getNewHtml());

    List<MaterialField> removedFields = newFieldCollection.getRemovedFields(oldFieldCollection);
    for (MaterialField removedField : removedFields) {
      HtmlMaterialFieldDeleteEvent deleteEvent = new HtmlMaterialFieldDeleteEvent(event.getMaterial(), removedField);
      htmlMaterialFieldDeletedEvent.fire(deleteEvent);
    }
    
    List<MaterialField> updatedFields = newFieldCollection.getUpdatedFields(oldFieldCollection);
    for (MaterialField updatedField : updatedFields) {
      HtmlMaterialFieldUpdateEvent updatedEvent = new HtmlMaterialFieldUpdateEvent(event.getMaterial(), updatedField);
      htmlMaterialFieldUpdatedEvent.fire(updatedEvent);
    }
    
    List<MaterialField> newFields = newFieldCollection.getNewFields(oldFieldCollection);
    for (MaterialField newField : newFields) {
      HtmlMaterialFieldCreateEvent createEvent = new HtmlMaterialFieldCreateEvent(event.getMaterial(), newField);
      htmlMaterialFieldCreatedEvent.fire(createEvent);
    }
    
  }

  public void onHtmlMaterialDelete(@Observes HtmlMaterialDeleteEvent event) {
    MaterialFieldCollection fieldCollection = new MaterialFieldCollection(event.getMaterial().getHtml());
    for (MaterialField deletedField : fieldCollection.getFields()) {
      HtmlMaterialFieldDeleteEvent deletedEvent = new HtmlMaterialFieldDeleteEvent(event.getMaterial(), deletedField);
      htmlMaterialFieldDeletedEvent.fire(deletedEvent);
    }
  }
}
