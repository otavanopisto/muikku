package fi.otavanopisto.muikku.plugins.material;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.dao.HtmlMaterialDAO;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialCreateEvent;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialUpdateEvent;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.material.model.MaterialViewRestrict;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialContainsAnswersExeption;

@Dependent
public class HtmlMaterialController {

  @Inject
  private HtmlMaterialDAO htmlMaterialDAO;
  
  @Inject
  private Event<HtmlMaterialCreateEvent> materialCreateEvent;

  @Inject
  private Event<HtmlMaterialDeleteEvent> materialDeleteEvent;

  @Inject
  private Event<HtmlMaterialUpdateEvent> materialUpdateEvent;

  public HtmlMaterial createHtmlMaterial(String title, String html, String contentType, String license) {
    return createHtmlMaterial(title, html, contentType, null, license, MaterialViewRestrict.NONE);
  }

  public HtmlMaterial createHtmlMaterial(String title, String html, String contentType, HtmlMaterial originMaterial, String license, MaterialViewRestrict visibility) {
    HtmlMaterial material = htmlMaterialDAO.create(title, html, contentType, originMaterial, license, visibility);
    materialCreateEvent.fire(new HtmlMaterialCreateEvent(material));
    return material;
  }

  public HtmlMaterial findHtmlMaterialById(Long id) {
    return htmlMaterialDAO.findById(id);
  }

  public HtmlMaterial updateHtmlMaterialTitle(HtmlMaterial htmlMaterial, String title) {
    return htmlMaterialDAO.updateTitle(htmlMaterial, title);
  }

  public void deleteHtmlMaterial(HtmlMaterial htmlMaterial) {
    // TODO Logic for remove answers flag
    materialDeleteEvent.fire(new HtmlMaterialDeleteEvent(htmlMaterial, false));
    htmlMaterialDAO.delete(htmlMaterial);
  }

  public HtmlMaterial updateHtmlMaterialHtml(HtmlMaterial htmlMaterial, String html) throws WorkspaceMaterialContainsAnswersExeption {
    return updateHtmlMaterialHtml(htmlMaterial, html, false);
  }
  
  public HtmlMaterial updateHtmlMaterialHtml(HtmlMaterial htmlMaterial, String html, boolean removeAnswers) throws WorkspaceMaterialContainsAnswersExeption {
    try {
      HtmlMaterialUpdateEvent event = new HtmlMaterialUpdateEvent(htmlMaterial, htmlMaterial.getHtml(), html, removeAnswers);
      materialUpdateEvent.fire(event);
      return htmlMaterialDAO.updateData(htmlMaterial, html);
    }
    catch (Exception e) {
      Throwable cause = e;
      while (cause != null) {
        cause = cause.getCause();
        if (cause instanceof WorkspaceMaterialContainsAnswersExeption) {
          throw (WorkspaceMaterialContainsAnswersExeption) cause;
        }
      }
      throw e;
    }
  }

}
