package fi.muikku.plugins.material;

import java.io.Serializable;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLMappings;

import fi.muikku.controller.MaterialController;
import fi.muikku.dao.material.MaterialDAO;
import fi.muikku.model.material.Material;

@Named
@Stateful
@RequestScoped
@URLMappings(mappings = {
		@URLMapping(id = "material-index", pattern = "/material/#{materialViewBackingBean.mode}/#{materialViewBackingBean.materialUrlName}", viewId = "/materials/material.jsf")
})
public class MaterialViewBackingBean implements Serializable {
	private static final long serialVersionUID = -861390671231631613L;

	@Inject
	private MaterialController materialController;
	
	@Inject
	private MaterialDAO materialDAO;
	
	@PostConstruct
	public void init() {
	}
	
	private Material getMaterial() {
	  return materialDAO.findByUrlName(getMaterialUrlName());
	}
	
	public String getRenderedMaterial() {
	  switch (getMode()) {
	    case "view":
    	  return materialController.renderView(getMaterial());
	    case "edit":
    	  return materialController.renderEditor(getMaterial());
    	default:
    	  throw new IllegalStateException("Invalid mode");
	  }
	}

	public String getMaterialUrlName() {
    return materialUrlName;
  }
  public void setMaterialUrlName(String materialUrlName) {
    this.materialUrlName = materialUrlName;
  }

  public String getMode() {
    return mode;
  }
  public void setMode(String mode) {
    this.mode = mode;
  }

  private String materialUrlName;
  private String mode;
}
