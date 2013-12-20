package fi.muikku.plugins.materialfields.dao;

import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.materialfields.model.QueryTextField;

public class QueryTextFieldDAO extends PluginDAO<QueryTextField> {

  private static final long serialVersionUID = -5327160259588566934L;

  public QueryTextField create(String name, String help, String hint, boolean mandatory, String text) {

    QueryTextField queryfield = new QueryTextField();

    queryfield.setName(name);
    queryfield.setHelp(help);
    queryfield.setHint(hint);
    queryfield.setType("text");
    queryfield.setMandatory(mandatory);
    queryfield.setText(text);

    return persist(queryfield);
  }

}
