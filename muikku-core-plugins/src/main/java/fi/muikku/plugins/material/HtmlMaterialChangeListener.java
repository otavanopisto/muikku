package fi.muikku.plugins.material;

import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.event.Event;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.plugins.material.events.HtmlMaterialCreateEvent;
import fi.muikku.plugins.material.events.HtmlMaterialDeleteEvent;
import fi.muikku.plugins.material.events.HtmlMaterialFieldCreated;
import fi.muikku.plugins.material.events.HtmlMaterialFieldDeleted;
import fi.muikku.plugins.material.events.HtmlMaterialFieldUpdated;
import fi.muikku.plugins.material.events.HtmlMaterialUpdateEvent;

@Stateless
public class HtmlMaterialChangeListener {
  
  @Inject
  private Event<HtmlMaterialFieldCreated> htmlMaterialFieldCreatedEvent;

  @Inject
  private Event<HtmlMaterialFieldUpdated> htmlMaterialFieldUpdatedEvent;

  @Inject
  private Event<HtmlMaterialFieldDeleted> htmlMaterialFieldDeletedEvent;

  public void onHtmlMaterialCreated(@Observes HtmlMaterialCreateEvent event) {
    MaterialFieldCollection fieldCollection = new MaterialFieldCollection(event.getMaterial().getHtml());
    for (MaterialField newField : fieldCollection.getFields()) {
      HtmlMaterialFieldCreated createEvent = new HtmlMaterialFieldCreated(event.getMaterial(), newField);
      htmlMaterialFieldCreatedEvent.fire(createEvent);
    }
  }

  public void onHtmlMaterialUpdate(@Observes HtmlMaterialUpdateEvent event) {
    MaterialFieldCollection oldFieldCollection = new MaterialFieldCollection(event.getOldHtml());
    MaterialFieldCollection newFieldCollection = new MaterialFieldCollection(event.getNewHtml());

    List<MaterialField> removedFields = newFieldCollection.getRemovedFields(oldFieldCollection);
    for (MaterialField removedField : removedFields) {
      HtmlMaterialFieldDeleted deleteEvent = new HtmlMaterialFieldDeleted(event.getMaterial(), removedField);
      htmlMaterialFieldDeletedEvent.fire(deleteEvent);
    }
    
    List<MaterialField> updatedFields = newFieldCollection.getUpdatedFields(oldFieldCollection);
    for (MaterialField updatedField : updatedFields) {
      HtmlMaterialFieldUpdated updatedEvent = new HtmlMaterialFieldUpdated(event.getMaterial(), updatedField);
      htmlMaterialFieldUpdatedEvent.fire(updatedEvent);
    }
    
    List<MaterialField> newFields = newFieldCollection.getNewFields(oldFieldCollection);
    for (MaterialField newField : newFields) {
      HtmlMaterialFieldCreated createEvent = new HtmlMaterialFieldCreated(event.getMaterial(), newField);
      htmlMaterialFieldCreatedEvent.fire(createEvent);
    }
    
  }

  public void onHtmlMaterialDelete(@Observes HtmlMaterialDeleteEvent event) {
    MaterialFieldCollection fieldCollection = new MaterialFieldCollection(event.getMaterial().getHtml());
    for (MaterialField deletedField : fieldCollection.getFields()) {
      HtmlMaterialFieldDeleted deletedEvent = new HtmlMaterialFieldDeleted(event.getMaterial(), deletedField);
      htmlMaterialFieldDeletedEvent.fire(deletedEvent);
    }
  }
}
