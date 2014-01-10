package fi.muikku.plugins.materialfields.dao;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.materialfields.model.QuerySelectField;

@DAO
public class QuerySelectFieldDAO extends PluginDAO<QuerySelectField> {
	
	private static final long serialVersionUID = -5327160259588566934L;
	
	public QuerySelectField create(Material material, String name, Boolean mandatory){
		
		QuerySelectField querySelectField = new QuerySelectField();
		
		querySelectField.setMaterial(material);
		querySelectField.setName(name);
		querySelectField.setMandatory(mandatory);
		
		return persist(querySelectField);
	}

}
