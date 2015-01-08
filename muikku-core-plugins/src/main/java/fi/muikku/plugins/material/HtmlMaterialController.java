package fi.muikku.plugins.material;

import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.foyt.coops.CoOpsConflictException;
import fi.foyt.coops.CoOpsInternalErrorException;
import fi.muikku.plugins.material.coops.CoOpsDiffAlgorithm;
import fi.muikku.plugins.material.coops.dao.HtmlMaterialRevisionDAO;
import fi.muikku.plugins.material.coops.model.HtmlMaterialRevision;
import fi.muikku.plugins.material.dao.HtmlMaterialDAO;
import fi.muikku.plugins.material.events.HtmlMaterialCreateEvent;
import fi.muikku.plugins.material.events.HtmlMaterialDeleteEvent;
import fi.muikku.plugins.material.events.HtmlMaterialUpdateEvent;
import fi.muikku.plugins.material.model.HtmlMaterial;

@Dependent
@Stateless
public class HtmlMaterialController {

  @Inject
  private HtmlMaterialDAO htmlMaterialDAO;
  
  @Inject
  private HtmlMaterialRevisionDAO htmlMaterialRevisionDAO;

  @Inject
  private Event<HtmlMaterialCreateEvent> materialCreateEvent;

  @Inject
  private Event<HtmlMaterialDeleteEvent> materialDeleteEvent;

  @Inject
  private Event<HtmlMaterialUpdateEvent> materialUpdateEvent;

  public HtmlMaterial createHtmlMaterial(String title, String html,
      String contentType, Long revisionNumber) {
    HtmlMaterial material = htmlMaterialDAO.create(title, html, contentType,
        revisionNumber);
    materialCreateEvent.fire(new HtmlMaterialCreateEvent(material));
    return material;
  }

  public HtmlMaterial findHtmlMaterialById(Long id) {
    return htmlMaterialDAO.findById(id);
  }

  public void deleteHtmlMaterial(HtmlMaterial htmlMaterial) {
    materialDeleteEvent.fire(new HtmlMaterialDeleteEvent(htmlMaterial));
    htmlMaterialDAO.delete(htmlMaterial);
  }
  
  public HtmlMaterial updateHtmlMaterialHtml(HtmlMaterial htmlMaterial, String html) {
    HtmlMaterialUpdateEvent event = new HtmlMaterialUpdateEvent(htmlMaterial, htmlMaterial.getHtml(), html);
    materialUpdateEvent.fire(event);
    return htmlMaterialDAO.updateData(htmlMaterial, html);
  }

  public HtmlMaterial updateHtmlMaterialRevisionNumber(HtmlMaterial htmlMaterial, Long revisionNumber) {
    return htmlMaterialDAO.updateRevisionNumber(htmlMaterial, revisionNumber);
  }
  
  public long lastHtmlMaterialRevision(HtmlMaterial htmlMaterial) {
    Long maxRevision = htmlMaterialRevisionDAO.maxRevisionByHtmlMaterial(htmlMaterial);
    if (maxRevision == null) {
      maxRevision = 0l;
    }
    return maxRevision;
  }

}
