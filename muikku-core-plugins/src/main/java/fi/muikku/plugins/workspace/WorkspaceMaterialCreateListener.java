package fi.muikku.plugins.workspace;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.xml.xpath.XPathExpressionException;

import org.xml.sax.SAXException;

import fi.muikku.plugins.material.MaterialQueryIntegrityExeption;
import fi.muikku.plugins.workspace.events.WorkspaceMaterialCreateEvent;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;

@Stateless
public class WorkspaceMaterialCreateListener {

  @Inject
  private Logger logger;

  @Inject
  private WorkspaceMaterialFieldController workspaceMaterialFieldController;
  
  public void onWorkspaceMaterialCreated(@Observes WorkspaceMaterialCreateEvent event) {
    try {
      WorkspaceMaterial workspaceMaterial = event.getWorkspaceNode();
      workspaceMaterialFieldController.createWorkspaceMaterialFields(workspaceMaterial.getId().toString(), workspaceMaterial);
    } catch (MaterialQueryIntegrityExeption | XPathExpressionException | SAXException | IOException e) {
      logger.log(Level.WARNING, "Could not create workspace material fields.", e);
    }
  }
  
  
}
