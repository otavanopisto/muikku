package fi.muikku.plugins.settings;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.dao.material.MaterialDAO;
import fi.muikku.model.material.Material;

@Named
@RequestScoped
@Stateful
public class MaterialSettingsViewBackingBean {
  
  public static class MaterialProxy {
    
    public long getId() {
      return id;
    }
    public void setId(long id) {
      this.id = id;
    }
    public String getType() {
      return type;
    }
    public void setType(String type) {
      this.type = type;
    }
    public String getTitle() {
      return title;
    }
    public void setTitle(String title) {
      this.title = title;
    }
    public String getUrlName() {
      return urlName;
    }
    public void setUrlName(String urlName) {
      this.urlName = urlName;
    }

    private long id;
    private String type;
    private String title;
    private String urlName;
  }
  
  @Inject
  private MaterialDAO materialDAO;
  
  public List<MaterialProxy> getMaterials() {
    if (this.materialProxies == null) {
      this.materialProxies = new ArrayList<>();
      for (Material material : materialDAO.listAll()) {
        MaterialProxy materialProxy = new MaterialProxy();
        materialProxy.setId(material.getId());
        materialProxy.setType(material.getType());
        materialProxy.setTitle(material.getTitle());
        materialProxy.setUrlName(material.getUrlName());
        materialProxies.add(materialProxy);
      }
    }
    return materialProxies;
  }
  
  public void saveMaterials() {
    for (MaterialProxy materialProxy : materialProxies) {
      Material material = materialDAO.findById(materialProxy.getId());
      material.setType(materialProxy.getType());
      material.setTitle(materialProxy.getTitle());
    }
  }
  
  private List<MaterialProxy> materialProxies;
}
