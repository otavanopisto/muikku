package fi.muikku.plugins.material;

import java.util.Arrays;
import java.util.List;

import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugins.material.dao.BinaryMaterialDAO;
import fi.muikku.plugins.material.dao.HtmlMaterialDAO;
import fi.muikku.plugins.material.dao.MaterialDAO;
import fi.muikku.plugins.material.dao.QueryChecklistFieldDAO;
import fi.muikku.plugins.material.dao.QueryChecklistFieldOptionDAO;
import fi.muikku.plugins.material.dao.QueryConnectFieldCounterpartDAO;
import fi.muikku.plugins.material.dao.QueryConnectFieldDAO;
import fi.muikku.plugins.material.dao.QueryConnectFieldTermDAO;
import fi.muikku.plugins.material.dao.QueryFieldDAO;
import fi.muikku.plugins.material.dao.QueryFileFieldDAO;
import fi.muikku.plugins.material.dao.QuerySelectFieldDAO;
import fi.muikku.plugins.material.dao.QuerySelectFieldOptionDAO;
import fi.muikku.plugins.material.dao.QueryTextFieldDAO;
import fi.muikku.plugins.material.fieldprocessing.ChecklistFieldMaterialFieldProcessor;
import fi.muikku.plugins.material.fieldprocessing.ConnectFieldMaterialFieldProcessor;
import fi.muikku.plugins.material.fieldprocessing.FileFieldMaterialFieldProcessor;
import fi.muikku.plugins.material.fieldprocessing.MemoFieldMaterialFieldProcessor;
import fi.muikku.plugins.material.fieldprocessing.SelectFieldMaterialFieldProcessor;
import fi.muikku.plugins.material.fieldprocessing.TextFieldMaterialFieldProcessor;
import fi.muikku.plugins.material.model.BinaryMaterial;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryChecklistField;
import fi.muikku.plugins.material.model.QueryChecklistFieldOption;
import fi.muikku.plugins.material.model.QueryConnectField;
import fi.muikku.plugins.material.model.QueryConnectFieldCounterpart;
import fi.muikku.plugins.material.model.QueryConnectFieldOption;
import fi.muikku.plugins.material.model.QueryConnectFieldTerm;
import fi.muikku.plugins.material.model.QueryField;
import fi.muikku.plugins.material.model.QueryFileField;
import fi.muikku.plugins.material.model.QuerySelectField;
import fi.muikku.plugins.material.model.QuerySelectFieldOption;
import fi.muikku.plugins.material.model.QueryTextField;

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
      
      MaterialController.class,
      BinaryMaterialController.class,
      HtmlMaterialController.class,
      QueryFieldController.class,
      QueryTextFieldController.class,
      QuerySelectFieldController.class,
      QueryConnectFieldController.class,
      QueryChecklistFieldController.class,
      QueryFileFieldController.class,
       
      /* DAOs */
      
      HtmlMaterialDAO.class,
      BinaryMaterialDAO.class,
      MaterialDAO.class,
      QueryFieldDAO.class,
      QuerySelectFieldDAO.class,
      QueryTextFieldDAO.class,
      QuerySelectFieldOptionDAO.class,
      QueryConnectFieldDAO.class,
      QueryConnectFieldTermDAO.class,
      QueryConnectFieldCounterpartDAO.class,
      QueryChecklistFieldDAO.class,
      QueryChecklistFieldOptionDAO.class,
      QueryFileFieldDAO.class,
      
      /* Field Processors */
      
      MemoFieldMaterialFieldProcessor.class,
      SelectFieldMaterialFieldProcessor.class,
      TextFieldMaterialFieldProcessor.class,
      ConnectFieldMaterialFieldProcessor.class,
      ChecklistFieldMaterialFieldProcessor.class,
      FileFieldMaterialFieldProcessor.class,
      
      /* Listeners */

      HtmlMaterialCreateListener.class,
      HtmlMaterialEmbedListeners.class
    });
  }

  @Override
  public Class<?>[] getEntities() {
    return new Class<?>[] {
      BinaryMaterial.class,
      HtmlMaterial.class,
      Material.class,
      QueryTextField.class,
      QueryField.class,
      QuerySelectField.class,
      QuerySelectFieldOption.class,
      QueryConnectField.class,
      QueryConnectFieldOption.class,
      QueryConnectFieldTerm.class,
      QueryConnectFieldCounterpart.class,
      QueryChecklistField.class,
      QueryChecklistFieldOption.class,
      QueryFileField.class
    };
  }
}
