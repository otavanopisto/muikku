package fi.muikku.plugins.materialfields.dao;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.materialfields.model.QuerySelectField;

@DAO
public class QuerySelectFieldDAO extends PluginDAO<QuerySelectField> {
	
	private static final long serialVersionUID = -5327160259588566934L;
	
	public QuerySelectField create(String name, String help, String hint,
			boolean mandatory, String text){
		
		QuerySelectField queryfield = new QuerySelectField();
		
		queryfield.setName(name);
		queryfield.setHelp(help);
		queryfield.setHint(hint);
		queryfield.setType("select");
		queryfield.setMandatory(mandatory);
		queryfield.setText(text);
		
		return persist(queryfield);
	}

}
