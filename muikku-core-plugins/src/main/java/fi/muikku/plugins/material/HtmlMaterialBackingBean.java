package fi.muikku.plugins.material;

import java.io.IOException;
import java.io.Serializable;

import javax.enterprise.context.RequestScoped;
import javax.faces.event.ActionEvent;
import javax.inject.Inject;
import javax.inject.Named;
import javax.xml.transform.TransformerException;
import javax.xml.xpath.XPathExpressionException;

import org.xml.sax.SAXException;

import fi.muikku.plugins.material.model.HtmlMaterial;

@Named
@RequestScoped
public class HtmlMaterialBackingBean implements Serializable {
  
  private static final long serialVersionUID = -1205161035039949658L;
  
  @Inject
  private HtmlMaterialController htmlMaterialController;
  
  public String renderMaterial(Long materialId) throws SAXException, IOException, XPathExpressionException, TransformerException {
    // TODO: Proper error handling
    
  	HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(materialId);
  	if (htmlMaterial != null) { 
  	  return htmlMaterialController.getSerializedHtmlDocument(htmlMaterial);
  	}
  	
  	return null;
  }
  
  public void save(ActionEvent event) {
    
  }
}
