package fi.muikku.plugins.material;

import java.io.Serializable;

import javax.faces.event.ActionEvent;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.dao.material.MaterialDAO;
import fi.muikku.model.material.Material;

@Named
public class HtmlMaterialBackingBean implements Serializable {
  
  @Inject
  MaterialDAO materialDAO;
  
  public String renderMaterial(Long materialId) {
    return materialDAO.findById(materialId).getCharacterData();
  }
  
  public Material getMaterial(Long materialId) {
    return materialDAO.findById(materialId);
  }
  
  public void save(ActionEvent event) {
    
  }
}
