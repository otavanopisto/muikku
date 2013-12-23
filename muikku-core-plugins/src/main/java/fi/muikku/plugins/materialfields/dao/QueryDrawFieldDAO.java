package fi.muikku.plugins.materialfields.dao;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.materialfields.model.QueryDrawField;

@DAO
public class QueryDrawFieldDAO extends PluginDAO<QueryDrawField> {

  private static final long serialVersionUID = 752946302740645731L;

  public QueryDrawField create(String name, String help, String hint, boolean mandatory, String text, String canvasHtml) {

    QueryDrawField queryDrawField = new QueryDrawField();

    queryDrawField.setName(name);
    queryDrawField.setHelp(help);
    queryDrawField.setHint(hint);
    queryDrawField.setType("draw");
    queryDrawField.setMandatory(mandatory);
    queryDrawField.setText(text);
    queryDrawField.setCanvasHtml(canvasHtml);

    return persist(queryDrawField);

  }

}
