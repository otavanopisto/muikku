package fi.muikku.plugins.material.controller;

import javax.enterprise.context.RequestScoped;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.controller.MaterialController;
import fi.muikku.dao.material.MaterialDAO;
import fi.muikku.model.material.Material;

@Named
@RequestScoped
public class HtmlMaterialBackingBean {
  
  @Inject
  MaterialDAO materialDAO;
  
  public String getCharacterData() {
    Long id = Long.parseLong(FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap().get("id"));
    return materialDAO.findById(id).getCharacterData();
  }
}
