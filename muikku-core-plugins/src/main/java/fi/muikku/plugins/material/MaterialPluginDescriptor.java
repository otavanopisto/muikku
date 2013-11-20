package fi.muikku.plugins.material;

import java.util.Arrays;
import java.util.List;

import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugins.material.dao.BinaryMaterialDAO;
import fi.muikku.plugins.material.dao.HtmlMaterialDAO;
import fi.muikku.plugins.material.dao.MaterialDAO;
import fi.muikku.plugins.material.dao.ReplyDAO;
import fi.muikku.plugins.material.model.BinaryMaterial;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.Reply;

public class MaterialPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor {

  @Override
  public String getName() {
    return "material";
  }

  @Override
  public void init() {
    
  }

  @Override
  public List<Class<?>> getBeans() {
    return Arrays.asList(new Class<?>[] {
      
      /* Controllers */
      
      BinaryMaterialController.class,
      HtmlMaterialController.class,
       
      /* DAOs */
      
      HtmlMaterialDAO.class,
      BinaryMaterialDAO.class,
      MaterialDAO.class,
      ReplyDAO.class
    });
  }

  @Override
  public Class<?>[] getEntities() {
    return new Class<?>[] {
      BinaryMaterial.class,
      HtmlMaterial.class,
      Material.class,
      Reply.class
    };
  }
}
