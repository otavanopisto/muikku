package fi.muikku.plugins.materialfields.dao;

import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.materialfields.model.QuerySelectField;
import fi.muikku.plugins.materialfields.model.SelectFieldOption;

public class SelectFieldOptionDAO extends PluginDAO<SelectFieldOption> {

	private static final long serialVersionUID = -5327160259588566934L;
	
	public SelectFieldOption create(String name, String optText, QuerySelectField field){
		
		SelectFieldOption selectFieldOption = new SelectFieldOption();
		selectFieldOption.setName(name);
		selectFieldOption.setOptText(optText);
		selectFieldOption.setSelectField(field);
		
		return persist(selectFieldOption);

	}
}