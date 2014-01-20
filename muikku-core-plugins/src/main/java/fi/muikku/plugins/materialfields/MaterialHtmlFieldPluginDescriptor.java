package fi.muikku.plugins.materialfields;

import java.util.Arrays;
import java.util.List;

import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugins.material.dao.QueryConnectFieldCounterpartDAO;
import fi.muikku.plugins.material.dao.QueryConnectFieldDAO;
import fi.muikku.plugins.material.dao.QueryConnectFieldTermDAO;
import fi.muikku.plugins.material.dao.QueryDrawFieldDAO;
import fi.muikku.plugins.material.dao.QueryFieldDAO;
import fi.muikku.plugins.material.dao.QuerySelectFieldDAO;
import fi.muikku.plugins.material.dao.QuerySelectFieldOptionDAO;
import fi.muikku.plugins.material.dao.QueryTextFieldDAO;
import fi.muikku.plugins.material.model.QueryConnectField;
import fi.muikku.plugins.material.model.QueryConnectFieldCounterpart;
import fi.muikku.plugins.material.model.QueryConnectFieldOption;
import fi.muikku.plugins.material.model.QueryConnectFieldTerm;
import fi.muikku.plugins.material.model.QueryDrawField;
import fi.muikku.plugins.material.model.QueryField;
import fi.muikku.plugins.material.model.QuerySelectField;
import fi.muikku.plugins.material.model.QuerySelectFieldOption;
import fi.muikku.plugins.material.model.QueryTextField;

public class MaterialHtmlFieldPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor {

  @Override
  public String getName() {
    return "materialhtmlfield";
  }

  @Override
  public void init() {
    
  }

  @Override
  public List<Class<?>> getBeans() {
    return Arrays.asList(new Class<?>[] {
        
      HtmlMaterialFieldListeners.class,
      
      /** DAOs **/
      
      
      
    });
  }

  @Override
  public Class<?>[] getEntities() {
    return new Class<?>[] {
        ,
    };
  }
}
