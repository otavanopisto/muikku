package fi.muikku.plugins.material.controller;

import java.io.Serializable;

import javax.enterprise.context.SessionScoped;
import javax.faces.component.UIInput;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.dao.material.MaterialDAO;
import fi.muikku.model.material.Material;
import fi.muikku.utils.RequestUtils;

@Named
@SessionScoped // TODO: Fix
public class HtmlMaterialBackingBean implements Serializable {
  
  /**
   * 
   */
  private static final long serialVersionUID = -8854575905725917771L;
  
  @Inject
  MaterialDAO materialDAO;
  
  public String getCharacterData() {
    // We can't inspect the material ID earlier, because it's lazily evaluated
    if (characterData == null) {
      materialId = Long.parseLong(materialIdInput.getValue().toString());
      characterData = materialDAO.findById(materialId).getCharacterData();
    }
    return characterData;
  }
  
  public void setCharacterData(String characterData) {
    this.characterData = characterData;
  }
  
  public UIInput getMaterialIdInput() {
    return materialIdInput;
  }

  public void setMaterialIdInput(UIInput materialIdInput) {
    this.materialIdInput = materialIdInput;
  }
  
  public void updateMaterial() {
    Material material = materialDAO.findById(materialId);
    materialDAO.updateCharacterData(material, characterData);
    
    RequestUtils.getViewIdWithRedirect(FacesContext.getCurrentInstance().getViewRoot().getViewId());
  }

  private UIInput materialIdInput; 
  private long materialId;
  private String characterData;
}
