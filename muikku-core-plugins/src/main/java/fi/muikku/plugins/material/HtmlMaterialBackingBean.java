package fi.muikku.plugins.material;

import java.io.Serializable;

import javax.faces.event.ActionEvent;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.plugins.material.dao.HtmlMaterialDAO;
import fi.muikku.plugins.material.model.HtmlMaterial;

@Named
public class HtmlMaterialBackingBean implements Serializable {
  
  /**
   * 
   */
  private static final long serialVersionUID = -1205161035039949658L;
  
  @Inject
  HtmlMaterialDAO htmlMaterialDAO;
  
  public String renderMaterial(Long materialId) {
    return getMaterial(materialId).getCharacterData();
  }
  
  public HtmlMaterial getMaterial(Long materialId) {
    return htmlMaterialDAO.findById(materialId);
  }
  
  public void save(ActionEvent event) {
    
  }
}
