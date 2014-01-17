package fi.muikku.plugins.materialfields.dao;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.materialfields.model.QueryConnectField;

@DAO
public class QueryConnectFieldDAO extends PluginDAO<QueryConnectField> {
	
  private static final long serialVersionUID = 5188632608986411717L;

  public QueryConnectField create(Material material, String name, Boolean mandatory){
		
		QueryConnectField queryConnectField = new QueryConnectField();
		
		queryConnectField.setMaterial(material);
		queryConnectField.setName(name);
		queryConnectField.setMandatory(mandatory);
		
		return persist(queryConnectField);
	}

}
