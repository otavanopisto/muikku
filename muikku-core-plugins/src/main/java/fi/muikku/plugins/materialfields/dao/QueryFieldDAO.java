package fi.muikku.plugins.materialfields.dao;

import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.materialfields.model.QueryField;

public class QueryFieldDAO extends PluginDAO<QueryField> {

	private static final long serialVersionUID = -5327160259588566934L;
	
	public QueryField create(String name, String help, String hint, String type,
			boolean mandatory){
		
		QueryField queryfield = new QueryField();
		
		queryfield.setName(name);
		queryfield.setHelp(help);
		queryfield.setHint(hint);
		queryfield.setType(type);
		queryfield.setMandatory(mandatory);
		
		return persist(queryfield);
		
	}
	

}
