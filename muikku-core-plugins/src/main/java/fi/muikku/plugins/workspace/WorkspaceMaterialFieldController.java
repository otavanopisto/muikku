package fi.muikku.plugins.workspace;

import java.io.IOException;
import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.apache.commons.lang3.math.NumberUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.MaterialController;
import fi.muikku.plugins.material.MaterialQueryIntegrityExeption;
import fi.muikku.plugins.material.QueryFieldController;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryField;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialFieldDAO;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;

@Stateless
@Dependent
public class WorkspaceMaterialFieldController {

  @Inject
  private HtmlMaterialController htmlMaterialController;
  
  @Inject
  private QueryFieldController queryFieldController;
  
  @Inject
  private MaterialController materialController;
  
  @Inject
  private WorkspaceMaterialFieldDAO workspaceMaterialFieldDAO;
  
  public List<WorkspaceMaterialField> findWorkspaceMaterialFieldsByMaterial(WorkspaceMaterial material){
    return workspaceMaterialFieldDAO.findMaterialFieldByMaterial(material);
  }

  public List<WorkspaceMaterialField> listWorkspaceMaterialFieldsByWorkspaceMaterial(WorkspaceMaterial workspaceMaterial) {
    return workspaceMaterialFieldDAO.listByWorkspaceMaterial(workspaceMaterial);
  }
  
  public void createWorkspaceMaterialFields(String fieldPrefix, WorkspaceMaterial workspaceMaterial) throws SAXException, IOException, XPathExpressionException, MaterialQueryIntegrityExeption {
    if (workspaceMaterial.getMaterial() instanceof HtmlMaterial) {
      HtmlMaterial htmlMaterial = (HtmlMaterial) workspaceMaterial.getMaterial();
      
      Document htmlDocument = htmlMaterialController.getProcessedHtmlDocument(fieldPrefix, htmlMaterial);
      NodeList formFieldNodes = (NodeList) XPathFactory.newInstance().newXPath().evaluate("//INPUT|//TEXTAREA|//SELECT", htmlDocument, XPathConstants.NODESET);
      htmlMaterialController.assignMaterialFieldNames(formFieldNodes, fieldPrefix, true);
      
      for (int i = 0, l = formFieldNodes.getLength(); i < l; i++) {
        if (formFieldNodes.item(i) instanceof Element) {
          Element formFieldElement = (Element) formFieldNodes.item(i);
          String unencodedName = formFieldElement.getAttribute("data-unencoded-name");
          String encodedName = formFieldElement.getAttribute("name");

          String[] nameParts = unencodedName.split(":");
          String fieldName = nameParts[nameParts.length - 2];
          Material fieldMaterial = null;
          
          if (nameParts.length > 3) {
            Long fieldMaterialId = NumberUtils.createLong(nameParts[nameParts.length - 3]);
            Material material = materialController.findMaterialById(fieldMaterialId);
            if (material == null) {
              throw new MaterialQueryIntegrityExeption("Embedded field " + unencodedName + " points to non-existing material");
            }

            fieldMaterial = material;
          } else {
            fieldMaterial = htmlMaterial;
          }
         
          QueryField queryField = queryFieldController.findQueryTextFieldByMaterialAndName(fieldMaterial, fieldName); 
          if (queryField == null) {
            throw new MaterialQueryIntegrityExeption("Material #" + fieldMaterial.getId() + " does not contain field '" + fieldName + "'");
          }
          
          if (workspaceMaterialFieldDAO.findMaterialFieldByWorkspaceMaterialAndName(workspaceMaterial, encodedName) == null) {
            workspaceMaterialFieldDAO.create(encodedName, queryField, workspaceMaterial);
          }
        }
      }
    }
  }
  
}
