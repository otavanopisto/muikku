package fi.muikku.plugins.material;

import java.io.Serializable;

import javax.enterprise.context.RequestScoped;
import javax.faces.event.ActionEvent;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.plugins.material.model.HtmlMaterial;

@Named
@RequestScoped
public class HtmlMaterialBackingBean implements Serializable {
  
  private static final long serialVersionUID = -1205161035039949658L;
  
  @Inject
  private HtmlMaterialController htmlMaterialController;
  
  public String renderMaterial(Long materialId) {
  	HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(materialId);
  	if (htmlMaterial != null) { 
      return htmlMaterial.getHtml();
  	}
  	
  	return null;
  }
  
  public void save(ActionEvent event) {
    
  }
}
