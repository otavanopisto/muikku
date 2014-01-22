package fi.muikku.plugins.workspace;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.DeserializationConfig.Feature;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.MaterialController;
import fi.muikku.plugins.material.MaterialQueryIntegrityExeption;
import fi.muikku.plugins.material.QueryFieldController;
import fi.muikku.plugins.material.fieldmeta.Field;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryField;
import fi.muikku.plugins.workspace.events.WorkspaceMaterialCreateEvent;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;

@Stateless
public class WorkspaceMaterialCreateListener {

  @Inject
  private Logger logger;
  
  @Inject
  private MaterialController materialController;

  @Inject
  private WorkspaceMaterialFieldController workspaceMaterialFieldController;

  @Inject
  private HtmlMaterialController htmlMaterialController;

  @Inject
  private QueryFieldController queryFieldController;
  
  public void onWorkspaceMaterialCreated(@Observes WorkspaceMaterialCreateEvent event) {
    List<String> assignedNames = new ArrayList<String>();
    WorkspaceMaterial workspaceMaterial = event.getWorkspaceNode();
    if (workspaceMaterial.getMaterial() instanceof HtmlMaterial) {
      HtmlMaterial htmlMaterial = (HtmlMaterial) workspaceMaterial.getMaterial();
      try {
        Document document = htmlMaterialController.getProcessedHtmlDocument(htmlMaterial);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
  
        NodeList objectNodeList = (NodeList) XPathFactory.newInstance().newXPath().evaluate("//OBJECT", document, XPathConstants.NODESET);
        for (int i = 0, l = objectNodeList.getLength(); i < l; i++) {
          Element objectElement = (Element) objectNodeList.item(i);
          if (objectElement.hasAttribute("type")) {
            String content = (String) XPathFactory.newInstance().newXPath().evaluate("PARAM[@name=\"content\"]/@value", objectElement, XPathConstants.STRING);
            String embedId = objectElement.getAttribute("data-embed-id");
            Material fieldMaterial = null;
            Field field = objectMapper.readValue(content, Field.class);
            
            if (StringUtils.isNotBlank(embedId)) {
              String[] embedIds = embedId.split(":");
              fieldMaterial = materialController.findMaterialById(NumberUtils.createLong(embedIds[embedIds.length - 1]));
            } else {
              fieldMaterial = htmlMaterial; 
            }
            
            if (fieldMaterial == null) {
              throw new MaterialQueryIntegrityExeption("EmbedId " + embedId + " points to non-existing material");
            }
            
            QueryField queryField = queryFieldController.findQueryFieldByMaterialAndName(fieldMaterial, field.getName());
            String assignedName = workspaceMaterialFieldController.getAssignedFieldName(workspaceMaterial.getId().toString(), embedId, field.getName(), assignedNames);
            assignedNames.add(assignedName);
            String fieldName = DigestUtils.md5Hex(assignedName);
            
            workspaceMaterialFieldController.createWorkspaceMaterialField(fieldName, queryField, workspaceMaterial);
          }
        }
        
      } catch (SAXException | IOException | XPathExpressionException | MaterialQueryIntegrityExeption e) {
        logger.log(Level.WARNING, "Could not create workspace material fields.", e);
      }
    }
  }
  
}
