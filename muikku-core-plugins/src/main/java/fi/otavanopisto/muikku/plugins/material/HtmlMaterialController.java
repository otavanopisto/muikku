package fi.otavanopisto.muikku.plugins.material;

import java.util.List;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.material.dao.HtmlMaterialDAO;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialCreateEvent;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialUpdateEvent;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.material.model.MaterialViewRestrict;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialContainsAnswersExeption;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialReplyDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.users.UserEntityController;

@Dependent
public class HtmlMaterialController {

  @Inject
  private HtmlMaterialDAO htmlMaterialDAO;
  
  @Inject
  private WorkspaceMaterialDAO workspaceMaterialDAO;

  @Inject
  private WorkspaceMaterialReplyDAO workspaceMaterialReplyDAO;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private Event<HtmlMaterialCreateEvent> materialCreateEvent;

  @Inject
  private Event<HtmlMaterialUpdateEvent> materialUpdateEvent;

  public HtmlMaterial createHtmlMaterial(String title, String html, String contentType, String license) {
    return createHtmlMaterial(title, html, contentType, license, MaterialViewRestrict.NONE);
  }

  public HtmlMaterial createHtmlMaterial(String title, String html, String contentType, String license, MaterialViewRestrict visibility) {
    HtmlMaterial material = htmlMaterialDAO.create(title, html, contentType, license, visibility);
    materialCreateEvent.fire(new HtmlMaterialCreateEvent(material));
    return material;
  }

  public HtmlMaterial findHtmlMaterialById(Long id) {
    return htmlMaterialDAO.findById(id);
  }

  public HtmlMaterial updateHtmlMaterialTitle(HtmlMaterial htmlMaterial, String title) {
    return htmlMaterialDAO.updateTitle(htmlMaterial, title);
  }

  public HtmlMaterial updateHtmlMaterialHtml(HtmlMaterial htmlMaterial, String html) throws WorkspaceMaterialContainsAnswersExeption {
    return updateHtmlMaterialHtml(htmlMaterial, html, false);
  }
  
  public boolean hasStudentAnswers(HtmlMaterial htmlMaterial) {
    List<WorkspaceMaterial> workspaceMaterials = workspaceMaterialDAO.listByMaterialId(htmlMaterial.getId());
    for (WorkspaceMaterial workspaceMaterial : workspaceMaterials) {
      List<WorkspaceMaterialReply> replies = workspaceMaterialReplyDAO.listByWorkspaceMaterial(workspaceMaterial);
      for (WorkspaceMaterialReply reply : replies) {
        UserEntity userEntity = userEntityController.findUserEntityById(reply.getUserEntityId());
        if (userEntityController.isStudent(userEntity)) {
          return true;
        }
      }
    }
    return false;
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
